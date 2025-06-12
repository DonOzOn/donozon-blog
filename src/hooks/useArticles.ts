/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Article React Query Hooks - Supabase Implementation
 * Custom hooks for article data fetching with React Query
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { articleService } from '@/services/article.service';

// Query keys
export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (filters: any) => [...articleKeys.lists(), filters] as const,
  details: () => [...articleKeys.all, 'detail'] as const,
  detail: (slug: string) => [...articleKeys.details(), slug] as const,
  featured: () => [...articleKeys.all, 'featured'] as const,
  popular: (period: string) => [...articleKeys.all, 'popular', period] as const,
  recent: (limit: number) => [...articleKeys.all, 'recent', limit] as const,
  category: (slug: string, limit?: number) => [...articleKeys.all, 'category', slug, limit] as const,
  search: (params: any) => [...articleKeys.all, 'search', params] as const,
  related: (id: string) => [...articleKeys.all, 'related', id] as const,
  stats: (id: string) => [...articleKeys.all, 'stats', id] as const,
};

/**
 * Get articles with pagination
 */
export const useArticles = (options: { page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: articleKeys.list(options),
    queryFn: () => articleService.getArticles(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Get all articles including drafts (admin only)
 */
export const useAllArticles = (options: { page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: [...articleKeys.all, 'admin', options],
    queryFn: () => articleService.getAllArticles(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Get article by ID (admin only)
 */
export const useArticleById = (id: string) => {
  return useQuery({
    queryKey: [...articleKeys.all, 'admin', 'byId', id],
    queryFn: () => articleService.getArticleById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get articles with infinite scroll
 */
export const useInfiniteArticles = (options: { limit?: number } = {}) => {
  return useInfiniteQuery({
    queryKey: articleKeys.list(options),
    queryFn: ({ pageParam = 1 }) => 
      articleService.getArticles({ ...options, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.hasNext ? pagination.page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get single article by slug
 */
export const useArticle = (slug: string) => {
  return useQuery({
    queryKey: articleKeys.detail(slug),
    queryFn: () => articleService.getArticleBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Get featured articles
 */
export const useFeaturedArticles = () => {
  return useQuery({
    queryKey: articleKeys.featured(),
    queryFn: () => articleService.getFeaturedArticles(),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Get articles by category
 */
export const useArticlesByCategory = (categorySlug: string, limit?: number) => {
  return useQuery({
    queryKey: articleKeys.category(categorySlug, limit),
    queryFn: () => articleService.getArticlesByCategory(categorySlug, limit),
    enabled: !!categorySlug,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get recent articles
 */
export const useRecentArticles = (limit = 5) => {
  return useQuery({
    queryKey: articleKeys.recent(limit),
    queryFn: () => articleService.getRecentArticles(limit),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get popular articles
 */
export const usePopularArticles = (period: 'day' | 'week' | 'month' = 'week', limit = 5) => {
  return useQuery({
    queryKey: articleKeys.popular(`${period}-${limit}`),
    queryFn: () => articleService.getPopularArticles(period, limit),
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Search articles
 */
export const useSearchArticles = (searchParams: {
  query?: string;
  category?: string;
  tags?: string[];
  limit?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: articleKeys.search(searchParams),
    queryFn: () => articleService.searchArticles(searchParams),
    enabled: !!(searchParams.query || searchParams.category || searchParams.tags?.length),
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

/**
 * Get related articles
 */
export const useRelatedArticles = (articleId: string) => {
  return useQuery({
    queryKey: articleKeys.related(articleId),
    queryFn: () => articleService.getRelatedArticles(articleId),
    enabled: !!articleId,
    staleTime: 15 * 60 * 1000,
  });
};

/**
 * Get article statistics
 */
export const useArticleStats = (articleId: string) => {
  return useQuery({
    queryKey: articleKeys.stats(articleId),
    queryFn: () => articleService.getArticleStats(articleId),
    enabled: !!articleId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Like article mutation
 */
export const useLikeArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, userId }: { articleId: string; userId: string }) => 
      articleService.likeArticle(articleId, userId),
    onSuccess: (data, { articleId }) => {
      // Update article cache
      queryClient.setQueryData(
        articleKeys.stats(articleId),
        (old: any) => old ? { ...old, likes: data.likesCount } : undefined
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: articleKeys.stats(articleId) });
    },
    onError: (error) => {
      console.error('Failed to like article:', error);
    },
  });
};

/**
 * Track article view mutation
 */
export const useTrackView = () => {
  return useMutation({
    mutationFn: ({ articleId, userId }: { articleId: string; userId?: string }) => 
      articleService.trackView(articleId, userId),
    onError: (error) => {
      console.error('Failed to track view:', error);
    },
  });
};

/**
 * Create article mutation (admin only)
 */
export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: articleService.createArticle,
    onSuccess: () => {
      // Invalidate and refetch articles
      queryClient.invalidateQueries({ queryKey: articleKeys.all });
    },
  });
};

/**
 * Update article mutation (admin only)
 */
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      articleService.updateArticle(id, data),
    onSuccess: (updatedArticle) => {
      // Update specific article cache
      if (updatedArticle.slug) {
        queryClient.setQueryData(
          articleKeys.detail(updatedArticle.slug),
          updatedArticle
        );
      }

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: articleKeys.all });
    },
  });
};

/**
 * Delete article mutation (admin only)
 */
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => articleService.deleteArticle(id),
    onSuccess: () => {
      // Invalidate all article queries
      queryClient.invalidateQueries({ queryKey: articleKeys.all });
    },
  });
};