import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function enableAutoSetup() {
  console.log('🚀 Enabling automatic image management setup...');
  
  try {
    // First, create a helper function that can execute SQL
    const createExecFunctionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql_text TEXT)
      RETURNS TEXT
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql_text;
        RETURN 'OK';
      END;
      $$;
    `;
    
    console.log('📝 Creating SQL execution helper...');
    
    // Try to create the exec function using a direct SQL call
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
      },
      body: JSON.stringify({ 
        query: createExecFunctionSQL
      })
    });
    
    if (response.ok) {
      console.log('✅ SQL execution helper created');
      
      // Now read and execute the auto-setup SQL
      const autoSetupSQL = readFileSync('./auto-image-setup.sql', 'utf-8');
      
      console.log('📝 Setting up image management tables...');
      
      const { error } = await supabase.rpc('exec_sql', { sql_text: autoSetupSQL });
      
      if (error) {
        console.log('❌ Auto-setup failed:', error.message);
        console.log('📋 Please run manual migration instead');
        return false;
      }
      
      console.log('✅ Image management tables created');
      
      // Test the setup
      const { data: testData, error: testError } = await supabase
        .from('article_images')
        .select('count(*)')
        .limit(1);
        
      if (testError) {
        console.log('❌ Setup verification failed:', testError.message);
        return false;
      }
      
      console.log('✅ Setup verification successful');
      console.log('🎉 Auto-setup is now enabled!');
      console.log('📷 Images will be tracked automatically when you save articles');
      
      return true;
      
    } else {
      console.log('❌ Could not create SQL helper');
      console.log('📋 Please run manual migration instead');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Auto-setup failed:', error);
    console.log('📋 Please run manual migration instead');
    return false;
  }
}

async function runBackfillAfterSetup() {
  console.log('\\n🔄 Running backfill to track existing images...');
  
  try {
    const { AutoImageSetup } = await import('./src/services/auto-image-setup.service');
    
    // Get all articles
    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, title, content, featured_image_url');
      
    if (error) {
      console.log('❌ Could not fetch articles:', error.message);
      return;
    }
    
    console.log(`📄 Processing ${articles.length} existing articles...`);
    
    for (const article of articles) {
      if (article.content || article.featured_image_url) {
        console.log(`📝 Processing: "${article.title}"`);
        await AutoImageSetup.trackArticleImages(
          article.id,
          article.content || '',
          article.featured_image_url || undefined
        );
      }
    }
    
    console.log('✅ Backfill completed!');
    console.log('🎊 Visit /admin/images to see your tracked images');
    
  } catch (error) {
    console.error('❌ Backfill failed:', error);
  }
}

// Main execution
async function main() {
  const setupSuccess = await enableAutoSetup();
  
  if (setupSuccess) {
    await runBackfillAfterSetup();
  } else {
    console.log('\\n📋 Manual Setup Required:');
    console.log('1. Go to: https://supabase.com/dashboard/project/xhzurxmliuvexekfilfo/sql');
    console.log('2. Copy content from: run-image-migration.sql');
    console.log('3. Paste and click "Run"');
    console.log('4. Then run: node backfill-images.mjs');
  }
  
  process.exit(0);
}

main();
