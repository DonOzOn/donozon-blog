/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { getImageUsageSummary, getOrphanedImages } from '@/services/image-usage-tracking.service';

export async function GET(request: NextRequest) {
  try {
    const [summary, orphanedImages] = await Promise.all([
      getImageUsageSummary(),
      getOrphanedImages(true)
    ]);

    // Calculate additional metrics
    const now = new Date();
    const eligibleForDeletion = orphanedImages.filter(
      img => img.scheduled_for_deletion_at && new Date(img.scheduled_for_deletion_at) <= now
    ).length;

    const potentialSavings = orphanedImages.reduce((total, img) => total + (img.file_size || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        ...summary,
        eligibleForDeletion,
        potentialSavingsMB: Math.round(potentialSavings / 1024 / 1024 * 100) / 100,
        storageSizeMB: Math.round(summary.storageSize / 1024 / 1024 * 100) / 100,
        utilizationPercent: summary.totalImages > 0 ? Math.round((summary.usedImages / summary.totalImages) * 100) : 0,
      },
    });

  } catch (error) {
    console.error('Get image stats error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get image stats' },
      { status: 500 }
    );
  }
}