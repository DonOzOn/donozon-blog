import { NextRequest, NextResponse } from 'next/server';
import { imageManagementService } from '@/services/image-management.service';

/**
 * Auto-delete images that are no longer used in article content
 * POST /api/admin/images/auto-delete
 */
export async function POST(request: NextRequest) {
  try {
    const { articleId, currentContent } = await request.json();

    if (!articleId || typeof currentContent !== 'string') {
      return NextResponse.json(
        { error: 'Article ID and current content are required' },
        { status: 400 }
      );
    }

    console.log(`🔄 Auto-delete check for article ${articleId}`);

    // Update image usage and auto-delete removed images
    const result = await imageManagementService.updateArticleImageUsage(
      articleId,
      currentContent
    );

    return NextResponse.json({
      success: true,
      message: 'Image auto-deletion check completed',
      result,
    });

  } catch (error) {
    console.error('Auto-delete API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Auto-delete failed',
        success: false 
      },
      { status: 500 }
    );
  }
}
