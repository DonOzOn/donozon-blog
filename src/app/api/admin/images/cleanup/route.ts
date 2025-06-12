import { NextRequest, NextResponse } from 'next/server';
import { imageManagementService } from '@/services/image-management.service';

export async function POST(request: NextRequest) {
  try {
    // Run the cleanup job
    const result = await imageManagementService.runCleanupJob();

    return NextResponse.json({
      success: true,
      data: {
        deleted_count: result.deleted_count,
        deleted_images: result.deleted_images,
        message: result.deleted_count > 0 
          ? `Successfully deleted ${result.deleted_count} images`
          : 'No images were eligible for cleanup',
      },
    });

  } catch (error) {
    console.error('Cleanup job error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Cleanup job failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get cleanup statistics without running the job
    const [unusedImages, pendingDeletionImages, globalStats] = await Promise.all([
      imageManagementService.getUnusedImages(),
      imageManagementService.getImagesMarkedForDeletion(),
      imageManagementService.getGlobalImageStats(),
    ]);

    // Count how many are eligible for immediate cleanup
    const eligibleForCleanup = pendingDeletionImages.filter(
      img => img.marked_for_deletion_at && new Date(img.marked_for_deletion_at) <= new Date()
    ).length;

    return NextResponse.json({
      success: true,
      data: {
        global_stats: globalStats,
        unused_images_count: unusedImages.length,
        pending_deletion_count: pendingDeletionImages.length,
        eligible_for_cleanup: eligibleForCleanup,
      },
    });

  } catch (error) {
    console.error('Get cleanup stats error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get cleanup stats' },
      { status: 500 }
    );
  }
}
