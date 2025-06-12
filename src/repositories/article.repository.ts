/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Article Repository - Supabase Implementation
 * Handles all article-related database operations
 */

import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { 
  Article, 
  ArticleInsert, 
  ArticleUpdate, 
  PublishedArticle,
} from '@/types/database';

export class ArticleRepository {
  /**
   * Get all published articles with pagination
   */
  async getPublishedArticles(page = 1, limit = 12) {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabase
      .from('published_articles')
      .select('*', { count: 'exact' })
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    
    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: offset + limit < (count || 0),
        hasPrev: page > 1
      }
    };
  }

  /**
   * Get featured articles
   */
  async getFeaturedArticles(limit = 5): Promise<PublishedArticle[]> {
    const { data, error } = await supabase
      .from('published_articles')
      .select('*')
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Get article by slug
   */
  async getArticleBySlug(slug: string): Promise<PublishedArticle | null> {
    const { data, error } = await supabase
      .from('published_articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  }

  /**
   * Get article by ID (for admin operations)
   */
  async getArticleById(id: string): Promise<Article | null> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  }

  /**
   * Get all articles (including drafts) for admin
   */
  async getAllArticles(page = 1, limit = 12) {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabase
      .from('articles')
      .select(`
        *,
        categories!inner(name, slug, color),
        profiles(full_name, username)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    
    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: offset + limit < (count || 0),
        hasPrev: page > 1
      }
    };
  }

  /**
   * Get articles by category
   */
  async getArticlesByCategory(categorySlug: string, limit?: number): Promise<PublishedArticle[]> {
    let query = supabase
      .from('published_articles')
      .select('*')
      .eq('category_slug', categorySlug)
      .order('published_at', { ascending: false });
    
    if (limit) query = query.limit(limit);
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  /**
   * Get recent articles
   */
  async getRecentArticles(limit = 10): Promise<PublishedArticle[]> {
    const { data, error } = await supabase
      .from('published_articles')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Get popular articles (by view count)
   */
  async getPopularArticles(period: 'day' | 'week' | 'month' = 'week', limit = 10): Promise<PublishedArticle[]> {
    // For now, we'll use view_count. Later you can implement time-based filtering
    const { data, error } = await supabase
      .from('published_articles')
      .select('*')
      .order('view_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
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
    const { query: searchQuery, category, tags, limit = 12, page = 1 } = params;
    const offset = (page - 1) * limit;

    let queryBuilder = supabase
      .from('published_articles')
      .select('*', { count: 'exact' });

    // Full-text search
    if (searchQuery) {
      queryBuilder = queryBuilder.textSearch('title', searchQuery);
    }

    // Filter by category
    if (category) {
      queryBuilder = queryBuilder.eq('category_slug', category);
    }

    // Filter by tags (if any tags match)
    if (tags && tags.length > 0) {
      queryBuilder = queryBuilder.overlaps('tag_names', tags);
    }

    const { data, error, count } = await queryBuilder
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    
    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: offset + limit < (count || 0),
        hasPrev: page > 1
      }
    };
  }

  /**
   * Get related articles (by category and tags)
   */
  async getRelatedArticles(articleId: string, limit = 4): Promise<PublishedArticle[]> {
    // First get the current article to find its category and tags
    const { data: currentArticle } = await supabase
      .from('published_articles')
      .select('category_slug, tag_names')
      .eq('id', articleId)
      .single();

    if (!currentArticle) return [];

    // Get related articles by category, excluding current article
    const { data, error } = await supabase
      .from('published_articles')
      .select('*')
      .eq('category_slug', currentArticle.category_slug)
      .neq('id', articleId)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Increment article view count
   */
  async incrementViews(articleId: string, userId?: string): Promise<void> {
    // Insert into article_views for analytics
    const { error: viewError } = await supabase
      .from('article_views')
      .insert({
        article_id: articleId,
        user_id: userId || null,
        created_at: new Date().toISOString()
      });

    if (viewError) console.error('Error logging view:', viewError);

    // Increment view count on article (using RPC call)
    const { error } = await supabase.rpc('increment_view_count', { article_id: articleId });

    if (error) throw error;
  }

  /**
   * Like/Unlike article
   */
  async toggleLike(articleId: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('article_id', articleId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Remove like
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('article_id', articleId)
        .eq('user_id', userId);

      if (error) throw error;

      // Get updated count
      const { data: article } = await supabase
        .from('articles')
        .select('like_count')
        .eq('id', articleId)
        .single();

      return { liked: false, likesCount: article?.like_count || 0 };
    } else {
      // Add like
      const { error } = await supabase
        .from('likes')
        .insert({
          article_id: articleId,
          user_id: userId
        });

      if (error) throw error;

      // Get updated count
      const { data: article } = await supabase
        .from('articles')
        .select('like_count')
        .eq('id', articleId)
        .single();

      return { liked: true, likesCount: article?.like_count || 0 };
    }
  }

  /**
   * Create new article (admin/author only)
   */
  async createArticle(articleData: ArticleInsert): Promise<Article> {
    console.log('🚀 Repository: Creating article with admin client');
    console.log('📝 Repository: Article data:', articleData);
    
    // Verify we have the admin client
    if (!supabaseAdmin) {
      const errorMsg = 'Admin client not available - SUPABASE_SERVICE_ROLE_KEY is missing from environment variables';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }
    
    try {
      // Clean the data before inserting
      const cleanData = {
        title: articleData.title,
        slug: articleData.slug,
        excerpt: articleData.excerpt || null,
        content: articleData.content || null,
        category_id: articleData.category_id || null,
        featured_image_url: articleData.featured_image_url || null,
        featured_image_alt: articleData.featured_image_alt || null,
        meta_title: articleData.meta_title || null,
        meta_description: articleData.meta_description || null,
        meta_keywords: articleData.meta_keywords || null,
        is_featured: articleData.is_featured || false,
        status: articleData.status || 'draft',
        reading_time: articleData.reading_time || 1,
        published_at: articleData.published_at || null,
      };

      console.log('🧹 Repository: Cleaned data for insertion:', cleanData);
      
      // Use admin client to bypass RLS for article creation
      const { data, error } = await supabaseAdmin
        .from('articles')
        .insert(cleanData)
        .select()
        .single();

      console.log('📊 Repository: Supabase admin response:', { data, error });

      if (error) {
        console.error('❌ Repository: Supabase admin error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          fullError: error
        });
        
        // Enhanced error handling
        if (error.code === '42501') {
          const rlsError = new Error(`RLS Policy Error: ${error.message}\n\nThe service role should bypass RLS, but it's being blocked.\n\nSolutions:\n1. Disable RLS on the articles table\n2. Create proper service_role policies\n3. Check if SUPABASE_SERVICE_ROLE_KEY is correctly set`);
          rlsError.name = 'SupabaseRLSError';
          throw rlsError;
        }
        
        if (error.code === '23505') {
          throw new Error(`Duplicate entry: An article with slug "${cleanData.slug}" already exists.`);
        }
        
        if (error.code === '23502') {
          throw new Error(`Missing required field: ${error.message}`);
        }
        
        if (error.code === '23503') {
          throw new Error(`Invalid reference: ${error.message}`);
        }
        
        // Generic error
        throw new Error(`Database error: ${error.message} (Code: ${error.code})`);
      }
      
      if (!data) {
        throw new Error('No data returned from database after insert');
      }
      
      console.log('✅ Repository: Article created successfully with ID:', data.id);
      return data;
      
    } catch (insertError: any) {
      console.error('💥 Repository: Exception during article creation:', insertError);
      
      // Re-throw with better context
      if (insertError.name === 'SupabaseRLSError') {
        throw insertError;
      }
      
      throw new Error(`Failed to create article: ${insertError.message}`);
    }
  }

  /**
   * Update article (admin/author only)
   */
  async updateArticle(id: string, updates: ArticleUpdate): Promise<Article> {
    // Use admin client to bypass RLS for article updates
    if (!supabaseAdmin) {
      throw new Error('Admin client not available - SUPABASE_SERVICE_ROLE_KEY is missing from environment variables');
    }

    const { data, error } = await supabaseAdmin
      .from('articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete article (admin only)
   */
  async deleteArticle(id: string): Promise<void> {
    // Use admin client to bypass RLS for article deletion
    if (!supabaseAdmin) {
      throw new Error('Admin client not available - SUPABASE_SERVICE_ROLE_KEY is missing from environment variables');
    }

    const { error } = await supabaseAdmin
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Get article statistics
   */
  async getArticleStats(articleId: string) {
    const { data, error } = await supabase
      .from('article_stats')
      .select('*')
      .eq('id', articleId)
      .single();

    if (error) throw error;
    return data;
  }
}

// Export singleton instance
export const articleRepository = new ArticleRepository();
