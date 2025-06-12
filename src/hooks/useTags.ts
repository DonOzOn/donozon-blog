/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Tag React Query Hooks - Supabase Implementation
 * Custom hooks for tag data fetching with React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagService } from '@/services/tag.service';
import type {  TagInsert } from '@/types/database';

// Query keys
export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: (filters: any) => [...tagKeys.lists(), filters] as const,
  details: () => [...tagKeys.all, 'detail'] as const,
  detail: (slug: string) => [...tagKeys.details(), slug] as const,
  popular: (limit: number) => [...tagKeys.all, 'popular', limit] as const,
  search: (query: string) => [...tagKeys.all, 'search', query] as const,
};

/**
 * Get all tags
 */
export const useTags = () => {
  return useQuery({
    queryKey: tagKeys.lists(),
    queryFn: () => tagService.getTags(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};

/**
 * Get popular tags
 */
export const usePopularTags = (limit = 20) => {
  return useQuery({
    queryKey: tagKeys.popular(limit),
    queryFn: () => tagService.getPopularTags(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Search tags
 */
export const useSearchTags = (query: string) => {
  return useQuery({
    queryKey: tagKeys.search(query),
    queryFn: () => tagService.searchTags(query),
    enabled: query.length > 1, // Only search if query is at least 2 characters
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Get single tag by slug
 */
export const useTag = (slug: string) => {
  return useQuery({
    queryKey: tagKeys.detail(slug),
    queryFn: () => tagService.getTagBySlug(slug),
    enabled: !!slug,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Create tag mutation (admin only)
 */
export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagData: TagInsert) => tagService.createTag(tagData),
    onSuccess: () => {
      // Invalidate and refetch tags
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
    onError: (error) => {
      console.error('Failed to create tag:', error);
    },
  });
};

/**
 * Update tag mutation (admin only)
 */
export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TagInsert> }) => 
      tagService.updateTag(id, data),
    onSuccess: (updatedTag) => {
      // Update specific tag cache
      queryClient.setQueryData(
        tagKeys.detail(updatedTag.slug),
        updatedTag
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
    onError: (error) => {
      console.error('Failed to update tag:', error);
    },
  });
};

/**
 * Delete tag mutation (admin only)
 */
export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tagService.deleteTag(id),
    onSuccess: () => {
      // Invalidate all tag queries
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
    onError: (error) => {
      console.error('Failed to delete tag:', error);
    },
  });
};