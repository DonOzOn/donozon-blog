/**
 * Category Service - Supabase Implementation
 * Business logic layer for category operations
 */

import { categoryRepository } from '@/repositories/category.repository';
import type { Category, CategoryInsert } from '@/types/database';

export class CategoryService {
  /**
   * Get all active categories
   */
  async getCategories(): Promise<Category[]> {
    return await categoryRepository.getCategories();
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return await categoryRepository.getCategoryBySlug(slug);
  }

  /**
   * Get categories with article counts
   */
  async getCategoriesWithCounts(): Promise<(Category & { article_count: number })[]> {
    return await categoryRepository.getCategoriesWithCounts();
  }

  /**
   * Create new category (admin only)
   */
  async createCategory(categoryData: CategoryInsert): Promise<Category> {
    return await categoryRepository.createCategory(categoryData);
  }

  /**
   * Update category (admin only)
   */
  async updateCategory(id: string, updates: Partial<CategoryInsert>): Promise<Category> {
    return await categoryRepository.updateCategory(id, updates);
  }

  /**
   * Delete category (admin only)
   */
  async deleteCategory(id: string): Promise<void> {
    return await categoryRepository.deleteCategory(id);
  }
}

// Export singleton instance
export const categoryService = new CategoryService();