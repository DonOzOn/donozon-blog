-- Basic image management setup (minimal version for auto-setup)
-- This will be used by the auto-setup service

-- Create article_images table
CREATE TABLE IF NOT EXISTS article_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  imagekit_file_id VARCHAR NOT NULL,
  imagekit_url VARCHAR NOT NULL UNIQUE,
  file_name VARCHAR NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR,
  folder_path VARCHAR DEFAULT '/blog-articles/',
  is_used BOOLEAN DEFAULT true,
  is_featured_image BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  marked_for_deletion_at TIMESTAMP WITH TIME ZONE NULL,
  deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Create basic indexes
CREATE INDEX IF NOT EXISTS idx_article_images_article_id ON article_images(article_id);
CREATE INDEX IF NOT EXISTS idx_article_images_imagekit_url ON article_images(imagekit_url);
CREATE INDEX IF NOT EXISTS idx_article_images_used ON article_images(is_used, article_id);

-- Add RLS policies
ALTER TABLE article_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "article_images_public_read" ON article_images FOR SELECT USING (true);
