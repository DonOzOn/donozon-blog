import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (url) {
      // Look up specific URL
      const { data: exactMatch } = await supabase
        .from('article_images')
        .select('*')
        .eq('imagekit_url', url);

      const { data: partialMatches } = await supabase
        .from('article_images')
        .select('*')
        .ilike('imagekit_url', `%${url.split('/').pop()}%`);

      return NextResponse.json({
        searchedUrl: url,
        exactMatch,
        partialMatches,
        urlParts: {
          full: url,
          filename: url.split('/').pop(),
          host: new URL(url).host,
          pathname: new URL(url).pathname,
        }
      });
    }

    // Get all images
    const { data: allImages } = await supabase
      .from('article_images')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      totalImages: allImages?.length || 0,
      recentImages: allImages,
    });

  } catch (error) {
    console.error('Debug images error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Debug failed' },
      { status: 500 }
    );
  }
}