/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Article Service - Supabase Implementation
 * Business logic layer for article operations
 */

import { articleRepository } from '@/repositories/article.repository';
import { adminApiService } from '@/services/admin-api.service';
import { imageManagementService } from '@/services/image-management.service';
import type { 
  Article,
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
  async getAllArticles(options: { page?: number; limit?: number } = {}): Promise<Article[]> {
    return await adminApiService.getArticles();
  }

  /**
   * Get article by ID (admin only) - Uses API route
   */
  async getArticleById(id: string): Promise<Article> {
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
  async createArticle(articleData: ArticleInsert): Promise<Article> {
    // Use admin API service instead of repository for client-side admin operations
    const result = await adminApiService.createArticle(articleData);
    
    // Enhanced image tracking after article creation
    if (result?.id) {
      try {
        // Use the enhanced method that handles both orphaned images and usage tracking
        const trackingResult = await imageManagementService.updateArticleImageUsageEnhanced(
          result.id, 
          articleData.content || '',
          articleData.featured_image_url || ''
        );
        console.log('✅ Enhanced image tracking completed for new article:', trackingResult);
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
  async updateArticle(id: string, updates: ArticleUpdate): Promise<Article> {
    // Use admin API service for client-side admin operations
    const result = await adminApiService.updateArticle(id, updates);
    
    // Enhanced image tracking after article update
    if (updates.content !== undefined || updates.featured_image_url !== undefined) {
      try {
        // Get current content if not provided in updates
        let finalContent = updates.content;
        if (finalContent === undefined) {
          const currentArticle = await this.getArticleById(id);
          finalContent = currentArticle?.content || '';
        }

        // Use the enhanced method for comprehensive tracking
        const trackingResult = await imageManagementService.updateArticleImageUsageEnhanced(
          id, 
          finalContent || '',
          updates.featured_image_url || ''
        );
        console.log('✅ Enhanced image tracking completed for updated article:', trackingResult);
      } catch (error) {
        console.warn('Failed to update image tracking for updated article:', error);
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
  async getArticleStats(articleId: string): Promise<any> {
    return await articleRepository.getArticleStats(articleId);
  }
}

// Export singleton instance
export const articleService = new ArticleService();