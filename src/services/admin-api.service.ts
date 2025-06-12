/**
 * Admin API Service - Client-side service for admin operations
 * This service calls API routes instead of directly using Supabase admin client
 */

import type { ArticleInsert, Article } from '@/types/database';

class AdminApiService {
  private baseUrl = '/api/admin';

  async createArticle(articleData: ArticleInsert): Promise<Article> {
    console.log('🚀 Admin API Service: Creating article via API route');
    console.log('📝 Admin API Service: Article data:', articleData);

    const response = await fetch(`${this.baseUrl}/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Admin API Service: API error:', result);
      throw new Error(result.error || 'Failed to create article');
    }

    if (!result.success || !result.data) {
      throw new Error(result.error || 'No data returned from API');
    }

    console.log('✅ Admin API Service: Article created successfully');
    return result.data;
  }

  async getArticles(): Promise<Article[]> {
    console.log('🔍 Admin API: Fetching articles via API route');
    
    const response = await fetch(`${this.baseUrl}/articles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Admin API: Failed to fetch articles:', result);
      throw new Error(result.error || 'Failed to fetch articles');
    }

    console.log('✅ Admin API: Articles fetched successfully:', result);
    console.log('📊 Admin API: Raw data structure:', result.data);
    return result.data || [];
  }

  async getArticleById(id: string): Promise<Article> {
    console.log('🔍 Admin API: Fetching article by ID via API route:', id);
    
    const response = await fetch(`${this.baseUrl}/articles/${id}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch article');
    }

    return result.data;
  }

  async updateArticle(id: string, articleData: Partial<ArticleInsert>): Promise<Article> {
    console.log('📝 Admin API: Updating article via API route:', id);
    
    const response = await fetch(`${this.baseUrl}/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Admin API: Failed to update article:', result);
      throw new Error(result.error || 'Failed to update article');
    }

    console.log('✅ Admin API: Article updated successfully');
    return result.data;
  }

  async deleteArticle(id: string): Promise<void> {
    console.log('🗑️ Admin API: Deleting article via API route:', id);
    
    const response = await fetch(`${this.baseUrl}/articles/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const result = await response.json();
      console.error('❌ Admin API: Failed to delete article:', result);
      throw new Error(result.error || 'Failed to delete article');
    }

    console.log('✅ Admin API: Article deleted successfully');
  }
}

export const adminApiService = new AdminApiService();