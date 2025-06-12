/**
 * Articles API Integration
 * New articles data layer with React Query hooks
 * This file demonstrates how to migrate from local data to API
 */

import { useArticles, useFeaturedArticles, useArticlesByCategory, useArticle } from '@/hooks/useArticles';
import { getArticlesByCategory as getLocalArticlesByCategory, getFeaturedArticles as getLocalFeaturedArticles, getArticleBySlug as getLocalArticleBySlug } from './data-source';
import { apiArticlesToComponents } from '@/adapters/article.adapter';
import type { Article } from '@/types/Article';

// Feature flag for API usage
const USE_API_HOOKS = false;

/**
 * Get articles by category - API-ready version
 * This function demonstrates how to migrate from local data to API
 */
export function useGetArticlesByCategory(category: string, limit?: number) {
  if (USE_API_HOOKS) {
    // When API is ready, use React Query hooks
    const { data: apiArticles, isLoading, error } = useArticlesByCategory(category, limit);
    
    return {
      articles: apiArticles ? apiArticlesToComponents(apiArticles) : [],
      isLoading,
      error,
    };
  }
  
  // Fallback to local data with same interface
  const articles = getLocalArticlesByCategory(category);
  const limitedArticles = limit ? articles.slice(0, limit) : articles;
  
  return {
    articles: limitedArticles,
    isLoading: false,
    error: null,
  };
}

/**
 * Get featured articles - API-ready version
 */
export function useGetFeaturedArticles() {
  if (USE_API_HOOKS) {
    const { data: apiArticles, isLoading, error } = useFeaturedArticles();
    
    return {
      articles: apiArticles ? apiArticlesToComponents(apiArticles) : [],
      isLoading,
      error,
    };
  }
  
  return {
    articles: getLocalFeaturedArticles(),
    isLoading: false,
    error: null,
  };
}

/**
 * Get article by slug - API-ready version
 */
export function useGetArticleBySlug(slug: string) {
  if (USE_API_HOOKS) {
    const { data: apiArticle, isLoading, error } = useArticle(slug);
    
    return {
      article: apiArticle ? apiArticlesToComponents([apiArticle])[0] : null,
      isLoading,
      error,
    };
  }
  
  return {
    article: getLocalArticleBySlug(slug) || null,
    isLoading: false,
    error: null,
  };
}

/**
 * Example of how components will be updated to use the new API:
 * 
 * Before (in components):
 * ```tsx
 * import { getArticlesByCategory } from '@/lib/articles';
 * 
 * const cssArticles = getArticlesByCategory('css').slice(0, 4);
 * ```
 * 
 * After (in components):
 * ```tsx
 * import { useGetArticlesByCategory } from '@/lib/articles-new';
 * 
 * function MyComponent() {
 *   const { articles: cssArticles, isLoading, error } = useGetArticlesByCategory('css', 4);
 *   
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage />;
 *   
 *   return (
 *     // render articles
 *   );
 * }
 * ```
 */

// Re-export the original functions for backward compatibility
export {
  getArticlesByCategory,
  getFeaturedArticles,
  getArticleBySlug,
} from './data-source';

/**
 * Migration helper - enables API mode
 */
export const enableApiMode = () => {
  console.log('🔄 To enable API mode:');
  console.log('1. Set USE_API_HOOKS = true in articles-new.ts');
  console.log('2. Update components to use the new hook-based functions');
  console.log('3. Ensure your API endpoints are working');
};

/**
 * Type definitions for the hook returns
 */
export interface ArticlesHookReturn {
  articles: Article[];
  isLoading: boolean;
  error: any;
}

export interface ArticleHookReturn {
  article: Article | null;
  isLoading: boolean;
  error: any;
}