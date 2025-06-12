/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Base Repository
 * Generic repository with common CRUD operations
 */

import { httpGet, httpPost, httpPut, httpPatch, httpDelete } from '@/lib/http-client';
import type {  PaginatedResponse } from '@/types/api';

export interface FindOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export abstract class BaseRepository<T, CreateDto, UpdateDto> {
  protected abstract basePath: string;

  /**
   * Find all items with pagination and filtering
   */
  async findAll(options: FindOptions = {}): Promise<PaginatedResponse<T>> {
    const searchParams = new URLSearchParams();
    
    if (options.page) searchParams.append('page', options.page.toString());
    if (options.limit) searchParams.append('limit', options.limit.toString());
    if (options.sortBy) searchParams.append('sortBy', options.sortBy);
    if (options.sortOrder) searchParams.append('sortOrder', options.sortOrder);
    
    // Add filters
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;
    
    const response = await httpGet<PaginatedResponse<T>>(url);
    return response.data;
  }

  /**
   * Find item by ID
   */
  async findById(id: string): Promise<T> {
    const response = await httpGet<T>(`${this.basePath}/${id}`);
    return response.data;
  }

  /**
   * Find item by slug
   */
  async findBySlug(slug: string): Promise<T> {
    const response = await httpGet<T>(`${this.basePath}/slug/${slug}`);
    return response.data;
  }

  /**
   * Create new item
   */
  async create(data: CreateDto): Promise<T> {
    const response = await httpPost<T>(this.basePath, data);
    return response.data;
  }

  /**
   * Update item by ID
   */
  async update(id: string, data: UpdateDto): Promise<T> {
    const response = await httpPut<T>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  /**
   * Partially update item by ID
   */
  async patch(id: string, data: Partial<UpdateDto>): Promise<T> {
    const response = await httpPatch<T>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  /**
   * Delete item by ID
   */
  async delete(id: string): Promise<void> {
    await httpDelete(`${this.basePath}/${id}`);
  }

  /**
   * Bulk operations
   */
  async bulkCreate(items: CreateDto[]): Promise<T[]> {
    const response = await httpPost<T[]>(`${this.basePath}/bulk`, { items });
    return response.data;
  }

  async bulkUpdate(updates: { id: string; data: UpdateDto }[]): Promise<T[]> {
    const response = await httpPatch<T[]>(`${this.basePath}/bulk`, { updates });
    return response.data;
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await httpDelete(`${this.basePath}/bulk`, { data: { ids } });
  }

  /**
   * Count items with optional filters
   */
  async count(filters: Record<string, any> = {}): Promise<number> {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const url = queryString ? `${this.basePath}/count?${queryString}` : `${this.basePath}/count`;
    
    const response = await httpGet<{ count: number }>(url);
    return response.data.count;
  }
}