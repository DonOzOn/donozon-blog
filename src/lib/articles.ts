/**
 * Articles Data Functions - Supabase Implementation
 * Functions for retrieving articles from Supabase
 */

import { articleService } from '@/services/article.service';
import { categoryService } from '@/services/category.service';
import { transformPublishedArticles } from '@/adapters/article.adapter';
import type { Article } from '@/types/Article';

/**
 * Get all published articles
 */
export const getAllArticles = async (): Promise<Article[]> => {
  try {
    const result = await articleService.getArticles({ limit: 100 });
    return transformPublishedArticles(result.data);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};

/**
 * Get featured articles
 */
export const getFeaturedArticles = async (): Promise<Article[]> => {
  try {
    const articles = await articleService.getFeaturedArticles();
    return transformPublishedArticles(articles);
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    return [];
  }
};

/**
 * Get articles by category
 */
export const getArticlesByCategory = async (category: string): Promise<Article[]> => {
  try {
    const articles = await articleService.getArticlesByCategory(category);
    return transformPublishedArticles(articles);
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    return [];
  }
};

/**
 * Get article by slug
 */
export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
  try {
    const article = await articleService.getArticleBySlug(slug);
    if (!article) return null;
    return transformPublishedArticles([article])[0];
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }
};

/**
 * Get recent articles
 */
export const getRecentArticles = async (limit = 10): Promise<Article[]> => {
  try {
    const articles = await articleService.getRecentArticles(limit);
    return transformPublishedArticles(articles);
  } catch (error) {
    console.error('Error fetching recent articles:', error);
    return [];
  }
};

/**
 * Get categories with article counts
 */
export const getCategoriesWithCounts = async () => {
  try {
    const categories = await categoryService.getCategoriesWithCounts();
    return categories.map(category => ({
      name: category.name,
      slug: category.slug,
      count: category.article_count,
      icon: category.icon || '📝',
      color: category.color || '#666666',
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Export sample articles for backward compatibility (empty since we're using real data)
export const sampleArticles: Article[] = [];