import { NextRequest, NextResponse } from 'next/server';
import { imageManagementService } from '@/services/image-management.service';

/**
 * Batch operations for image management
 * POST /api/admin/images/batch
 */
export async function POST(request: NextRequest) {
  try {
    const { action, imageIds, articleId, settings } = await request.json();

    console.log(`📦 Batch operation requested: ${action}`, { imageIds, articleId, settings });

    switch (action) {
      case 'delete':
        if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
          return NextResponse.json(
            { error: 'Image IDs are required for delete operation' },
            { status: 400 }
          );
        }

        const deleteResult = await imageManagementService.forceDeleteImages(imageIds);
        return NextResponse.json({
          success: true,
          message: `Deleted ${deleteResult.deleted} images`,
          data: deleteResult,
        });

      case 'cleanup':
        const cleanupResult = await imageManagementService.runCleanupJob();
        return NextResponse.json({
          success: true,
          message: `Cleanup completed: ${cleanupResult.deleted_count} images deleted`,
          data: cleanupResult,
        });

      case 'restore':
        if (!articleId) {
          return NextResponse.json(
            { error: 'Article ID is required for restore operation' },
            { status: 400 }
          );
        }

        const restoreCount = await imageManagementService.restoreArticleImages(articleId);
        return NextResponse.json({
          success: true,
          message: `Restored ${restoreCount} images for article`,
          data: { restoredCount: restoreCount },
        });

      case 'sync':
        // Sync all articles' image usage
        const articles = await getAllArticleIds(); // You'll need to implement this
        let syncedCount = 0;

        for (const article of articles) {
          try {
            if (article.content) {
              await imageManagementService.updateArticleImageUsageEnhanced(
                article.id,
                article.content,
                article.featured_image_url
              );
              syncedCount++;
            }
          } catch (error) {
            console.error(`Failed to sync images for article ${article.id}:`, error);
          }
        }

        return NextResponse.json({
          success: true,
          message: `Synced image usage for ${syncedCount} articles`,
          data: { syncedCount },
        });

      case 'optimize':
        // This could include converting images to WebP, resizing, etc.
        // For now, just return stats
        const stats = await imageManagementService.getGlobalImageStats();
        return NextResponse.json({
          success: true,
          message: 'Image optimization analysis completed',
          data: { stats },
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Batch operation error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Batch operation failed',
        success: false 
      },
      { status: 500 }
    );
  }
}

// Helper function to get all articles - you may need to adjust this based on your setup
async function getAllArticleIds() {
  try {
    // This is a placeholder - replace with your actual implementation
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/articles`);
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Failed to fetch articles for sync:', error);
    return [];
  }
}
