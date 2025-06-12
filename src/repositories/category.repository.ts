/**
 * Category Repository - Supabase Implementation
 * Handles all category-related database operations
 */

import { supabase } from '@/lib/supabase';
import type { Category, CategoryInsert } from '@/types/database';

export class CategoryRepository {
  /**
   * Get all active categories
   */
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  }

  /**
   * Get categories with article counts
   */
  async getCategoriesWithCounts(): Promise<(Category & { article_count: number })[]> {
    // Get categories and their article counts using a manual approach
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    
    // For each category, count the published articles
    const categoriesWithCounts = await Promise.all(
      (categories || []).map(async (category) => {
        const { count, error: countError } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id)
          .eq('status', 'published');

        if (countError) {
          console.error('Error counting articles for category:', countError);
          return { ...category, article_count: 0 };
        }

        return { ...category, article_count: count || 0 };
      })
    );

    return categoriesWithCounts;
  }

  /**
   * Create new category (admin only)
   */
  async createCategory(categoryData: CategoryInsert): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update category (admin only)
   */
  async updateCategory(id: string, updates: Partial<CategoryInsert>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete category (admin only)
   */
  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

// Export singleton instance
export const categoryRepository = new CategoryRepository();