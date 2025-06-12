/**
 * Supabase Connection Test
 * This script will test the Supabase connection and identify the exact issue
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');
  
  // Check environment variables
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('📋 Environment Variables:');
  console.log('URL:', url ? '✅ Set' : '❌ Missing');
  console.log('Anon Key:', anonKey ? '✅ Set' : '❌ Missing');
  console.log('Service Key:', serviceKey ? '✅ Set' : '❌ Missing');
  console.log('');
  
  if (!url || !serviceKey) {
    console.error('❌ Missing required environment variables');
    return;
  }
  
  // Create admin client
  const supabaseAdmin = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  try {
    // Test 1: Check if we can connect to Supabase
    console.log('🔗 Test 1: Basic Connection');
    const { data: healthCheck, error: healthError } = await supabaseAdmin
      .from('_health_check_nonexistent')
      .select('*')
      .limit(1);
    
    // We expect this to fail with a table not found error, which means connection works
    if (healthError) {
      if (healthError.message.includes('does not exist')) {
        console.log('✅ Connection successful (table not found as expected)');
      } else {
        console.error('❌ Connection failed:', healthError.message);
        return;
      }
    } else {
      console.log('✅ Connection successful');
    }
    
    // Test 2: Check if articles table exists
    console.log('\n📊 Test 2: Articles Table Check');
    const { data: articlesCheck, error: articlesError } = await supabaseAdmin
      .from('articles')
      .select('*')
      .limit(1);
    
    if (articlesError) {
      if (articlesError.code === 'PGRST116') {
        console.error('❌ Articles table does not exist');
        console.log('💡 Solution: Create the articles table in your Supabase database');
      } else {
        console.error('❌ Articles table error:', articlesError.message);
        console.error('Error code:', articlesError.code);
      }
    } else {
      console.log('✅ Articles table exists');
      console.log('📋 Sample data count:', articlesCheck.length);
    }
    
    // Test 3: Check if categories table exists  
    console.log('\n📊 Test 3: Categories Table Check');
    const { data: categoriesCheck, error: categoriesError } = await supabaseAdmin
      .from('categories')
      .select('*')
      .limit(1);
    
    if (categoriesError) {
      if (categoriesError.code === 'PGRST116') {
        console.error('❌ Categories table does not exist');
        console.log('💡 Solution: Create the categories table in your Supabase database');
      } else {
        console.error('❌ Categories table error:', categoriesError.message);
        console.error('Error code:', categoriesError.code);
      }
    } else {
      console.log('✅ Categories table exists');
      console.log('📋 Available categories count:', categoriesCheck.length);
    }
    
    // Test 4: Try to insert a test article (only if tables exist)
    if (!articlesError) {
      console.log('\n✍️ Test 4: Article Insert Test');
      const testArticle = {
        title: 'Test Article',
        slug: 'test-article-' + Date.now(),
        excerpt: 'This is a test article to check database insertion.',
        content: '<p>Test content</p>',
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: insertTest, error: insertError } = await supabaseAdmin
        .from('articles')
        .insert(testArticle)
        .select()
        .single();
      
      if (insertError) {
        console.error('❌ Insert failed:', insertError.message);
        console.error('Error details:', {
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint
        });
        
        // Common error solutions
        if (insertError.code === '23503') {
          console.log('💡 Solution: Foreign key constraint failed. Check if category_id exists in categories table.');
        } else if (insertError.code === '42501') {
          console.log('💡 Solution: RLS policy is blocking insert. Disable RLS or add proper policies.');
        } else if (insertError.code === '23505') {
          console.log('💡 Solution: Unique constraint violation. Article slug already exists.');
        }
      } else {
        console.log('✅ Article inserted successfully:', insertTest.id);
        
        // Clean up - delete the test article
        await supabaseAdmin.from('articles').delete().eq('id', insertTest.id);
        console.log('🧹 Test article cleaned up');
      }
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
  }
}

// Run the test
testSupabaseConnection()
  .then(() => {
    console.log('\n🏁 Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });
