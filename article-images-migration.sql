-- Article Images Management Migration
-- This table tracks all images used in articles and their lifecycle

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_article_images_article_id ON article_images(article_id);
CREATE INDEX IF NOT EXISTS idx_article_images_imagekit_url ON article_images(imagekit_url);
CREATE INDEX IF NOT EXISTS idx_article_images_deletion ON article_images(marked_for_deletion_at) 
WHERE marked_for_deletion_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_article_images_used ON article_images(is_used, article_id);
CREATE INDEX IF NOT EXISTS idx_article_images_imagekit_file_id ON article_images(imagekit_file_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE article_images ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users (admin/authors)
CREATE POLICY "article_images_admin_access" ON article_images
    FOR ALL USING (auth.role() = 'authenticated');

-- Policy for public read access (for displaying images)
CREATE POLICY "article_images_public_read" ON article_images
    FOR SELECT USING (true);

-- Function to clean up unused images (to be called by scheduled job)
CREATE OR REPLACE FUNCTION cleanup_unused_images()
RETURNS TABLE(deleted_count INTEGER, deleted_images TEXT[])
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_count INTEGER := 0;
    deleted_images TEXT[] := '{}';
BEGIN
    -- Get images marked for deletion that have passed grace period
    WITH images_to_delete AS (
        SELECT id, imagekit_url, imagekit_file_id
        FROM article_images 
        WHERE marked_for_deletion_at IS NOT NULL 
        AND marked_for_deletion_at < NOW()
        AND deleted_at IS NULL
    ),
    deleted AS (
        UPDATE article_images 
        SET deleted_at = NOW()
        WHERE id IN (SELECT id FROM images_to_delete)
        RETURNING imagekit_url
    )
    SELECT array_agg(imagekit_url), count(*)
    INTO deleted_images, deleted_count
    FROM deleted;
    
    RETURN QUERY SELECT deleted_count, deleted_images;
END;
$$;

-- Function to mark images for deletion based on article content
CREATE OR REPLACE FUNCTION update_article_image_usage(
    p_article_id UUID,
    p_content TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    current_images TEXT[];
    unused_count INTEGER := 0;
BEGIN
    -- Extract ImageKit URLs from content using regex
    SELECT array_agg(matches[1])
    INTO current_images
    FROM (
        SELECT regexp_matches(p_content, 'https://ik\.imagekit\.io/[^"''\s)]+', 'g') as matches
    ) AS url_matches;
    
    -- Handle case where no images found
    IF current_images IS NULL THEN
        current_images := '{}';
    END IF;
    
    -- Mark all existing images as unused first
    UPDATE article_images 
    SET is_used = false 
    WHERE article_id = p_article_id;
    
    -- Mark current images as used and remove deletion marks
    UPDATE article_images 
    SET 
        is_used = true,
        marked_for_deletion_at = NULL
    WHERE article_id = p_article_id 
    AND imagekit_url = ANY(current_images);
    
    -- Mark unused images for deletion (with 7-day grace period)
    UPDATE article_images 
    SET marked_for_deletion_at = NOW() + INTERVAL '7 days'
    WHERE article_id = p_article_id 
    AND is_used = false 
    AND marked_for_deletion_at IS NULL;
    
    -- Get count of unused images
    SELECT count(*)
    INTO unused_count
    FROM article_images
    WHERE article_id = p_article_id 
    AND is_used = false;
    
    RETURN unused_count;
END;
$$;

-- Function to get article image statistics
CREATE OR REPLACE FUNCTION get_article_image_stats(p_article_id UUID)
RETURNS TABLE(
    total_images INTEGER,
    used_images INTEGER,
    unused_images INTEGER,
    pending_deletion INTEGER,
    total_size BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        count(*)::INTEGER as total_images,
        count(*) FILTER (WHERE is_used = true)::INTEGER as used_images,
        count(*) FILTER (WHERE is_used = false)::INTEGER as unused_images,
        count(*) FILTER (WHERE marked_for_deletion_at IS NOT NULL)::INTEGER as pending_deletion,
        COALESCE(sum(file_size), 0)::BIGINT as total_size
    FROM article_images
    WHERE article_id = p_article_id
    AND deleted_at IS NULL;
END;
$$;

-- Function to restore images marked for deletion
CREATE OR REPLACE FUNCTION restore_article_images(p_article_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    restored_count INTEGER := 0;
BEGIN
    UPDATE article_images 
    SET 
        marked_for_deletion_at = NULL,
        is_used = true
    WHERE article_id = p_article_id 
    AND marked_for_deletion_at IS NOT NULL
    AND deleted_at IS NULL;
    
    GET DIAGNOSTICS restored_count = ROW_COUNT;
    RETURN restored_count;
END;
$$;

COMMENT ON TABLE article_images IS 'Tracks images used in articles with ImageKit.io integration';
COMMENT ON FUNCTION cleanup_unused_images() IS 'Cleans up images marked for deletion after grace period';
COMMENT ON FUNCTION update_article_image_usage(UUID, TEXT) IS 'Updates image usage tracking based on article content';
COMMENT ON FUNCTION get_article_image_stats(UUID) IS 'Returns image statistics for an article';
COMMENT ON FUNCTION restore_article_images(UUID) IS 'Restores images marked for deletion for an article';
