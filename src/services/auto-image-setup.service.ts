import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export class AutoImageSetup {
  private static isSetupChecked = false;
  private static isSetupComplete = false;
  
  /**
   * Check if image management is set up and attempt auto-setup if needed
   */
  static async ensureImageManagementSetup(): Promise<boolean> {
    // Only check setup once per session to avoid repeated attempts
    if (this.isSetupChecked) {
      return this.isSetupComplete;
    }
    
    this.isSetupChecked = true;
    
    try {
      // Test if article_images table exists
      const { data, error } = await supabase
        .from('article_images')
        .select('id')
        .limit(1);
        
      if (!error) {
        console.log('✅ Image management already set up');
        this.isSetupComplete = true;
        return true;
      }
      
      // If table doesn't exist, try to create it
      if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.log('🔧 Setting up image management automatically...');
        const setupSuccess = await this.autoSetupImageManagement();
        
        if (setupSuccess) {
          this.isSetupComplete = true;
          console.log('✅ Image management auto-setup completed');
          return true;
        }
      }
      
      console.warn('⚠️ Image management not available:', error.message);
      return false;
      
    } catch (error) {
      console.warn('⚠️ Could not check image management setup:', error.message);
      return false;
    }
  }
  
  /**
   * Attempt to automatically set up image management
   */
  private static async autoSetupImageManagement(): Promise<boolean> {
    try {
      // Create the table using a simpler approach
      const createTableSQL = `
        -- Create article_images table
        CREATE TABLE IF NOT EXISTS article_images (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
          imagekit_file_id VARCHAR NOT NULL,
          imagekit_url VARCHAR NOT NULL UNIQUE,
          file_name VARCHAR NOT NULL,
          file_size INTEGER,
          mime_type VARCHAR,
          folder_path VARCHAR DEFAULT '/blog-articles/',
          is_used BOOLEAN DEFAULT true,
          is_featured_image BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          marked_for_deletion_at TIMESTAMP WITH TIME ZONE NULL,
          deleted_at TIMESTAMP WITH TIME ZONE NULL
        );
        
        -- Create basic indexes
        CREATE INDEX IF NOT EXISTS idx_article_images_article_id ON article_images(article_id);
        CREATE INDEX IF NOT EXISTS idx_article_images_imagekit_url ON article_images(imagekit_url);
        CREATE INDEX IF NOT EXISTS idx_article_images_used ON article_images(is_used, article_id);
        
        -- Add RLS policies
        ALTER TABLE article_images ENABLE ROW LEVEL SECURITY;
        CREATE POLICY IF NOT EXISTS "article_images_public_read" ON article_images FOR SELECT USING (true);
      `;
      
      // Try to execute using a SQL function call if available
      const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
      
      if (error) {
        console.log('📋 Auto-setup failed - manual migration required');
        console.log('🔗 Please run migration at: https://supabase.com/dashboard/project/xhzurxmliuvexekfilfo/sql');
        return false;
      }
      
      return true;
      
    } catch (error) {
      console.log('📋 Auto-setup not available - manual migration required');
      return false;
    }
  }
  
  /**
   * Track images for an article automatically
   */
  static async trackArticleImages(articleId: string, content: string, featuredImageUrl?: string): Promise<void> {
    try {
      const isSetup = await this.ensureImageManagementSetup();
      if (!isSetup) {
        console.log('📷 Image tracking skipped - setup not available');
        return;
      }
      
      // Extract image URLs from content
      const imageUrls = new Set<string>();
      
      // Add featured image
      if (featuredImageUrl) {
        imageUrls.add(featuredImageUrl);
      }
      
      // Extract images from content using multiple patterns
      if (content) {
        const patterns = [
          /https:\/\/ik\.imagekit\.io\/[^\s"'<>)]+/g,  // ImageKit URLs
          /https:\/\/[^\/]*\.supabase\.co\/storage\/[^\s"'<>)]+/g,  // Supabase storage URLs
          /https:\/\/[^\/]*\.amazonaws\.com\/[^\s"'<>)]+\.(jpg|jpeg|png|gif|webp)/gi,  // AWS S3 URLs
          /https:\/\/[^\/]*\.(jpg|jpeg|png|gif|webp)/gi  // Other image URLs
        ];
        
        patterns.forEach(pattern => {
          const matches = content.match(pattern) || [];
          matches.forEach(url => imageUrls.add(url));
        });
      }
      
      // Track each image
      for (const imageUrl of imageUrls) {
        await this.trackSingleImage(articleId, imageUrl, imageUrl === featuredImageUrl);
      }
      
      // Mark unused images for this article
      await this.markUnusedImages(articleId, Array.from(imageUrls));
      
      console.log(`📷 Tracked ${imageUrls.size} images for article`);
      
    } catch (error) {
      console.warn('⚠️ Failed to track article images:', error.message);
    }
  }
  
  /**
   * Track a single image
   */
  private static async trackSingleImage(articleId: string, imageUrl: string, isFeatured: boolean): Promise<void> {
    try {
      // Check if image already exists
      const { data: existingImage } = await supabase
        .from('article_images')
        .select('id, is_featured_image')
        .eq('imagekit_url', imageUrl)
        .single();
        
      if (existingImage) {
        // Update existing image
        await supabase
          .from('article_images')
          .update({
            is_used: true,
            is_featured_image: isFeatured,
            marked_for_deletion_at: null
          })
          .eq('id', existingImage.id);
        return;
      }
      
      // Extract filename and file ID
      const urlParts = imageUrl.split('/');
      let fileName = urlParts[urlParts.length - 1].split('?')[0];
      let fileId = '';
      
      if (imageUrl.includes('imagekit.io')) {
        fileId = fileName;
      } else {
        // Create a hash-based ID for non-ImageKit URLs
        fileId = Buffer.from(imageUrl).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
      }
      
      // Insert new image record
      await supabase
        .from('article_images')
        .insert({
          article_id: articleId,
          imagekit_file_id: fileId,
          imagekit_url: imageUrl,
          file_name: fileName,
          is_used: true,
          is_featured_image: isFeatured,
          folder_path: '/blog-articles/',
          created_at: new Date().toISOString()
        });
        
    } catch (error) {
      console.warn(`⚠️ Failed to track image ${imageUrl}:`, error.message);
    }
  }
  
  /**
   * Mark images not in current content as unused
   */
  private static async markUnusedImages(articleId: string, currentImageUrls: string[]): Promise<void> {
    try {
      // Mark all images for this article as unused first
      await supabase
        .from('article_images')
        .update({ is_used: false })
        .eq('article_id', articleId);
        
      // Mark current images as used
      if (currentImageUrls.length > 0) {
        await supabase
          .from('article_images')
          .update({ 
            is_used: true,
            marked_for_deletion_at: null 
          })
          .eq('article_id', articleId)
          .in('imagekit_url', currentImageUrls);
      }
      
      // Mark unused images for deletion (7-day grace period)
      await supabase
        .from('article_images')
        .update({ 
          marked_for_deletion_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('article_id', articleId)
        .eq('is_used', false)
        .is('marked_for_deletion_at', null);
        
    } catch (error) {
      console.warn('⚠️ Failed to mark unused images:', error.message);
    }
  }
}
