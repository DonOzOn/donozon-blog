-- Tag management functions for DonOzOn Blog

-- Function to increment tag usage count
CREATE OR REPLACE FUNCTION increment_tag_usage(tag_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE tags
  SET usage_count = COALESCE(usage_count, 0) + 1
  WHERE id = tag_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement tag usage count
CREATE OR REPLACE FUNCTION decrement_tag_usage(tag_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE tags
  SET usage_count = GREATEST(COALESCE(usage_count, 0) - 1, 0)
  WHERE id = tag_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update tag usage counts for an article
CREATE OR REPLACE FUNCTION update_article_tags(
  article_id UUID,
  new_tag_ids UUID[]
)
RETURNS void AS $$
DECLARE
  old_tag_id UUID;
  new_tag_id UUID;
BEGIN
  -- Decrement usage count for old tags
  FOR old_tag_id IN 
    SELECT tag_id FROM article_tags WHERE article_tags.article_id = update_article_tags.article_id
  LOOP
    PERFORM decrement_tag_usage(old_tag_id);
  END LOOP;
  
  -- Remove old tag associations
  DELETE FROM article_tags WHERE article_tags.article_id = update_article_tags.article_id;
  
  -- Add new tag associations and increment usage counts
  FOREACH new_tag_id IN ARRAY new_tag_ids
  LOOP
    INSERT INTO article_tags (article_id, tag_id) VALUES (update_article_tags.article_id, new_tag_id);
    PERFORM increment_tag_usage(new_tag_id);
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get popular tags
CREATE OR REPLACE FUNCTION get_popular_tags(limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  description TEXT,
  color TEXT,
  usage_count INTEGER,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.name,
    t.slug,
    t.description,
    t.color,
    t.usage_count,
    t.created_at
  FROM tags t
  WHERE t.usage_count > 0
  ORDER BY t.usage_count DESC, t.name ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;