/**
 * Tag Service - Supabase Implementation
 * Business logic layer for tag operations
 */

import { tagRepository } from '@/repositories/tag.repository';
import type { Tag, TagInsert } from '@/types/database';

export class TagService {
  /**
   * Get all tags
   */
  async getTags(): Promise<Tag[]> {
    return await tagRepository.getTags();
  }

  /**
   * Get tag by slug
   */
  async getTagBySlug(slug: string): Promise<Tag | null> {
    return await tagRepository.getTagBySlug(slug);
  }

  /**
   * Get popular tags
   */
  async getPopularTags(limit = 20): Promise<Tag[]> {
    return await tagRepository.getPopularTags(limit);
  }

  /**
   * Search tags
   */
  async searchTags(query: string): Promise<Tag[]> {
    return await tagRepository.searchTags(query);
  }

  /**
   * Create new tag (admin only)
   */
  async createTag(tagData: TagInsert): Promise<Tag> {
    const response = await fetch('/api/admin/tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tagData),
    });

    if (!response.ok) {
      throw new Error('Failed to create tag');
    }

    return await response.json();
  }

  /**
   * Update tag (admin only)
   */
  async updateTag(id: string, updates: Partial<TagInsert>): Promise<Tag> {
    const response = await fetch(`/api/admin/tags/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update tag');
    }

    return await response.json();
  }

  /**
   * Delete tag (admin only)
   */
  async deleteTag(id: string): Promise<void> {
    const response = await fetch(`/api/admin/tags/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete tag');
    }
  }

  /**
   * Find or create tag by name
   */
  async findOrCreateTag(name: string): Promise<Tag> {
    return await tagRepository.findOrCreateTag(name);
  }

  /**
   * Process tags from article form
   */
  async processArticleTags(tagNames: string[]): Promise<string[]> {
    const tagIds: string[] = [];
    
    for (const tagName of tagNames) {
      if (tagName.trim()) {
        const tag = await this.findOrCreateTag(tagName.trim());
        tagIds.push(tag.id);
      }
    }
    
    return tagIds;
  }
}

// Export singleton instance
export const tagService = new TagService();