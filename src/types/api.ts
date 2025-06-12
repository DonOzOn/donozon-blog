/**
 * API Response Types and Data Transfer Objects
 */

// Base API Response Structure
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Error Response
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  role: 'admin' | 'author' | 'subscriber';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
}

// Article Types (extending the existing interface)
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: User | string; // Can be populated or just ID
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  imageUrl: string;
  category: Category | string; // Can be populated or just ID
  tags: Tag[] | string[]; // Can be populated or just IDs
  featured?: boolean;
  published: boolean;
  views: number;
  likes: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface CreateArticleDto {
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  categoryId: string;
  tagIds: string[];
  featured?: boolean;
  published?: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface UpdateArticleDto extends Partial<CreateArticleDto> {
  slug?: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  color?: string;
  icon?: string;
  articleCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  imageUrl?: string;
  color?: string;
  icon?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
  slug?: string;
}

// Tag Types
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  articleCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagDto {
  name: string;
  description?: string;
  color?: string;
}

// Comment Types (for future use)
export interface Comment {
  id: string;
  content: string;
  author: User | string;
  article: Article | string;
  parentComment?: Comment | string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentDto {
  content: string;
  articleId: string;
  parentCommentId?: string;
}

// Search & Filter Types
export interface SearchParams {
  query?: string;
  category?: string;
  tags?: string[];
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  featured?: boolean;
  published?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  articles: Article[];
  categories: Category[];
  tags: Tag[];
  totalResults: number;
}

// Analytics Types (for future use)
export interface Analytics {
  totalViews: number;
  totalArticles: number;
  totalUsers: number;
  popularArticles: Article[];
  topCategories: Category[];
  recentActivity: {
    type: 'article_created' | 'article_updated' | 'user_registered';
    title: string;
    timestamp: string;
  }[];
}

// Authentication Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthUser extends User {
  tokens: AuthTokens;
}

// Newsletter/Subscription Types (for future use)
export interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  preferences: {
    weeklyDigest: boolean;
    newArticles: boolean;
    categoryUpdates: string[];
  };
}