/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Server-side Supabase admin client
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ Image Delete: Starting delete process');

    const body = await request.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image URL provided' },
        { status: 400 }
      );
    }

    // Extract file path from the Supabase storage URL
    const extractFilePathFromUrl = (url: string): string | null => {
      try {
        // URL format: https://project.supabase.co/storage/v1/object/public/bucket-name/path/to/file
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        
        // Find the index of 'public' and get everything after bucket name
        const publicIndex = pathParts.indexOf('public');
        if (publicIndex === -1 || publicIndex + 2 >= pathParts.length) {
          return null;
        }
        
        // Skip 'public' and bucket name, get the rest
        const filePath = pathParts.slice(publicIndex + 2).join('/');
        return filePath;
      } catch (error) {
        console.error('Error extracting file path from URL:', error);
        return null;
      }
    };

    const filePath = extractFilePathFromUrl(imageUrl);
    
    if (!filePath) {
      return NextResponse.json(
        { error: 'Invalid image URL format' },
        { status: 400 }
      );
    }

    console.log('📁 Image Delete: Extracted file path:', filePath);

    // Delete from Supabase Storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('article-images')
      .remove([filePath]);

    if (storageError) {
      console.error('❌ Image Delete: Storage error:', storageError);
      return NextResponse.json(
        { error: `Failed to delete from storage: ${storageError.message}` },
        { status: 500 }
      );
    }

    // Delete from media table (optional, since this is for cleanup)
    try {
      const { error: mediaError } = await supabaseAdmin
        .from('media')
        .delete()
        .eq('file_url', imageUrl);

      if (mediaError) {
        console.warn('⚠️ Image Delete: Could not delete media record:', mediaError);
        // Don't fail the request if we can't delete the media record
      } else {
        console.log('✅ Image Delete: Media record deleted');
      }
    } catch (mediaError) {
      console.warn('⚠️ Image Delete: Media deletion error:', mediaError);
    }

    console.log('✅ Image Delete: File deleted successfully from storage');

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
      deletedPath: filePath
    });

  } catch (error: any) {
    console.error('💥 Image Delete: Exception:', error);
    return NextResponse.json(
      { error: `Delete failed: ${error.message}` },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}