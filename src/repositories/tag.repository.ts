/**
 * Tag Repository - Supabase Implementation
 * Handles all tag-related database operations
 */

import { supabase } from '@/lib/supabase';
import type { Tag, TagInsert } from '@/types/database';

export class TagRepository {
  /**
   * Get all tags
   */
  async getTags(): Promise<Tag[]> {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('usage_count', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get tag by slug
   */
  async getTagBySlug(slug: string): Promise<Tag | null> {
    const { data, error } = await supabase
      .from('tags')
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
   * Get popular tags
   */
  async getPopularTags(limit = 20): Promise<Tag[]> {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('usage_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Search tags by name
   */
  async searchTags(query: string): Promise<Tag[]> {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('usage_count', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  }

  /**
   * Create new tag
   */
  async createTag(tagData: TagInsert): Promise<Tag> {
    const { data, error } = await supabase
      .from('tags')
      .insert(tagData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update tag
   */
  async updateTag(id: string, updates: Partial<TagInsert>): Promise<Tag> {
    const { data, error } = await supabase
      .from('tags')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete tag (with cascade to article_tags)
   */
  async deleteTag(id: string): Promise<void> {
    // First, remove all article-tag associations for this tag
    const { error: articleTagsError } = await supabase
      .from('article_tags')
      .delete()
      .eq('tag_id', id);

    if (articleTagsError) {
      console.error('Error deleting article_tags associations:', articleTagsError);
      throw new Error(`Failed to remove tag associations: ${articleTagsError.message}`);
    }

    // Then delete the tag itself
    const { error: tagError } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);

    if (tagError) {
      console.error('Error deleting tag:', tagError);
      throw new Error(`Failed to delete tag: ${tagError.message}`);
    }
  }

  /**
   * Create tag if it doesn't exist, otherwise return existing
   */
  async findOrCreateTag(name: string): Promise<Tag> {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Try to find existing tag
    const existingTag = await this.getTagBySlug(slug);
    if (existingTag) {
      return existingTag;
    }

    // Create new tag
    const tagData: TagInsert = {
      name,
      slug,
      usage_count: 0,
      created_at: new Date().toISOString(),
    };

    return await this.createTag(tagData);
  }

  /**
   * Increment usage count for a tag
   */
  async incrementUsage(tagId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_tag_usage', { tag_id: tagId });
    if (error) throw error;
  }

  /**
   * Decrement usage count for a tag
   */
  async decrementUsage(tagId: string): Promise<void> {
    const { error } = await supabase.rpc('decrement_tag_usage', { tag_id: tagId });
    if (error) throw error;
  }
}

// Export singleton instance
export const tagRepository = new TagRepository();