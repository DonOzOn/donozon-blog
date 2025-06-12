/**
 * Data Source Configuration
 * Switch between local data and API easily
 */

import { sampleArticles } from './articles';
import { apiArticlesToComponents } from '@/adapters/article.adapter';
import type { Article } from '@/types/Article';
import type { Article as ApiArticle } from '@/types/api';

// Configuration flag - set to true when API is ready
const USE_API = true;

/**
 * Get articles by category (mock implementation)
 */
export const getArticlesByCategory = (category: string): Article[] => {
  if (USE_API) {
    // This will be replaced with actual API call
    // return useArticlesByCategory(category).data || [];
    console.log('API not implemented yet, using local data');
  }
  
  // Local data fallback
  return sampleArticles.filter(article => article.category === category);
};

/**
 * Get featured articles (mock implementation)
 */
export const getFeaturedArticles = (): Article[] => {
  if (USE_API) {
    // This will be replaced with actual API call
    // return useFeaturedArticles().data || [];
    console.log('API not implemented yet, using local data');
  }
  
  // Local data fallback
  return sampleArticles.filter(article => article.featured);
};

/**
 * Get article by slug (mock implementation)
 */
export const getArticleBySlug = (slug: string): Article | undefined => {
  if (USE_API) {
    // This will be replaced with actual API call
    // return useArticle(slug).data;
    console.log('API not implemented yet, using local data');
  }
  
  // Local data fallback
  return sampleArticles.find(article => article.slug === slug);
};

/**
 * Get all articles (mock implementation)
 */
export const getAllArticles = (): Article[] => {
  if (USE_API) {
    // This will be replaced with actual API call
    // return useArticles().data?.data || [];
    console.log('API not implemented yet, using local data');
  }
  
  // Local data fallback
  return sampleArticles;
};

/**
 * Search articles (mock implementation)
 */
export const searchArticles = (query: string): Article[] => {
  if (USE_API) {
    // This will be replaced with actual API call
    // return useSearchArticles({ query }).data?.articles || [];
    console.log('API not implemented yet, using local data');
  }
  
  // Local data fallback
  return sampleArticles.filter(article => 
    article.title.toLowerCase().includes(query.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
    article.content.toLowerCase().includes(query.toLowerCase())
  );
};

/**
 * Mock API response structure for testing
 */
export const mockApiResponse = <T>(data: T) => ({
  data,
  message: 'Success',
  success: true,
  timestamp: new Date().toISOString(),
});

/**
 * Mock paginated response for testing
 */
export const mockPaginatedResponse = <T>(data: T[], page = 1, limit = 12) => ({
  data,
  pagination: {
    page,
    limit,
    total: data.length,
    totalPages: Math.ceil(data.length / limit),
    hasNext: page * limit < data.length,
    hasPrev: page > 1,
  },
});

/**
 * Convert local articles to API format for testing
 */
export const convertToApiFormat = (articles: Article[]): ApiArticle[] => {
  return articles.map(article => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    author: article.author,
    publishedAt: new Date(article.publishedAt).toISOString(),
    updatedAt: new Date().toISOString(),
    readTime: article.readTime,
    imageUrl: article.imageUrl,
    category: article.category,
    tags: article.tags,
    featured: article.featured,
    published: true,
    views: Math.floor(Math.random() * 1000),
    likes: Math.floor(Math.random() * 100),
  }));
};

/**
 * Enable API mode (for when backend is ready)
 */
export const enableApiMode = () => {
  console.log('⚠️ API mode would be enabled here. Set USE_API = true in data-source.ts');
  // In a real app, this might update a global state or configuration
};

/**
 * Check if API mode is enabled
 */
export const isApiMode = () => USE_API;