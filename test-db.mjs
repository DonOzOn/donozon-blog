#!/usr/bin/env node

/**
 * Quick test script to check database structure and API responses
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  console.log('🔍 Testing database structure...\n');

  // Test categories
  console.log('📋 Categories:');
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .limit(5);

  if (catError) {
    console.error('❌ Categories error:', catError);
  } else {
    console.log(`✅ Found ${categories?.length || 0} categories`);
    categories?.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug}) [${cat.color || 'no color'}]`);
    });
  }

  console.log('');

  // Test articles with categories
  console.log('📰 Articles with categories:');
  const { data: articles, error: artError } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      status,
      category_id,
      categories(name, slug, color)
    `)
    .limit(3);

  if (artError) {
    console.error('❌ Articles error:', artError);
  } else {
    console.log(`✅ Found ${articles?.length || 0} articles`);
    articles?.forEach(art => {
      console.log(`   - "${art.title}" [${art.status}]`);
      console.log(`     Category: ${art.categories?.name || 'NULL'} (ID: ${art.category_id || 'NULL'})`);
    });
  }

  console.log('');

  // Test our API route
  console.log('🌐 Testing API route...');
  try {
    const response = await fetch('http://localhost:3000/api/admin/articles');
    if (response.ok) {
      const result = await response.json();
      console.log('✅ API Response structure:');
      console.log(`   - Success: ${result.success}`);
      console.log(`   - Articles count: ${result.data?.length || 0}`);
      
      if (result.data && result.data.length > 0) {
        const sample = result.data[0];
        console.log('   - Sample article fields:');
        console.log(`     * title: ${sample.title}`);
        console.log(`     * category_name: ${sample.category_name || 'MISSING'}`);
        console.log(`     * category_slug: ${sample.category_slug || 'MISSING'}`);
        console.log(`     * author_name: ${sample.author_name || 'MISSING'}`);
      }
    } else {
      console.error(`❌ API error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ API test failed - server may not be running');
    console.log('💡 Start the server with: npm run dev');
  }
}

testDatabase().catch(console.error);
