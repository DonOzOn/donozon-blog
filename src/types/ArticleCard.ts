export interface ArticleCardData {
  id: string;
  title: string;
  author?: string;
  author_name?: string;
  date?: string;
  published_at?: string;
  publishedAt?: string;
  created_at?: string;
  readTime?: string | number;
  reading_time?: string | number;
  imageUrl?: string;
  featured_image_url?: string;
  slug: string;
  excerpt?: string;
  description?: string;
  category?: string;
  category_name?: string;
  tags?: string[];
  is_featured?: boolean;
}

export interface ArticleCardProps {
  title: string;
  author: string;
  date: string;
  readTime: string | number;
  imageUrl: string;
  slug: string;
  isHovered?: boolean;
  excerpt?: string;
  category?: string;
  tags?: string[];
}

// Utility function to normalize article data for ArticleCard props
export function normalizeArticleData(article: ArticleCardData): ArticleCardProps {
  return {
    title: article.title || 'Untitled Article',
    author: article.author_name || article.author || 'DonOzOn',
    date: article.published_at || article.publishedAt || article.created_at || new Date().toISOString(),
    readTime: article.reading_time || article.readTime || 5,
    imageUrl: article.featured_image_url || article.imageUrl || '/images/default-article.jpg',
    slug: article.slug || '',
    excerpt: article.excerpt || article.description || '',
    category: article.category_name || article.category || '',
    tags: article.tags || []
  };
}