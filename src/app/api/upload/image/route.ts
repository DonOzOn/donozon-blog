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

export async function POST(request: NextRequest) {
  try {
    console.log('🖼️ Image Upload: Starting upload process');

    // Check if the request contains form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const altText = formData.get('altText') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const filePath = `articles/${fileName}`;

    console.log('📁 Image Upload: File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      generatedPath: filePath
    });

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('article-images')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        duplex: 'half'
      });

    if (uploadError) {
      console.error('❌ Image Upload: Storage error:', uploadError);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('article-images')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to get public URL' },
        { status: 500 }
      );
    }

    // Store media record in database
    const mediaData = {
      filename: fileName,
      original_filename: file.name,
      file_path: filePath,
      file_url: urlData.publicUrl,
      file_size: file.size,
      mime_type: file.type,
      alt_text: altText || null,
      uploaded_by: null // We'll set this when we have authentication
    };

    const { data: mediaRecord, error: mediaError } = await supabaseAdmin
      .from('media')
      .insert(mediaData)
      .select()
      .single();

    if (mediaError) {
      console.error('❌ Image Upload: Database error:', mediaError);
      // Still return the URL even if we can't save to database
      console.log('⚠️ Image Upload: File uploaded but not recorded in database');
    }

    console.log('✅ Image Upload: Upload successful:', {
      url: urlData.publicUrl,
      path: filePath,
      mediaId: mediaRecord?.id
    });

    return NextResponse.json({
      success: true,
      data: {
        url: urlData.publicUrl,
        path: filePath,
        filename: fileName,
        originalFilename: file.name,
        size: file.size,
        type: file.type,
        altText: altText || null,
        mediaId: mediaRecord?.id || null
      },
      message: 'Image uploaded successfully'
    });

  } catch (error: any) {
    console.error('💥 Image Upload: Exception:', error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message}` },
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}