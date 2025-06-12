// Generated Supabase Database Types for DonOzOn Blog
// Auto-generated from Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      article_tags: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
      }
      article_views: {
        Row: {
          article_id: string
          country: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          referrer: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          article_id: string
          country?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          article_id?: string
          country?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
      }
      articles: {
        Row: {
          author_id: string | null
          category_id: string | null
          comment_count: number | null
          content: string | null
          content_html: string | null
          created_at: string | null
          excerpt: string | null
          featured_image_alt: string | null
          featured_image_url: string | null
          id: string
          is_featured: boolean | null
          like_count: number | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          published_at: string | null
          reading_time: number | null
          scheduled_at: string | null
          share_count: number | null
          slug: string
          status: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          comment_count?: number | null
          content?: string | null
          content_html?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_alt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          like_count?: number | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          scheduled_at?: string | null
          share_count?: number | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          comment_count?: number | null
          content?: string | null
          content_html?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_alt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          like_count?: number | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          scheduled_at?: string | null
          share_count?: number | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
      }
      bookmarks: {
        Row: {
          article_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
      }
      comments: {
        Row: {
          article_id: string
          author_email: string | null
          author_name: string | null
          content: string
          created_at: string | null
          id: string
          is_edited: boolean | null
          like_count: number | null
          parent_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          article_id: string
          author_email?: string | null
          author_name?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_edited?: boolean | null
          like_count?: number | null
          parent_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          article_id?: string
          author_email?: string | null
          author_name?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_edited?: boolean | null
          like_count?: number | null
          parent_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          replied_at: string | null
          replied_by: string | null
          status: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          replied_at?: string | null
          replied_by?: string | null
          status?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          replied_at?: string | null
          replied_by?: string | null
          status?: string | null
          subject?: string | null
        }
      }
      likes: {
        Row: {
          article_id: string | null
          comment_id: string | null
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          article_id?: string | null
          comment_id?: string | null
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string | null
          comment_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string
        }
      }
      media: {
        Row: {
          alt_text: string | null
          article_id: string | null
          caption: string | null
          created_at: string | null
          file_path: string
          file_size: number | null
          file_url: string
          filename: string
          height: number | null
          id: string
          mime_type: string | null
          original_filename: string
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          article_id?: string | null
          caption?: string | null
          created_at?: string | null
          file_path: string
          file_size?: number | null
          file_url: string
          filename: string
          height?: number | null
          id?: string
          mime_type?: string | null
          original_filename: string
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          article_id?: string | null
          caption?: string | null
          created_at?: string | null
          file_path?: string
          file_size?: number | null
          file_url?: string
          filename?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          original_filename?: string
          uploaded_by?: string | null
          width?: number | null
        }
      }
      newsletter_subscribers: {
        Row: {
          confirmation_token: string | null
          confirmed_at: string | null
          created_at: string | null
          email: string
          id: string
          name: string | null
          preferences: Json | null
          status: string | null
          unsubscribed_at: string | null
          updated_at: string | null
        }
        Insert: {
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          preferences?: Json | null
          status?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          preferences?: Json | null
          status?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          role: string | null
          social_links: Json | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          role?: string | null
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          role?: string | null
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
      }
      tags: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          usage_count: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          usage_count?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          usage_count?: number | null
        }
      }
    }
    Views: {
      article_stats: {
        Row: {
          comment_count: number | null
          id: string | null
          like_count: number | null
          title: string | null
          total_comments: number | null
          total_likes: number | null
          unique_views: number | null
          view_count: number | null
        }
      }
      published_articles: {
        Row: {
          author: string | null
          publishedAt: string | null
          imageUrl: string | null
          author_avatar: string | null
          author_id: string | null
          author_name: string | null
          category_color: string | null
          category_id: string | null
          category_name: string | null
          category_slug: string | null
          comment_count: number | null
          content: string | null
          content_html: string | null
          created_at: string | null
          excerpt: string | null
          featured_image_alt: string | null
          featured_image_url: string | null
          id: string | null
          is_featured: boolean | null
          like_count: number | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          published_at: string | null
          reading_time: number | null
          scheduled_at: string | null
          share_count: number | null
          slug: string | null
          status: string | null
          tag_names: string[] | null
          title: string | null
          updated_at: string | null
          view_count: number | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type helpers for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific types for your blog
export type Article = Tables<'articles'>
export type ArticleInsert = TablesInsert<'articles'>
export type ArticleUpdate = TablesUpdate<'articles'>

export type Category = Tables<'categories'>
export type CategoryInsert = TablesInsert<'categories'>

export type Tag = Tables<'tags'>
export type TagInsert = TablesInsert<'tags'>

export type Profile = Tables<'profiles'>
export type ProfileInsert = TablesInsert<'profiles'>

export type Comment = Tables<'comments'>
export type CommentInsert = TablesInsert<'comments'>

export type Like = Tables<'likes'>
export type NewsletterSubscriber = Tables<'newsletter_subscribers'>
export type ContactMessage = Tables<'contact_messages'>
export type Bookmark = Tables<'bookmarks'>
export type Media = Tables<'media'>

// Views
export type PublishedArticle = Database['public']['Views']['published_articles']['Row']
export type ArticleStats = Database['public']['Views']['article_stats']['Row']

// Status enums based on your schema
export type ArticleStatus = 'draft' | 'published' | 'archived' | 'scheduled'
export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam'
export type UserRole = 'admin' | 'author' | 'editor' | 'reader'
export type SubscriberStatus = 'pending' | 'confirmed' | 'unsubscribed'
export type ContactStatus = 'new' | 'read' | 'replied' | 'archived'
