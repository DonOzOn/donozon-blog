/**
 * Category React Query Hooks - Supabase Implementation
 * Custom hooks for category data fetching with React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/category.service';
import type { Category, CategoryInsert } from '@/types/database';

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: any) => [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (slug: string) => [...categoryKeys.details(), slug] as const,
  withCounts: () => [...categoryKeys.all, 'withCounts'] as const,
};

/**
 * Get all categories - Uses API route for consistency
 */
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: async () => {
      const response = await fetch('/api/admin/categories');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch categories');
      }
      
      return result.data || [];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Get categories with article counts
 */
export const useCategoriesWithCounts = () => {
  return useQuery({
    queryKey: categoryKeys.withCounts(),
    queryFn: () => categoryService.getCategoriesWithCounts(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};

/**
 * Get single category by slug
 */
export const useCategory = (slug: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: () => categoryService.getCategoryBySlug(slug),
    enabled: !!slug,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Create category mutation (admin only)
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData: CategoryInsert) => categoryService.createCategory(categoryData),
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (error) => {
      console.error('Failed to create category:', error);
    },
  });
};

/**
 * Update category mutation (admin only)
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CategoryInsert> }) => 
      categoryService.updateCategory(id, data),
    onSuccess: (updatedCategory) => {
      // Update specific category cache
      queryClient.setQueryData(
        categoryKeys.detail(updatedCategory.slug),
        updatedCategory
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (error) => {
      console.error('Failed to update category:', error);
    },
  });
};

/**
 * Delete category mutation (admin only)
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      // Invalidate all category queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (error) => {
      console.error('Failed to delete category:', error);
    },
  });
};