-- Image Management System Database Migration
-- This migration creates the necessary tables and functions for comprehensive image management

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create article_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS article_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  imagekit_file_id TEXT NOT NULL UNIQUE,
  imagekit_url TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  folder_path TEXT,
  is_used BOOLEAN DEFAULT false,
  is_featured_image BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  marked_for_deletion_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_article_images_article_id ON article_images(article_id);
CREATE INDEX IF NOT EXISTS idx_article_images_is_used ON article_images(is_used);
CREATE INDEX IF NOT EXISTS idx_article_images_deleted_at ON article_images(deleted_at);
CREATE INDEX IF NOT EXISTS idx_article_images_marked_for_deletion ON article_images(marked_for_deletion_at);
CREATE INDEX IF NOT EXISTS idx_article_images_created_at ON article_images(created_at);
CREATE INDEX IF NOT EXISTS idx_article_images_imagekit_url ON article_images(imagekit_url);

-- Function to extract ImageKit URLs from content
CREATE OR REPLACE FUNCTION extract_imagekit_urls(content TEXT)
RETURNS TEXT[] AS $$
DECLARE
  urls TEXT[];
  url_pattern TEXT := 'https://ik\.imagekit\.io/[^"''\\s)]+';
BEGIN
  -- Extract all ImageKit URLs using regex
  SELECT ARRAY(
    SELECT unnest(regexp_split_to_array(content, url_pattern, 'g'))
  ) INTO urls;
  
  -- Filter out empty strings and return actual URLs
  SELECT ARRAY(
    SELECT (regexp_matches(content, url_pattern, 'g'))[1]
  ) INTO urls;
  
  RETURN COALESCE(urls, ARRAY[]::TEXT[]);
END;
$$ LANGUAGE plpgsql;

-- Function to update article image usage
CREATE OR REPLACE FUNCTION update_article_image_usage(
  p_article_id UUID,
  p_content TEXT
)
RETURNS INTEGER AS $$
DECLARE
  image_urls TEXT[];
  updated_count INTEGER := 0;
BEGIN
  -- Extract ImageKit URLs from content
  image_urls := extract_imagekit_urls(p_content);
  
  -- Mark all current images as unused first
  UPDATE article_images 
  SET is_used = false, 
      updated_at = NOW(),
      marked_for_deletion_at = CASE 
        WHEN is_used = true AND is_featured_image = false THEN NOW()
        ELSE marked_for_deletion_at
      END
  WHERE article_id = p_article_id 
    AND deleted_at IS NULL;
  
  -- Mark images found in content as used
  IF array_length(image_urls, 1) > 0 THEN
    UPDATE article_images 
    SET is_used = true, 
        updated_at = NOW(),
        marked_for_deletion_at = NULL
    WHERE article_id = p_article_id 
      AND imagekit_url = ANY(image_urls)
      AND deleted_at IS NULL;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
  END IF;
  
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get article image statistics
CREATE OR REPLACE FUNCTION get_article_image_stats(p_article_id UUID)
RETURNS TABLE(
  total_images INTEGER,
  used_images INTEGER,
  unused_images INTEGER,
  pending_deletion INTEGER,
  total_size BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_images,
    COUNT(*) FILTER (WHERE is_used = true)::INTEGER as used_images,
    COUNT(*) FILTER (WHERE is_used = false)::INTEGER as unused_images,
    COUNT(*) FILTER (WHERE marked_for_deletion_at IS NOT NULL)::INTEGER as pending_deletion,
    COALESCE(SUM(file_size), 0)::BIGINT as total_size
  FROM article_images 
  WHERE article_id = p_article_id 
    AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup unused images (soft delete first, then hard delete after grace period)
CREATE OR REPLACE FUNCTION cleanup_unused_images(
  p_grace_period_hours INTEGER DEFAULT 48
)
RETURNS TABLE(
  deleted_count INTEGER,
  deleted_images TEXT[]
) AS $$
DECLARE
  grace_cutoff TIMESTAMP WITH TIME ZONE;
  result_count INTEGER := 0;
  result_images TEXT[];
BEGIN
  grace_cutoff := NOW() - (p_grace_period_hours || ' hours')::INTERVAL;
  
  -- Get images that are marked for deletion and past grace period
  SELECT ARRAY(
    SELECT imagekit_url 
    FROM article_images 
    WHERE marked_for_deletion_at IS NOT NULL 
      AND marked_for_deletion_at < grace_cutoff
      AND deleted_at IS NULL
      AND is_used = false
  ) INTO result_images;
  
  -- Mark them as deleted (soft delete)
  UPDATE article_images 
  SET deleted_at = NOW(), updated_at = NOW()
  WHERE marked_for_deletion_at IS NOT NULL 
    AND marked_for_deletion_at < grace_cutoff
    AND deleted_at IS NULL
    AND is_used = false;
  
  GET DIAGNOSTICS result_count = ROW_COUNT;
  
  RETURN QUERY SELECT result_count, COALESCE(result_images, ARRAY[]::TEXT[]);
END;
$$ LANGUAGE plpgsql;

-- Function to restore article images from deletion
CREATE OR REPLACE FUNCTION restore_article_images(p_article_id UUID)
RETURNS INTEGER AS $$
DECLARE
  restored_count INTEGER := 0;
BEGIN
  UPDATE article_images 
  SET marked_for_deletion_at = NULL,
      updated_at = NOW()
  WHERE article_id = p_article_id 
    AND marked_for_deletion_at IS NOT NULL
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS restored_count = ROW_COUNT;
  
  RETURN restored_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get global image statistics
CREATE OR REPLACE FUNCTION get_global_image_stats()
RETURNS TABLE(
  total_images INTEGER,
  used_images INTEGER,
  unused_images INTEGER,
  pending_deletion INTEGER,
  total_size BIGINT,
  total_articles_with_images INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_images,
    COUNT(*) FILTER (WHERE is_used = true)::INTEGER as used_images,
    COUNT(*) FILTER (WHERE is_used = false)::INTEGER as unused_images,
    COUNT(*) FILTER (WHERE marked_for_deletion_at IS NOT NULL)::INTEGER as pending_deletion,
    COALESCE(SUM(file_size), 0)::BIGINT as total_size,
    COUNT(DISTINCT article_id) FILTER (WHERE article_id IS NOT NULL)::INTEGER as total_articles_with_images
  FROM article_images 
  WHERE deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to handle orphaned images (images without article_id)
CREATE OR REPLACE FUNCTION adopt_orphaned_images(
  p_article_id UUID,
  p_image_urls TEXT[]
)
RETURNS INTEGER AS $$
DECLARE
  adopted_count INTEGER := 0;
BEGIN
  -- Update orphaned images to belong to the article
  UPDATE article_images 
  SET article_id = p_article_id,
      is_used = true,
      marked_for_deletion_at = NULL,
      updated_at = NOW()
  WHERE imagekit_url = ANY(p_image_urls)
    AND article_id IS NULL
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS adopted_count = ROW_COUNT;
  
  RETURN adopted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update featured image status
CREATE OR REPLACE FUNCTION update_featured_image(
  p_article_id UUID,
  p_image_url TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Clear existing featured image status for the article
  UPDATE article_images 
  SET is_featured_image = false,
      updated_at = NOW()
  WHERE article_id = p_article_id 
    AND is_featured_image = true
    AND deleted_at IS NULL;
  
  -- Set new featured image if URL provided
  IF p_image_url IS NOT NULL AND p_image_url != '' THEN
    UPDATE article_images 
    SET is_featured_image = true,
        is_used = true,
        marked_for_deletion_at = NULL,
        updated_at = NOW()
    WHERE article_id = p_article_id 
      AND imagekit_url = p_image_url
      AND deleted_at IS NULL;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for article_images table
DROP TRIGGER IF EXISTS update_article_images_updated_at ON article_images;
CREATE TRIGGER update_article_images_updated_at
  BEFORE UPDATE ON article_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create a view for easy image management queries
CREATE OR REPLACE VIEW image_management_view AS
SELECT 
  ai.*,
  a.title as article_title,
  a.slug as article_slug,
  a.status as article_status,
  CASE 
    WHEN ai.deleted_at IS NOT NULL THEN 'deleted'
    WHEN ai.marked_for_deletion_at IS NOT NULL THEN 'pending_deletion'
    WHEN ai.is_used THEN 'used'
    ELSE 'unused'
  END as image_status,
  EXTRACT(EPOCH FROM (NOW() - ai.created_at))/3600 as age_hours,
  CASE 
    WHEN ai.article_id IS NULL THEN true
    ELSE false
  END as is_orphaned
FROM article_images ai
LEFT JOIN articles a ON ai.article_id = a.id;

-- Insert some helpful comments
COMMENT ON TABLE article_images IS 'Tracks all images uploaded via ImageKit for articles';
COMMENT ON COLUMN article_images.is_used IS 'Whether the image is currently used in article content';
COMMENT ON COLUMN article_images.is_featured_image IS 'Whether this is the featured image for the article';
COMMENT ON COLUMN article_images.marked_for_deletion_at IS 'When the image was marked for deletion (grace period)';
COMMENT ON COLUMN article_images.deleted_at IS 'When the image was actually deleted';

-- Grant permissions (adjust based on your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON article_images TO your_app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO your_app_user;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Image Management System migration completed successfully!';
  RAISE NOTICE 'Created tables: article_images';
  RAISE NOTICE 'Created functions: extract_imagekit_urls, update_article_image_usage, get_article_image_stats, cleanup_unused_images, restore_article_images, get_global_image_stats, adopt_orphaned_images, update_featured_image';
  RAISE NOTICE 'Created view: image_management_view';
  RAISE NOTICE 'Created indexes for optimal performance';
END $$;
