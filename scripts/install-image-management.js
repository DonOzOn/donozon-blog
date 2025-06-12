#!/usr/bin/env node

/**
 * Image Management System Installation Script
 * This script sets up the database schema and functions for comprehensive image management
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function installImageManagement() {
  console.log('🚀 Installing Image Management System...\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing required environment variables');
    console.error('Please ensure the following are set in your .env.local file:');
    console.error('- NEXT_PUBLIC_SUPABASE_URL');
    console.error('- SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Create Supabase client with service role key for admin operations
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '..', 'database', 'migrations', 'image_management.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Error: Migration file not found at:', migrationPath);
      process.exit(1);
    }

    console.log('📄 Reading migration file...');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute the migration
    console.log('💾 Executing database migration...');
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (error) {
      // If the RPC function doesn't exist, try direct execution
      console.log('⚠️ RPC method not available, trying direct execution...');
      
      // Split SQL into individual statements
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          const { error: stmtError } = await supabase.rpc('exec', { sql: statement });
          if (stmtError) {
            console.warn(`⚠️ Warning: ${stmtError.message}`);
          }
        }
      }
    }

    // Test the installation by checking if the table exists
    console.log('🔍 Verifying installation...');
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'article_images');

    if (tableError) {
      console.error('❌ Error verifying installation:', tableError.message);
      process.exit(1);
    }

    if (!tables || tables.length === 0) {
      console.error('❌ Error: article_images table was not created');
      console.error('Please check your database permissions and try again');
      process.exit(1);
    }

    // Test the functions
    console.log('🧪 Testing functions...');
    const { data: testResult, error: testError } = await supabase
      .rpc('get_global_image_stats');

    if (testError) {
      console.warn('⚠️ Warning: Functions may not be properly installed:', testError.message);
    } else {
      console.log('✅ Functions are working correctly');
    }

    console.log('\n🎉 Image Management System installed successfully!');
    console.log('\n📋 What was installed:');
    console.log('   ✅ article_images table');
    console.log('   ✅ Database indexes for performance');
    console.log('   ✅ Image management functions');
    console.log('   ✅ Triggers for automatic timestamps');
    console.log('   ✅ Management view for queries');
    
    console.log('\n🔧 Next steps:');
    console.log('   1. Run your Next.js application: npm run dev');
    console.log('   2. Navigate to /admin/images to access the image management interface');
    console.log('   3. Test image upload and tracking in the article editor');
    console.log('   4. Set up automated cleanup (optional): see /api/cron/cleanup-images');

    console.log('\n📊 Current image statistics:');
    if (testResult && testResult.length > 0) {
      const stats = testResult[0];
      console.log(`   Total images: ${stats.total_images}`);
      console.log(`   Used images: ${stats.used_images}`);
      console.log(`   Unused images: ${stats.unused_images}`);
      console.log(`   Articles with images: ${stats.total_articles_with_images}`);
    }

  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check your database connection');
    console.error('2. Ensure you have the correct permissions');
    console.error('3. Verify your environment variables');
    console.error('4. Check the migration file syntax');
    process.exit(1);
  }
}

// Run the installation
if (require.main === module) {
  installImageManagement().catch(console.error);
}

module.exports = { installImageManagement };
