import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Server-side Supabase admin client
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // This works on server-side
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API Route: Creating article');
    
    // Verify environment variables are available
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in server environment');
      return NextResponse.json(
        { error: 'Server configuration error: Missing service role key' },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log('📝 API Route: Request body:', body);

    // Validate required fields
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, and content are required' },
        { status: 400 }
      );
    }

    // Get or create the default author profile for DonOzOn
    let defaultAuthorId = null;
    
    // First, try to find existing DonOzOn profile
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .or('username.eq.DonOzOn,full_name.eq.DonOzOn')
      .single();
    
    if (existingProfile) {
      defaultAuthorId = existingProfile.id;
      console.log('📝 Found existing DonOzOn profile:', defaultAuthorId);
    } else {
      // Create a default DonOzOn profile if it doesn't exist
      const { data: newProfile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: 'default-author-donozon', // Use a predictable ID
          username: 'DonOzOn',
          full_name: 'DonOzOn',
          bio: 'Tech enthusiast and blogger sharing insights about development, design, and technology.',
          role: 'admin',
          is_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single();
      
      if (!profileError && newProfile) {
        defaultAuthorId = newProfile.id;
        console.log('✅ Created new DonOzOn profile:', defaultAuthorId);
      } else {
        console.log('⚠️ Could not create default profile, proceeding without author_id');
      }
    }

    // Clean the data
    const articleData = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || null,
      content: body.content || null,
      category_id: body.category_id || null,
      author_id: body.author_id || defaultAuthorId, // Use provided author or default to DonOzOn
      featured_image_url: body.featured_image_url || null,
      featured_image_alt: body.featured_image_alt || null,
      meta_title: body.meta_title || null,
      meta_description: body.meta_description || null,
      meta_keywords: body.meta_keywords || null,
      is_featured: body.is_featured || false,
      status: body.status || 'draft',
      reading_time: body.reading_time || 1,
      published_at: body.status === 'published' ? new Date().toISOString() : null,
    };

    console.log('🧹 API Route: Cleaned article data:', articleData);

    // Insert article using admin client (server-side)
    const { data, error } = await supabaseAdmin
      .from('articles')
      .insert(articleData)
      .select()
      .single();

    if (error) {
      console.error('❌ API Route: Supabase error:', error);
      
      // Enhanced error handling
      if (error.code === '23505') {
        return NextResponse.json(
          { error: `Article with slug "${articleData.slug}" already exists` },
          { status: 409 }
        );
      }
      
      if (error.code === '23502') {
        return NextResponse.json(
          { error: `Missing required field: ${error.message}` },
          { status: 400 }
        );
      }
      
      if (error.code === '23503') {
        return NextResponse.json(
          { error: `Invalid reference: ${error.message}` },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'No data returned from database' },
        { status: 500 }
      );
    }

    console.log('✅ API Route: Article created successfully:', data.id);
    
    return NextResponse.json({ 
      success: true, 
      data,
      message: 'Article created successfully'
    });

  } catch (error: any) {
    console.error('💥 API Route: Exception:', error);
    
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('📡 API Route GET: Fetching all articles for admin');
    
    // Get all articles for admin with flattened category data
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select(`
        *,
        categories!inner(
          id,
          name,
          slug,
          color
        ),
        profiles(
          full_name,
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ API Route GET: Database error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Flatten the data structure to match the expected format
    const flattenedData = data?.map(article => ({
      ...article,
      category_name: article.categories?.name || 'Uncategorized',
      category_slug: article.categories?.slug || 'uncategorized',
      category_color: article.categories?.color || '#6b7280',
      author_name: article.profiles?.full_name || article.profiles?.username || 'DonOzOn',
      author_avatar: article.profiles?.avatar_url || null,
      // Remove the nested objects since we've flattened them
      categories: undefined,
      profiles: undefined
    })) || [];

    console.log('✅ API Route GET: Articles fetched successfully');
    console.log('📊 API Route GET: Articles count:', flattenedData?.length || 0);
    console.log('📋 API Route GET: Sample article with categories:', flattenedData?.slice(0, 2).map(a => ({ 
      id: a.id, 
      title: a.title,
      category_name: a.category_name,
      author_name: a.author_name
    })));

    return NextResponse.json({ success: true, data: flattenedData });
  } catch (error: any) {
    console.error('💥 API Route GET: Exception:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}