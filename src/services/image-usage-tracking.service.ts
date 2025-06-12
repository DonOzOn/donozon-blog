/**
 * Image Usage Tracking Service
 * Tracks which images are actually used in article content
 */

import { supabase } from '@/lib/supabase';
import { extractImageKitUrls, isImageKitUrl } from '@/lib/imagekit';

export interface ImageUsageSummary {
  totalImages: number;
  usedImages: number;
  unusedImages: number;
  scheduledForDeletion: number;
  storageSize: number;
}

export interface OrphanedImage {
  id: string;
  imagekit_url: string;
  imagekit_file_id: string;
  file_name: string;
  file_size: number;
  created_at: string;
  last_used_at: string | null;
  scheduled_for_deletion_at: string | null;
  usage_count: number;
}

/**
 * Scan all articles and update image usage tracking
 */
export async function scanAllArticlesForImageUsage(): Promise<{
  scannedArticles: number;
  updatedImages: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let scannedArticles = 0;
  let updatedImages = 0;

  try {
    console.log('🔍 Starting comprehensive image usage scan...');

    // Get all published articles
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, content, featured_image_url')
      .eq('published', true);

    if (articlesError) {
      throw new Error(`Failed to fetch articles: ${articlesError.message}`);
    }

    if (!articles || articles.length === 0) {
      console.log('📝 No articles found to scan');
      return { scannedArticles: 0, updatedImages: 0, errors: [] };
    }

    // Collect all ImageKit URLs from all articles
    const allUsedUrls = new Set<string>();
    const urlToArticleMap = new Map<string, string[]>();

    for (const article of articles) {
      scannedArticles++;
      
      // Extract URLs from content
      const contentUrls = extractImageKitUrls(article.content || '');
      
      // Add featured image if it's an ImageKit URL
      if (article.featured_image_url && isImageKitUrl(article.featured_image_url)) {
        contentUrls.push(article.featured_image_url);
      }

      // Track which articles use which images
      contentUrls.forEach(url => {
        allUsedUrls.add(url);
        if (!urlToArticleMap.has(url)) {
          urlToArticleMap.set(url, []);
        }
        urlToArticleMap.get(url)!.push(article.id);
      });
    }

    console.log(`📊 Found ${allUsedUrls.size} unique ImageKit URLs in ${scannedArticles} articles`);

    // Get all images from database
    const { data: allImages, error: imagesError } = await supabase
      .from('article_images')
      .select('*')
      .not('deleted_at', 'is', null); // Only non-deleted images

    if (imagesError) {
      throw new Error(`Failed to fetch images: ${imagesError.message}`);
    }

    if (!allImages || allImages.length === 0) {
      console.log('🖼️ No images found in database');
      return { scannedArticles, updatedImages: 0, errors: [] };
    }

    // Update usage for each image
    for (const image of allImages) {
      const isUsed = allUsedUrls.has(image.imagekit_url);
      const usageCount = urlToArticleMap.get(image.imagekit_url)?.length || 0;
      const lastUsedAt = isUsed ? new Date().toISOString() : image.last_used_at;
      
      // Calculate scheduled deletion date (7 days from when it becomes unused)
      let scheduledForDeletion = image.scheduled_for_deletion_at;
      if (!isUsed && !scheduledForDeletion) {
        const deletionDate = new Date();
        deletionDate.setDate(deletionDate.getDate() + 7); // 7 days grace period
        scheduledForDeletion = deletionDate.toISOString();
      } else if (isUsed && scheduledForDeletion) {
        // Image is used again, cancel scheduled deletion
        scheduledForDeletion = null;
      }

      const { error: updateError } = await supabase
        .from('article_images')
        .update({
          is_used: isUsed,
          usage_count: usageCount,
          last_used_at: lastUsedAt,
          scheduled_for_deletion_at: scheduledForDeletion,
          updated_at: new Date().toISOString(),
        })
        .eq('id', image.id);

      if (updateError) {
        errors.push(`Failed to update image ${image.file_name}: ${updateError.message}`);
      } else {
        updatedImages++;
      }
    }

    console.log(`✅ Image usage scan completed: ${scannedArticles} articles, ${updatedImages} images updated`);
    
    return { scannedArticles, updatedImages, errors };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Image usage scan failed:', errorMessage);
    errors.push(errorMessage);
    return { scannedArticles, updatedImages, errors };
  }
}

/**
 * Update image usage for a specific article
 */
export async function updateImageUsageForArticle(articleId: string, content: string, featuredImageUrl?: string): Promise<void> {
  try {
    console.log(`🔍 Updating image usage for article: ${articleId}`);

    // Extract ImageKit URLs from content
    const contentUrls = extractImageKitUrls(content || '');
    
    // Add featured image if it's an ImageKit URL
    if (featuredImageUrl && isImageKitUrl(featuredImageUrl)) {
      contentUrls.push(featuredImageUrl);
    }

    if (contentUrls.length === 0) {
      console.log(`📝 No ImageKit images found in article ${articleId}`);
      return;
    }

    // Update each image's usage
    for (const url of contentUrls) {
      const { error } = await supabase
        .from('article_images')
        .update({
          is_used: true,
          last_used_at: new Date().toISOString(),
          scheduled_for_deletion_at: null, // Cancel any scheduled deletion
          updated_at: new Date().toISOString(),
        })
        .eq('imagekit_url', url);

      if (error) {
        console.error(`Failed to update usage for image ${url}:`, error);
      }
    }

    // Update usage count by running a scan (more accurate)
    await scanAllArticlesForImageUsage();

  } catch (error) {
    console.error('Error updating image usage for article:', error);
  }
}

/**
 * Get images scheduled for deletion
 */
export async function getOrphanedImages(includeScheduled: boolean = true): Promise<OrphanedImage[]> {
  try {
    let query = supabase
      .from('article_images')
      .select('*')
      .eq('is_used', false)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (includeScheduled) {
      query = query.not('scheduled_for_deletion_at', 'is', null);
    } else {
      query = query.is('scheduled_for_deletion_at', null);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch orphaned images: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching orphaned images:', error);
    return [];
  }
}

/**
 * Get image usage summary statistics
 */
export async function getImageUsageSummary(): Promise<ImageUsageSummary> {
  try {
    const { data: images, error } = await supabase
      .from('article_images')
      .select('is_used, file_size, scheduled_for_deletion_at, deleted_at');

    if (error) {
      throw new Error(`Failed to fetch image summary: ${error.message}`);
    }

    if (!images) {
      return {
        totalImages: 0,
        usedImages: 0,
        unusedImages: 0,
        scheduledForDeletion: 0,
        storageSize: 0,
      };
    }

    const activeImages = images.filter(img => !img.deleted_at);
    
    return {
      totalImages: activeImages.length,
      usedImages: activeImages.filter(img => img.is_used).length,
      unusedImages: activeImages.filter(img => !img.is_used).length,
      scheduledForDeletion: activeImages.filter(img => img.scheduled_for_deletion_at).length,
      storageSize: activeImages.reduce((total, img) => total + (img.file_size || 0), 0),
    };
  } catch (error) {
    console.error('Error getting image usage summary:', error);
    return {
      totalImages: 0,
      usedImages: 0,
      unusedImages: 0,
      scheduledForDeletion: 0,
      storageSize: 0,
    };
  }
}

/**
 * Clean up orphaned images (those scheduled for deletion)
 */
export async function cleanupOrphanedImages(): Promise<{
  deletedCount: number;
  errors: string[];
  freedSpace: number;
}> {
  const errors: string[] = [];
  let deletedCount = 0;
  let freedSpace = 0;

  try {
    console.log('🧹 Starting orphaned image cleanup...');

    // Find images scheduled for deletion where the deletion date has passed
    const now = new Date().toISOString();
    const { data: imagesToDelete, error: fetchError } = await supabase
      .from('article_images')
      .select('*')
      .eq('is_used', false)
      .not('scheduled_for_deletion_at', 'is', null)
      .lt('scheduled_for_deletion_at', now)
      .is('deleted_at', null);

    if (fetchError) {
      throw new Error(`Failed to fetch images for deletion: ${fetchError.message}`);
    }

    if (!imagesToDelete || imagesToDelete.length === 0) {
      console.log('🧹 No images scheduled for deletion');
      return { deletedCount: 0, errors: [], freedSpace: 0 };
    }

    console.log(`🗑️ Found ${imagesToDelete.length} images to delete`);

    // Delete each image
    for (const image of imagesToDelete) {
      try {
        // Delete from ImageKit
        const response = await fetch('/api/imagekit/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            fileId: image.imagekit_file_id, 
            imageUrl: image.imagekit_url 
          }),
        });

        if (response.ok) {
          deletedCount++;
          freedSpace += image.file_size || 0;
          console.log(`✅ Deleted image: ${image.file_name}`);
        } else {
          const errorData = await response.json();
          errors.push(`Failed to delete ${image.file_name}: ${errorData.error}`);
        }
      } catch (deleteError) {
        const errorMessage = deleteError instanceof Error ? deleteError.message : 'Unknown error';
        errors.push(`Failed to delete ${image.file_name}: ${errorMessage}`);
      }
    }

    console.log(`🧹 Cleanup completed: ${deletedCount} images deleted, ${(freedSpace / 1024 / 1024).toFixed(2)} MB freed`);
    
    return { deletedCount, errors, freedSpace };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Cleanup failed:', errorMessage);
    errors.push(errorMessage);
    return { deletedCount, errors, freedSpace };
  }
}