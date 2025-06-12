import { NextRequest, NextResponse } from 'next/server';
import { imageManagementService } from '@/services/image-management.service';

/**
 * Scheduled cleanup job for unused images
 * POST /api/admin/images/cleanup
 * 
 * This endpoint can be called by:
 * 1. Manual admin action
 * 2. Cron jobs (via /api/cron/cleanup-images)
 * 3. Scheduled tasks
 */
export async function POST(request: NextRequest) {
  try {
    const { 
      dryRun = false, 
      maxAge = 24, // hours
      batchSize = 50,
      forceDelete = false 
    } = await request.json();

    console.log(`🧹 Cleanup job started:`, {
      dryRun,
      maxAge,
      batchSize,
      forceDelete,
      timestamp: new Date().toISOString()
    });

    if (dryRun) {
      // Get counts without deleting
      const unusedImages = await imageManagementService.getUnusedImages();
      const oldUnusedImages = unusedImages.filter(img => {
        const ageInHours = (Date.now() - new Date(img.created_at).getTime()) / (1000 * 60 * 60);
        return ageInHours > maxAge;
      });

      return NextResponse.json({
        success: true,
        dryRun: true,
        message: `Cleanup simulation completed`,
        data: {
          totalUnused: unusedImages.length,
          eligibleForDeletion: oldUnusedImages.length,
          estimatedSpaceSaved: oldUnusedImages.reduce((sum, img) => sum + (img.file_size || 0), 0),
          settings: { maxAge, batchSize, forceDelete }
        },
      });
    }

    // Run actual cleanup
    const result = await imageManagementService.runCleanupJob();

    // Enhanced cleanup with age-based filtering
    if (maxAge > 0) {
      const unusedImages = await imageManagementService.getUnusedImages();
      const oldUnusedImages = unusedImages.filter(img => {
        const ageInHours = (Date.now() - new Date(img.created_at).getTime()) / (1000 * 60 * 60);
        return ageInHours > maxAge;
      });

      if (oldUnusedImages.length > 0) {
        const batchIds = oldUnusedImages.slice(0, batchSize).map(img => img.id);
        const batchResult = await imageManagementService.forceDeleteImages(batchIds);
        
        console.log(`🧹 Age-based cleanup: ${batchResult.deleted} old unused images deleted`);
        
        return NextResponse.json({
          success: true,
          message: `Cleanup completed: ${result.deleted_count + batchResult.deleted} total images deleted`,
          data: {
            standardCleanup: result,
            ageBased: batchResult,
            settings: { maxAge, batchSize, forceDelete }
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Standard cleanup completed: ${result.deleted_count} images deleted`,
      data: {
        standardCleanup: result,
        settings: { maxAge, batchSize, forceDelete }
      },
    });

  } catch (error) {
    console.error('Cleanup job error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Cleanup job failed',
        success: false 
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check cleanup status and get statistics
 */
export async function GET() {
  try {
    const [unusedImages, globalStats] = await Promise.all([
      imageManagementService.getUnusedImages(),
      imageManagementService.getGlobalImageStats(),
    ]);

    // Calculate age statistics
    const now = Date.now();
    const ageGroups = {
      lessThan1Hour: 0,
      lessThan1Day: 0,
      lessThan1Week: 0,
      moreThan1Week: 0,
    };

    unusedImages.forEach(img => {
      const ageInHours = (now - new Date(img.created_at).getTime()) / (1000 * 60 * 60);
      
      if (ageInHours < 1) {
        ageGroups.lessThan1Hour++;
      } else if (ageInHours < 24) {
        ageGroups.lessThan1Day++;
      } else if (ageInHours < 168) { // 7 days
        ageGroups.lessThan1Week++;
      } else {
        ageGroups.moreThan1Week++;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        globalStats,
        unusedImages: {
          total: unusedImages.length,
          ageGroups,
          totalSize: unusedImages.reduce((sum, img) => sum + (img.file_size || 0), 0),
        },
        recommendedActions: {
          immediate: ageGroups.moreThan1Week > 0 ? `Delete ${ageGroups.moreThan1Week} images older than 1 week` : null,
          scheduled: ageGroups.lessThan1Day > 0 ? `${ageGroups.lessThan1Day} images eligible for cleanup in 24h` : null,
        }
      },
    });

  } catch (error) {
    console.error('Cleanup status error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to get cleanup status',
        success: false 
      },
      { status: 500 }
    );
  }
}
