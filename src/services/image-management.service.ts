/**
 * Image Management Service
 * Handles tracking, cleanup, and management of article images
 */

import { supabase } from '@/lib/supabase';
import { deleteImageFromImageKit } from '@/lib/imagekit';

export interface ArticleImage {
  id: string;
  article_id: string;
  imagekit_file_id: string;
  imagekit_url: string;
  file_name: string;
  file_size?: number;
  mime_type?: string;
  folder_path?: string;
  is_used: boolean;
  is_featured_image: boolean;
  created_at: string;
  marked_for_deletion_at?: string;
  deleted_at?: string;
}

export interface ImageStats {
  total_images: number;
  used_images: number;
  unused_images: number;
  pending_deletion: number;
  total_size: number;
}

export class ImageManagementService {
  /**
   * Update image usage tracking when article content changes
   * Now automatically deletes unused images from ImageKit
   */
  async updateArticleImageUsage(articleId: string, content: string): Promise<number> {
    try {
      // Get current images before updating
      const currentImages = await this.getArticleImages(articleId);
      const currentImageUrls = currentImages.map(img => img.imagekit_url);
      
      // Extract new images from content
      const newImageUrls = this.extractImageKitUrls(content);
      
      // Find images that are being removed (existed before but not in new content)
      const removedImages = currentImages.filter(img => 
        img.is_used && !newImageUrls.includes(img.imagekit_url)
      );

      console.log(`📷 Image tracking for article ${articleId}:`);
      console.log(`  - Current images: ${currentImageUrls.length}`);
      console.log(`  - New content images: ${newImageUrls.length}`);
      console.log(`  - Images being removed: ${removedImages.length}`);

      // Call the database function to update image usage
      const { data, error } = await supabase
        .rpc('update_article_image_usage', {
          p_article_id: articleId,
          p_content: content,
        });

      if (error) {
        // Check if function doesn't exist (migration not run)
        if (error.message?.includes('function') || error.message?.includes('does not exist')) {
          console.warn('Image management functions not installed. Please run the database migration.');
          // Fall back to manual tracking
          return await this.manualUpdateImageUsage(articleId, content, removedImages);
        }
        console.error('Error updating image usage:', error);
        throw error;
      }

      // Auto-delete removed images from ImageKit
      if (removedImages.length > 0) {
        await this.autoDeleteRemovedImages(removedImages);
      }

      return data || 0;
    } catch (error) {
      // Check if it's a missing function error
      if (error.message?.includes('function') || error.message?.includes('does not exist')) {
        console.warn('Image management functions not installed. Please run the database migration.');
        return 0; // Return gracefully instead of throwing
      }
      console.error('Failed to update article image usage:', error);
      throw error;
    }
  }

  /**
   * Get image statistics for an article
   */
  async getArticleImageStats(articleId: string): Promise<ImageStats> {
    try {
      const { data, error } = await supabase
        .rpc('get_article_image_stats', { p_article_id: articleId });

      if (error) {
        console.error('Error getting image stats:', error);
        throw error;
      }

      return data?.[0] || {
        total_images: 0,
        used_images: 0,
        unused_images: 0,
        pending_deletion: 0,
        total_size: 0,
      };
    } catch (error) {
      console.error('Failed to get article image stats:', error);
      throw error;
    }
  }

  /**
   * Get all images for an article
   */
  async getArticleImages(articleId: string): Promise<ArticleImage[]> {
    try {
      const { data, error } = await supabase
        .from('article_images')
        .select('*')
        .eq('article_id', articleId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting article images:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to get article images:', error);
      throw error;
    }
  }

  /**
   * Get all images across all articles
   */
  async getAllImages(): Promise<ArticleImage[]> {
    try {
      const { data, error } = await supabase
        .from('article_images')
        .select(`
          *,
          articles(title, slug)
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        // Check if table doesn't exist (migration not run)
        if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.warn('article_images table not found. Please run the database migration.');
          return []; // Return empty array instead of throwing
        }
        console.error('Error getting all images:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      // Check if it's a missing table error
      if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.warn('article_images table not found. Please run the database migration.');
        return []; // Return empty array instead of throwing
      }
      console.error('Failed to get all images:', error);
      throw error;
    }
  }

  /**
   * Get all unused images across all articles
   */
  async getUnusedImages(): Promise<ArticleImage[]> {
    try {
      const { data, error } = await supabase
        .from('article_images')
        .select(`
          *,
          articles(title, slug)
        `)
        .eq('is_used', false)
        .is('deleted_at', null)
        .order('marked_for_deletion_at', { ascending: true, nullsFirst: false });

      if (error) {
        // Check if table doesn't exist (migration not run)
        if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.warn('article_images table not found. Please run the database migration.');
          return []; // Return empty array instead of throwing
        }
        console.error('Error getting unused images:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      // Check if it's a missing table error
      if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.warn('article_images table not found. Please run the database migration.');
        return []; // Return empty array instead of throwing
      }
      console.error('Failed to get unused images:', error);
      throw error;
    }
  }

  /**
   * Get images marked for deletion
   */
  async getImagesMarkedForDeletion(): Promise<ArticleImage[]> {
    try {
      const { data, error } = await supabase
        .from('article_images')
        .select(`
          *,
          articles(title, slug)
        `)
        .not('marked_for_deletion_at', 'is', null)
        .is('deleted_at', null)
        .order('marked_for_deletion_at', { ascending: true });

      if (error) {
        // Check if table doesn't exist (migration not run)
        if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.warn('article_images table not found. Please run the database migration.');
          return []; // Return empty array instead of throwing
        }
        console.error('Error getting images marked for deletion:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      // Check if it's a missing table error
      if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.warn('article_images table not found. Please run the database migration.');
        return []; // Return empty array instead of throwing
      }
      console.error('Failed to get images marked for deletion:', error);
      throw error;
    }
  }

  /**
   * Restore images marked for deletion for an article
   */
  async restoreArticleImages(articleId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .rpc('restore_article_images', { p_article_id: articleId });

      if (error) {
        console.error('Error restoring article images:', error);
        throw error;
      }

      return data || 0;
    } catch (error) {
      console.error('Failed to restore article images:', error);
      throw error;
    }
  }

  /**
   * Force delete specific images (admin action)
   */
  async forceDeleteImages(imageIds: string[]): Promise<{
    deleted: number;
    failed: string[];
  }> {
    let deleted = 0;
    const failed: string[] = [];

    try {
      // Get image data before deletion
      const { data: images, error: fetchError } = await supabase
        .from('article_images')
        .select('*')
        .in('id', imageIds)
        .is('deleted_at', null);

      if (fetchError) {
        console.error('Error fetching images for deletion:', fetchError);
        throw fetchError;
      }

      // Delete each image from ImageKit and database
      for (const image of images || []) {
        try {
          // Delete from ImageKit
          await deleteImageFromImageKit(image.imagekit_file_id);

          // Mark as deleted in database
          const { error: dbError } = await supabase
            .from('article_images')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', image.id);

          if (dbError) {
            console.error(`Failed to mark image ${image.id} as deleted:`, dbError);
            failed.push(image.id);
          } else {
            deleted++;
          }
        } catch (error) {
          console.error(`Failed to delete image ${image.id}:`, error);
          failed.push(image.id);
        }
      }

      return { deleted, failed };
    } catch (error) {
      console.error('Failed to force delete images:', error);
      throw error;
    }
  }

  /**
   * Run cleanup job for expired images
   */
  async runCleanupJob(): Promise<{
    deleted_count: number;
    deleted_images: string[];
  }> {
    try {
      const { data, error } = await supabase
        .rpc('cleanup_unused_images');

      if (error) {
        console.error('Error running cleanup job:', error);
        throw error;
      }

      const result = data?.[0] || { deleted_count: 0, deleted_images: [] };

      // Delete from ImageKit for each deleted image
      if (result.deleted_images?.length > 0) {
        for (const imageUrl of result.deleted_images) {
          try {
            // Get file ID from database before actual deletion
            const { data: imageData } = await supabase
              .from('article_images')
              .select('imagekit_file_id')
              .eq('imagekit_url', imageUrl)
              .single();

            if (imageData?.imagekit_file_id) {
              await deleteImageFromImageKit(imageData.imagekit_file_id);
            }
          } catch (error) {
            console.error(`Failed to delete image from ImageKit: ${imageUrl}`, error);
          }
        }
      }

      return result;
    } catch (error) {
      console.error('Failed to run cleanup job:', error);
      throw error;
    }
  }

  /**
   * Get global image statistics
   */
  async getGlobalImageStats(): Promise<{
    total_images: number;
    used_images: number;
    unused_images: number;
    pending_deletion: number;
    total_size: number;
    total_articles_with_images: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('article_images')
        .select('*')
        .is('deleted_at', null);

      if (error) {
        // Check if table doesn't exist (migration not run)
        if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.warn('article_images table not found. Please run the database migration.');
          return {
            total_images: 0,
            used_images: 0,
            unused_images: 0,
            pending_deletion: 0,
            total_size: 0,
            total_articles_with_images: 0,
          };
        }
        console.error('Error getting global image stats:', error);
        throw error;
      }

      const images = data || [];
      const uniqueArticles = new Set(images.map(img => img.article_id));

      return {
        total_images: images.length,
        used_images: images.filter(img => img.is_used).length,
        unused_images: images.filter(img => !img.is_used).length,
        pending_deletion: images.filter(img => img.marked_for_deletion_at).length,
        total_size: images.reduce((sum, img) => sum + (img.file_size || 0), 0),
        total_articles_with_images: uniqueArticles.size,
      };
    } catch (error) {
      // Check if it's a missing table error
      if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.warn('article_images table not found. Please run the database migration.');
        return {
          total_images: 0,
          used_images: 0,
          unused_images: 0,
          pending_deletion: 0,
          total_size: 0,
          total_articles_with_images: 0,
        };
      }
      console.error('Failed to get global image stats:', error);
      throw error;
    }
  }

  /**
   * Track featured image usage and auto-delete previous featured image if changed
   */
  async trackFeaturedImage(articleId: string, imageUrl: string): Promise<void> {
    try {
      if (!imageUrl) {
        // If no image URL provided, delete current featured image
        await this.clearFeaturedImage(articleId);
        return;
      }

      // Get current featured image before changing
      const { data: currentFeaturedImages } = await supabase
        .from('article_images')
        .select('*')
        .eq('article_id', articleId)
        .eq('is_featured_image', true)
        .neq('imagekit_url', imageUrl); // Don't include the new image

      // Mark existing featured images as not featured
      await supabase
        .from('article_images')
        .update({ is_featured_image: false })
        .eq('article_id', articleId)
        .eq('is_featured_image', true);

      // Mark the new featured image
      const { error } = await supabase
        .from('article_images')
        .update({ 
          is_featured_image: true,
          is_used: true,
          marked_for_deletion_at: null 
        })
        .eq('article_id', articleId)
        .eq('imagekit_url', imageUrl);

      if (error) {
        console.error('Error tracking featured image:', error);
        return;
      }

      // Auto-delete previous featured images if they're not used in content
      if (currentFeaturedImages && currentFeaturedImages.length > 0) {
        const imagesToDelete = currentFeaturedImages.filter(img => !img.is_used);
        if (imagesToDelete.length > 0) {
          console.log(`🗑️ Auto-deleting ${imagesToDelete.length} replaced featured images...`);
          await this.autoDeleteRemovedImages(imagesToDelete);
        }
      }
    } catch (error) {
      console.error('Failed to track featured image:', error);
    }
  }

  /**
   * Clear featured image and optionally delete it if not used in content
   */
  async clearFeaturedImage(articleId: string): Promise<void> {
    try {
      // Get current featured images
      const { data: featuredImages } = await supabase
        .from('article_images')
        .select('*')
        .eq('article_id', articleId)
        .eq('is_featured_image', true);

      // Mark as not featured
      await supabase
        .from('article_images')
        .update({ is_featured_image: false })
        .eq('article_id', articleId)
        .eq('is_featured_image', true);

      // Auto-delete if not used in content
      if (featuredImages && featuredImages.length > 0) {
        const imagesToDelete = featuredImages.filter(img => !img.is_used);
        if (imagesToDelete.length > 0) {
          console.log(`🗑️ Auto-deleting ${imagesToDelete.length} cleared featured images...`);
          await this.autoDeleteRemovedImages(imagesToDelete);
        }
      }
    } catch (error) {
      console.error('Failed to clear featured image:', error);
    }
  }

  /**
   * Adopt orphaned images and associate them with an article
   * This handles images uploaded before article creation
   */
  async adoptOrphanedImages(articleId: string, content: string, featuredImageUrl?: string): Promise<number> {
    try {
      // Extract all ImageKit URLs from content and featured image
      const contentUrls = this.extractImageKitUrls(content);
      const allUrls = featuredImageUrl ? [...contentUrls, featuredImageUrl] : contentUrls;
      
      if (allUrls.length === 0) {
        return 0;
      }

      console.log(`🔗 Adopting orphaned images for article ${articleId}:`, allUrls);

      // Update orphaned images (those with null article_id) to belong to this article
      const { data, error } = await supabase
        .from('article_images')
        .update({ 
          article_id: articleId,
          is_used: true,
          marked_for_deletion_at: null,
          is_featured_image: false // Will be set separately for featured image
        })
        .in('imagekit_url', allUrls)
        .is('article_id', null)
        .select('id, imagekit_url');

      if (error) {
        console.error('Error adopting orphaned images:', error);
        throw error;
      }

      const adoptedCount = data?.length || 0;
      console.log(`✅ Successfully adopted ${adoptedCount} orphaned images for article ${articleId}`);

      // If there's a featured image, mark it specifically
      if (featuredImageUrl) {
        await this.trackFeaturedImage(articleId, featuredImageUrl);
      }

      return adoptedCount;
    } catch (error) {
      console.error('Failed to adopt orphaned images:', error);
      throw error;
    }
  }

  /**
   * Manual image usage tracking when database function is not available
   */
  private async manualUpdateImageUsage(articleId: string, content: string, removedImages: ArticleImage[]): Promise<number> {
    try {
      const newImageUrls = this.extractImageKitUrls(content);
      
      // Mark all images as unused first
      await supabase
        .from('article_images')
        .update({ is_used: false })
        .eq('article_id', articleId);

      // Mark current images as used
      if (newImageUrls.length > 0) {
        await supabase
          .from('article_images')
          .update({ 
            is_used: true,
            marked_for_deletion_at: null 
          })
          .eq('article_id', articleId)
          .in('imagekit_url', newImageUrls);
      }

      // Auto-delete removed images
      if (removedImages.length > 0) {
        await this.autoDeleteRemovedImages(removedImages);
      }

      return newImageUrls.length;
    } catch (error) {
      console.error('Manual image usage update failed:', error);
      throw error;
    }
  }

  /**
   * Automatically delete removed images from ImageKit and mark as deleted
   */
  private async autoDeleteRemovedImages(removedImages: ArticleImage[]): Promise<void> {
    console.log(`🗑️ Auto-deleting ${removedImages.length} removed images from ImageKit...`);
    
    for (const image of removedImages) {
      try {
        // Delete from ImageKit
        console.log(`  - Deleting ${image.file_name} (${image.imagekit_file_id}) from ImageKit`);
        await deleteImageFromImageKit(image.imagekit_file_id);

        // Mark as deleted in database
        await supabase
          .from('article_images')
          .update({ 
            deleted_at: new Date().toISOString(),
            is_used: false 
          })
          .eq('id', image.id);

        console.log(`  ✅ Successfully deleted ${image.file_name} from ImageKit`);
        
      } catch (error) {
        console.error(`  ❌ Failed to delete ${image.file_name} from ImageKit:`, error);
        
        // Still mark as unused in database even if ImageKit deletion failed
        await supabase
          .from('article_images')
          .update({ 
            is_used: false,
            marked_for_deletion_at: new Date().toISOString()
          })
          .eq('id', image.id);
      }
    }
    
    console.log('✅ Auto-deletion of removed images completed');
  }

  /**
   * Extract ImageKit URLs from content
   */
  private extractImageKitUrls(content: string): string[] {
    if (!content) return [];
    
    const regex = /https:\/\/ik\.imagekit\.io\/[^"'\s)]+/g;
    return content.match(regex) || [];
  }

  /**
   * Enhanced update function that handles both orphaned images and usage tracking
   */
  async updateArticleImageUsageEnhanced(articleId: string, content: string, featuredImageUrl?: string): Promise<number> {
    try {
      // First, adopt any orphaned images
      const adoptedCount = await this.adoptOrphanedImages(articleId, content, featuredImageUrl);

      // Then run the standard usage tracking
      const usageResult = await this.updateArticleImageUsage(articleId, content);

      console.log(`📊 Image tracking complete for article ${articleId}: ${adoptedCount} adopted, ${usageResult} usage updates`);
      
      return adoptedCount + usageResult;
    } catch (error) {
      // If the database function doesn't exist, just adopt orphaned images
      if (error.message?.includes('function') || error.message?.includes('does not exist')) {
        console.warn('Image management functions not installed. Using fallback method.');
        return await this.adoptOrphanedImages(articleId, content, featuredImageUrl);
      }
      
      console.error('Failed to update article image usage:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const imageManagementService = new ImageManagementService();