import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToImageKit, generateArticleImageFileName } from '@/lib/imagekit';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const articleId = formData.get('articleId') as string;

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

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate file name
    const fileName = generateArticleImageFileName(articleId);
    const folder = articleId ? `/blog-articles/${articleId}/` : '/blog-articles/temp/';

    // Upload to ImageKit
    const uploadResult = await uploadImageToImageKit(
      buffer,
      fileName,
      folder
    );

    // Track in database 
    try {
      const { error: dbError } = await supabase
        .from('article_images')
        .insert({
          article_id: articleId || null, // Allow null for temp/orphaned images
          imagekit_file_id: uploadResult.fileId,
          imagekit_url: uploadResult.url,
          file_name: uploadResult.name,
          file_size: uploadResult.size,
          mime_type: file.type,
          folder_path: folder,
          is_used: false, // Mark as unused initially - will be updated when article content is processed
          is_featured_image: false,
        });

      if (dbError) {
        console.error('Failed to track image in database:', dbError);
        // Don't fail the upload, just log the error
        console.warn('Image uploaded to ImageKit but not tracked in database');
      } else {
        console.log(`✅ Image tracked in database: ${uploadResult.url} ${articleId ? `(article: ${articleId})` : '(orphaned)'}`);
      }
    } catch (trackingError) {
      console.error('Error tracking image:', trackingError);
      // Continue with successful upload even if tracking fails
    }

    return NextResponse.json({
      success: true,
      data: {
        fileId: uploadResult.fileId,
        url: uploadResult.url,
        name: uploadResult.name,
        size: uploadResult.size,
        fileName: fileName,
        folder: folder,
      },
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}