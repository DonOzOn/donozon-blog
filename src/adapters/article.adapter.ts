/**
 * Article Adapter - Supabase to Component Interface
 * Transforms Supabase data to match existing component interfaces
 */

import type { PublishedArticle } from '@/types/database';
import type { Article as ComponentArticle } from '@/types/Article';

/**
 * Transform PublishedArticle from Supabase to component Article interface
 */
export const transformPublishedArticle = (article: PublishedArticle): ComponentArticle => {
  return {
    id: article.id || '',
    title: article.title || '',
    slug: article.slug || '',
    excerpt: article.excerpt || '',
    content: article.content || '',
    author: article.author_name || 'Unknown Author',
    publishedAt: article.published_at || new Date().toISOString(),
    readTime: `${article.reading_time || 5} min read`,
    imageUrl: article.featured_image_url || '/images/default-article.jpg',
    category: article.category_slug || 'uncategorized',
    tags: article.tag_names || [],
    featured: article.is_featured || false,
  };
};

/**
 * Transform array of PublishedArticles to component Articles
 */
export const transformPublishedArticles = (articles: PublishedArticle[]): ComponentArticle[] => {
  return articles.map(transformPublishedArticle);
};

/**
 * Backward compatibility: transform API articles to component articles
 */
export const apiArticlesToComponents = transformPublishedArticles;

/**
 * Transform component Article to Supabase ArticleInsert format
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformToArticleInsert = (article: ComponentArticle): any => {
  return {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    featured_image_url: article.imageUrl,
    status: 'published',
    is_featured: article.featured,
    reading_time: parseInt(article.readTime.replace(' min read', '')),
    published_at: article.publishedAt,
    meta_title: article.title,
    meta_description: article.excerpt,
    meta_keywords: article.tags,
  };
};