export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  category: string;
  tags: string[];
  featured?: boolean;
}