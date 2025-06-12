import { NextRequest, NextResponse } from 'next/server';
import { imageManagementService } from '@/services/image-management.service';

/**
 * Cron job for automated image cleanup
 * This endpoint should be called by a cron job service (e.g., Vercel Cron, GitHub Actions, etc.)
 * 
 * Example cron schedules:
 * - Daily at 2 AM: "0 2 * * *"
 * - Every 6 hours: "0 star/6 * * *"
 * - Weekly on Sunday at 3 AM: "0 3 * * 0"
 */
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from a legitimate cron job
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn('🚨 Unauthorized cron job attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const startTime = Date.now();
    console.log('🕐 Automated image cleanup started:', new Date().toISOString());

    // Configuration for automated cleanup
    const config = {
      maxAgeHours: 48, // Delete unused images older than 48 hours
      batchSize: 100,  // Process up to 100 images per run
      enableOrphanCleanup: true, // Clean up orphaned images
      enableSizeOptimization: true, // Future: optimize large images
    };

    const results = {
      standardCleanup: null,
      orphanedCleanup: null,
      errors: [],
      stats: null,
    };

    try {
      // 1. Standard cleanup job
      console.log('🧹 Running standard cleanup...');
      results.standardCleanup = await imageManagementService.runCleanupJob();
      console.log(`✅ Standard cleanup: ${results.standardCleanup.deleted_count} images deleted`);
    } catch (error) {
      console.error('❌ Standard cleanup failed:', error);
      results.errors.push(`Standard cleanup failed: ${error.message}`);
    }

    try {
      // 2. Age-based cleanup for orphaned images
      if (config.enableOrphanCleanup) {
        console.log('🧹 Running orphaned image cleanup...');
        
        const unusedImages = await imageManagementService.getUnusedImages();
        const oldOrphanedImages = unusedImages.filter(img => {
          const ageInHours = (Date.now() - new Date(img.created_at).getTime()) / (1000 * 60 * 60);
          return ageInHours > config.maxAgeHours && !img.article_id;
        });

        if (oldOrphanedImages.length > 0) {
          const batchIds = oldOrphanedImages.slice(0, config.batchSize).map(img => img.id);
          results.orphanedCleanup = await imageManagementService.forceDeleteImages(batchIds);
          console.log(`✅ Orphaned cleanup: ${results.orphanedCleanup.deleted} images deleted`);
        } else {
          console.log('ℹ️ No orphaned images to clean up');
          results.orphanedCleanup = { deleted: 0, failed: [] };
        }
      }
    } catch (error) {
      console.error('❌ Orphaned cleanup failed:', error);
      results.errors.push(`Orphaned cleanup failed: ${error.message}`);
    }

    try {
      // 3. Get final statistics
      results.stats = await imageManagementService.getGlobalImageStats();
    } catch (error) {
      console.error('❌ Failed to get final stats:', error);
      results.errors.push(`Stats collection failed: ${error.message}`);
    }

    const duration = Date.now() - startTime;
    const totalDeleted = (results.standardCleanup?.deleted_count || 0) + (results.orphanedCleanup?.deleted || 0);

    console.log(`🎉 Automated cleanup completed in ${duration}ms:`, {
      totalDeleted,
      standardDeleted: results.standardCleanup?.deleted_count || 0,
      orphanedDeleted: results.orphanedCleanup?.deleted || 0,
      errors: results.errors.length,
    });

    // Log to monitoring service if available
    if (process.env.MONITORING_WEBHOOK_URL) {
      try {
        await fetch(process.env.MONITORING_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'image_cleanup',
            timestamp: new Date().toISOString(),
            duration,
            totalDeleted,
            errors: results.errors,
            stats: results.stats,
          }),
        });
      } catch (monitoringError) {
        console.warn('Failed to send monitoring data:', monitoringError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Automated cleanup completed: ${totalDeleted} images deleted`,
      data: {
        duration,
        config,
        results,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('🚨 Automated cleanup job failed:', error);
    
    // Send error notification if monitoring is configured
    if (process.env.MONITORING_WEBHOOK_URL) {
      try {
        await fetch(process.env.MONITORING_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'image_cleanup_error',
            timestamp: new Date().toISOString(),
            error: error.message,
            stack: error.stack,
          }),
        });
      } catch (monitoringError) {
        console.warn('Failed to send error notification:', monitoringError);
      }
    }

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Automated cleanup failed',
        success: false,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check if cron job is properly configured
 */
export async function GET() {
  const isConfigured = !!process.env.CRON_SECRET;
  const nextRun = getNextCronRun(); // You can implement this based on your cron schedule
  
  return NextResponse.json({
    success: true,
    data: {
      isConfigured,
      cronSecret: isConfigured ? 'Configured' : 'Missing',
      nextScheduledRun: nextRun,
      endpoint: '/api/cron/cleanup-images',
      lastRun: await getLastCronRun(), // You can implement this to track last run time
    },
  });
}

// Helper functions (implement based on your needs)
function getNextCronRun() {
  // This is a placeholder - implement based on your cron schedule
  const now = new Date();
  const tomorrow2AM = new Date(now);
  tomorrow2AM.setDate(tomorrow2AM.getDate() + 1);
  tomorrow2AM.setHours(2, 0, 0, 0);
  return tomorrow2AM.toISOString();
}

async function getLastCronRun() {
  // This is a placeholder - you could store this in your database
  // or read from a log file, etc.
  return null;
}
