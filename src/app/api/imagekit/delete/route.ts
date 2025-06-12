import { NextRequest, NextResponse } from 'next/server';
import { deleteImageFromImageKit } from '@/lib/imagekit';
import { supabase } from '@/lib/supabase';

export async function DELETE(request: NextRequest) {
  try {
    const { fileId, imageUrl } = await request.json();

    if (!fileId && !imageUrl) {
      return NextResponse.json(
        { error: 'Either fileId or imageUrl must be provided' },
        { status: 400 }
      );
    }

    let actualFileId = fileId;

    // If only imageUrl is provided, try to find the fileId in database
    if (!actualFileId && imageUrl) {
      const { data: imageRecord } = await supabase
        .from('article_images')
        .select('imagekit_file_id')
        .eq('imagekit_url', imageUrl)
        .single();

      if (imageRecord) {
        actualFileId = imageRecord.imagekit_file_id;
      }
    }

    if (!actualFileId) {
      return NextResponse.json(
        { error: 'Could not determine file ID for deletion' },
        { status: 400 }
      );
    }

    // Delete from ImageKit
    await deleteImageFromImageKit(actualFileId);

    // Mark as deleted in database
    if (imageUrl) {
      const { error: dbError } = await supabase
        .from('article_images')
        .update({ 
          deleted_at: new Date().toISOString(),
          is_used: false 
        })
        .eq('imagekit_url', imageUrl);

      if (dbError) {
        console.error('Failed to mark image as deleted in database:', dbError);
        // Don't fail the deletion, just log the error
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });

  } catch (error) {
    console.error('Image deletion error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Delete failed' },
      { status: 500 }
    );
  }
}
