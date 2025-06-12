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

// GET /api/admin/articles/[id] - Get single article
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select(`
        *,
        categories(name, slug, color)
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/admin/articles/[id] - Update article
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('📝 API Update Article: Starting update for ID:', params.id);
    
    const body = await request.json();
    console.log('📝 API Update Article: Request body:', body);
    
    // Validate required fields
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    // Clean the data - ensure null values for empty strings
    const cleanData = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || null,
      content: body.content || null,
      category_id: body.category_id || null,
      featured_image_url: body.featured_image_url || null,
      featured_image_alt: body.featured_image_alt || null,
      meta_title: body.meta_title || null,
      meta_description: body.meta_description || null,
      meta_keywords: body.meta_keywords || null,
      is_featured: Boolean(body.is_featured),
      status: body.status || 'draft',
      reading_time: body.reading_time || 1,
      published_at: body.published_at || null,
      updated_at: new Date().toISOString()
    };

    console.log('📝 API Update Article: Clean data:', cleanData);
    
    const { data, error } = await supabaseAdmin
      .from('articles')
      .update(cleanData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('❌ API Update Article: Database error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    console.log('✅ API Update Article: Update successful');
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('💥 API Update Article: Exception:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/articles/[id] - Delete article
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from('articles')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}