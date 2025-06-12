/**
 * Article Service - Supabase Implementation
 * Business logic layer for article operations
 */

import { articleRepository } from '@/repositories/article.repository';
import { adminApiService } from '@/services/admin-api.service';
import { imageManagementService } from '@/services/image-management.service';
import type { 
  PublishedArticle, 
  ArticleInsert, 
  ArticleUpdate 
} from '@/types/database';

export class ArticleService {
  /**
   * Get articles with pagination
   */
  async getArticles(options: { page?: number; limit?: number } = {}) {
    const { page = 1, limit = 12 } = options;
    return await articleRepository.getPublishedArticles(page, limit);
  }

  /**
   * Get all articles including drafts (admin only) - Uses API route
   */
  async getAllArticles(options: { page?: number; limit?: number } = {}) {
    return await adminApiService.getArticles();
  }

  /**
   * Get article by ID (admin only) - Uses API route
   */
  async getArticleById(id: string) {
    const response = await fetch(`/api/admin/articles/${id}`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch article');
    }
    
    return result.data;
  }

  /**
   * Get featured articles
   */
  async getFeaturedArticles(): Promise<PublishedArticle[]> {
    return await articleRepository.getFeaturedArticles();
  }

  /**
   * Get article by slug
   */
  async getArticleBySlug(slug: string): Promise<PublishedArticle | null> {
    return await articleRepository.getArticleBySlug(slug);
  }

  /**
   * Get articles by category
   */
  async getArticlesByCategory(categorySlug: string, limit?: number): Promise<PublishedArticle[]> {
    return await articleRepository.getArticlesByCategory(categorySlug, limit);
  }

  /**
   * Get recent articles
   */
  async getRecentArticles(limit = 10): Promise<PublishedArticle[]> {
    return await articleRepository.getRecentArticles(limit);
  }

  /**
   * Get popular articles
   */
  async getPopularArticles(period: 'day' | 'week' | 'month' = 'week', limit = 10): Promise<PublishedArticle[]> {
    return await articleRepository.getPopularArticles(period, limit);
  }

  /**
   * Search articles
   */
  async searchArticles(params: {
    query?: string;
    category?: string;
    tags?: string[];
    limit?: number;
    page?: number;
  }) {
    return await articleRepository.searchArticles(params);
  }

  /**
   * Get related articles
   */
  async getRelatedArticles(articleId: string): Promise<PublishedArticle[]> {
    return await articleRepository.getRelatedArticles(articleId);
  }

  /**
   * Like article
   */
  async likeArticle(articleId: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
    return await articleRepository.toggleLike(articleId, userId);
  }

  /**
   * Track article view
   */
  async trackView(articleId: string, userId?: string): Promise<void> {
    return await articleRepository.incrementViews(articleId, userId);
  }

  /**
   * Create article (admin/author) - Uses API route to handle server-side operations
   */
  async createArticle(articleData: ArticleInsert) {
    // Use admin API service instead of repository for client-side admin operations
    const result = await adminApiService.createArticle(articleData);
    
    // Track image usage after article creation
    if (result.data?.id && articleData.content) {
      try {
        await imageManagementService.updateArticleImageUsage(
          result.data.id, 
          articleData.content
        );
        console.log('✅ Image usage tracking updated for new article');
        
        // Track featured image separately if present
        if (articleData.featured_image_url) {
          await imageManagementService.trackFeaturedImage(
            result.data.id,
            articleData.featured_image_url
          );
          console.log('✅ Featured image tracked for new article');
        }
      } catch (error) {
        console.warn('Failed to update image tracking for new article:', error);
        // Don't fail the article creation, just log the warning
      }
    }
    
    return result;
  }

  /**
   * Update article (admin/author)
   */
  async updateArticle(id: string, updates: ArticleUpdate) {
    // Get current article data to compare featured image changes
    let currentFeaturedImage: string | null = null;
    try {
      const currentArticle = await this.getArticleById(id);
      currentFeaturedImage = currentArticle?.featured_image_url || null;
    } catch (error) {
      console.warn('Could not fetch current article for featured image comparison:', error);
    }

    // Use admin API service for client-side admin operations
    const result = await adminApiService.updateArticle(id, updates);
    
    // Track image usage after article update
    if (updates.content !== undefined) {
      try {
        await imageManagementService.updateArticleImageUsage(
          id, 
          updates.content
        );
        console.log('✅ Image usage tracking updated for article:', id);
      } catch (error) {
        console.warn('Failed to update image tracking for updated article:', error);
        // Don't fail the article update, just log the warning
      }
    }

    // Handle featured image changes (including deletion)
    if (updates.featured_image_url !== undefined) {
      try {
        const newFeaturedImage = updates.featured_image_url;
        
        // Check if featured image was changed or removed
        if (currentFeaturedImage && currentFeaturedImage !== newFeaturedImage) {
          console.log(`🔄 Featured image changed from ${currentFeaturedImage} to ${newFeaturedImage || 'none'}`);
        }

        if (newFeaturedImage) {
          // Track new featured image
          await imageManagementService.trackFeaturedImage(id, newFeaturedImage);
          console.log('✅ Featured image tracked for updated article');
        } else {
          // Clear featured image (will auto-delete if not used in content)
          await imageManagementService.clearFeaturedImage(id);
          console.log('✅ Featured image cleared for updated article');
        }
      } catch (error) {
        console.warn('Failed to update featured image tracking:', error);
        // Don't fail the article update, just log the warning
      }
    }
    
    return result;
  }

  /**
   * Delete article (admin)
   */
  async deleteArticle(id: string): Promise<void> {
    return await adminApiService.deleteArticle(id);
  }

  /**
   * Get article statistics
   */
  async getArticleStats(articleId: string) {
    return await articleRepository.getArticleStats(articleId);
  }
}

// Export singleton instance
export const articleService = new ArticleService();