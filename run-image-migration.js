#!/usr/bin/env node

/**
 * Run Article Images Migration
 * This script applies the article_images table migration to your Supabase database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration in .env.local');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('🚀 Starting article images migration...');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, 'article-images-migration.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📖 Loaded migration SQL');
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });
    
    if (error) {
      // If exec_sql doesn't exist, try direct execution
      console.log('💡 Trying direct SQL execution...');
      
      const { error: directError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'article_images')
        .single();
      
      if (directError && directError.code !== 'PGRST116') {
        throw directError;
      }
      
      console.log('⚠️  Direct execution not available. Please run the migration manually.');
      console.log('📋 Copy and paste the following SQL into your Supabase SQL editor:');
      console.log('\n' + '='.repeat(80));
      console.log(migrationSQL);
      console.log('='.repeat(80) + '\n');
      
      process.exit(0);
    }
    
    console.log('✅ Migration completed successfully!');
    
    // Verify the table was created
    const { data: tableCheck, error: tableError } = await supabase
      .from('article_images')
      .select('id')
      .limit(1);
    
    if (tableError && tableError.code === '42P01') {
      console.log('⚠️  Table verification failed. Please run the migration manually.');
    } else {
      console.log('✅ Table verification passed!');
    }
    
    console.log('\n🎉 Article Images migration is ready!');
    console.log('📝 Next steps:');
    console.log('1. Fill in your ImageKit credentials in .env.local');
    console.log('2. Restart your development server');
    console.log('3. Create/edit articles with image upload functionality');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\n📋 Please run the migration manually by copying the SQL from:');
    console.log('article-images-migration.sql');
    process.exit(1);
  }
}

runMigration();
