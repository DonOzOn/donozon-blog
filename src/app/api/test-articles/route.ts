/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🧪 Testing article data fetch...');
    
    // Test 1: Check if we can connect to Supabase
    const { data: testConnection, error: testError } = await supabase
      .from('published_articles')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Supabase connection error:', testError);
      return NextResponse.json({ 
        error: 'Supabase connection failed', 
        details: testError 
      }, { status: 500 });
    }
    
    console.log('✅ Supabase connection successful');
    
    // Test 2: Fetch featured articles
    const { data: featuredArticles, error: featuredError } = await supabase
      .from('published_articles')
      .select('*')
      .eq('is_featured', true)
      .limit(5);
    
    // Test 3: Fetch all published articles
    const { data: allArticles, error: allError } = await supabase
      .from('published_articles')
      .select('*')
      .limit(10);
    
    // Test 4: Check articles table directly
    const { data: articlesFromTable, error: tableError } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .limit(5);
    
    return NextResponse.json({
      success: true,
      tests: {
        connection: { success: !testError, error: testError },
        featured: { 
          success: !featuredError, 
          count: featuredArticles?.length || 0,
          data: featuredArticles,
          error: featuredError 
        },
        allPublished: { 
          success: !allError, 
          count: allArticles?.length || 0,
          data: allArticles?.slice(0, 3), // Only first 3 for brevity
          error: allError 
        },
        articlesTable: {
          success: !tableError,
          count: articlesFromTable?.length || 0,
          data: articlesFromTable?.slice(0, 2),
          error: tableError
        }
      }
    });
    
  } catch (error) {
    console.error('💥 Test API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error 
    }, { status: 500 });
  }
}
