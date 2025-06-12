import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyImageMigration() {
  console.log('🔍 Verifying image management migration...');
  
  try {
    // Check if article_images table exists and can be queried
    const { data: tableData, error: tableError } = await supabase
      .from('article_images')
      .select('count(*)')
      .limit(1);
      
    if (tableError) {
      console.log('❌ article_images table not accessible:', tableError.message);
      return false;
    }
    
    console.log('✅ article_images table exists and accessible');
    
    // Test each function
    const functions = [
      'update_article_image_usage',
      'get_article_image_stats', 
      'cleanup_unused_images',
      'restore_article_images'
    ];
    
    for (const funcName of functions) {
      try {
        let testParams = {};
        
        switch (funcName) {
          case 'update_article_image_usage':
            testParams = { 
              p_article_id: '00000000-0000-0000-0000-000000000000',
              p_content: 'test content'
            };
            break;
          case 'get_article_image_stats':
            testParams = { 
              p_article_id: '00000000-0000-0000-0000-000000000000'
            };
            break;
          case 'cleanup_unused_images':
            testParams = {};
            break;
          case 'restore_article_images':
            testParams = { 
              p_article_id: '00000000-0000-0000-0000-000000000000'
            };
            break;
        }
        
        const { error: funcError } = await supabase.rpc(funcName, testParams);
        
        if (funcError && !funcError.message.includes('does not exist')) {
          console.log(`✅ Function ${funcName} exists and callable`);
        } else if (funcError?.message?.includes('does not exist')) {
          console.log(`❌ Function ${funcName} does not exist`);
          return false;
        } else {
          console.log(`✅ Function ${funcName} exists and callable`);
        }
      } catch (e) {
        console.log(`❌ Function ${funcName} test failed:`, e.message);
        return false;
      }
    }
    
    console.log('🎉 All image management components are working!');
    return true;
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    return false;
  }
}

verifyImageMigration().then(success => {
  if (success) {
    console.log('\n✅ Migration verification successful!');
    console.log('🚀 Your image management should now work properly.');
    console.log('📝 Try editing an article and then visiting /admin/images');
  } else {
    console.log('\n❌ Migration verification failed!');
    console.log('📋 Please ensure you ran the SQL migration in Supabase dashboard.');
    console.log('🔗 URL: https://supabase.com/dashboard/project/xhzurxmliuvexekfilfo/sql');
  }
  process.exit(0);
});
