import { NextRequest, NextResponse } from 'next/server';
import { deleteImageFromImageKit } from '@/lib/imagekit';
import { supabase } from '@/lib/supabase';

export async function DELETE(request: NextRequest) {
  try {
    const { fileId, imageUrl } = await request.json();

    console.log('🗑️ ImageKit Delete API called:', { fileId, imageUrl });

    if (!fileId && !imageUrl) {
      return NextResponse.json(
        { error: 'Either fileId or imageUrl must be provided' },
        { status: 400 }
      );
    }

    let actualFileId = fileId;

    // If only imageUrl is provided, try to find the fileId in database
    if (!actualFileId && imageUrl) {
      console.log('📊 Looking up file ID in database for URL:', imageUrl);
      
      const { data: imageRecord, error: lookupError } = await supabase
        .from('article_images')
        .select('imagekit_file_id')
        .eq('imagekit_url', imageUrl)
        .single();

      console.log('📊 Database lookup result:', { imageRecord, lookupError });

      if (imageRecord) {
        actualFileId = imageRecord.imagekit_file_id;
        console.log('✅ Found file ID in database:', actualFileId);
      } else {
        console.log('❌ Image not found in database, trying alternative methods...');
        
        // Try to search by partial URL match
        const { data: partialMatches } = await supabase
          .from('article_images')
          .select('imagekit_file_id, imagekit_url')
          .ilike('imagekit_url', `%${imageUrl.split('/').pop()}%`);
        
        console.log('🔍 Partial URL matches:', partialMatches);
        
        if (partialMatches && partialMatches.length > 0) {
          actualFileId = partialMatches[0].imagekit_file_id;
          console.log('✅ Found file ID via partial match:', actualFileId);
        }
      }
    }

    if (!actualFileId) {
      console.log('❌ Could not determine file ID for deletion');
      return NextResponse.json(
        { 
          error: 'Could not determine file ID for deletion',
          debug: { providedFileId: fileId, providedImageUrl: imageUrl }
        },
        { status: 400 }
      );
    }

    console.log('🗑️ Attempting to delete from ImageKit with file ID:', actualFileId);

    // Delete from ImageKit
    await deleteImageFromImageKit(actualFileId);
    console.log('✅ Successfully deleted from ImageKit');

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
      } else {
        console.log('✅ Marked image as deleted in database');
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
      fileId: actualFileId,
    });

  } catch (error) {
    console.error('❌ Image deletion error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Delete failed' },
      { status: 500 }
    );
  }
}
