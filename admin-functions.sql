-- Admin helper functions for DonOzOn Blog

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(article_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE articles
  SET view_count = COALESCE(view_count, 0) + 1,
      updated_at = NOW()
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update article like count
CREATE OR REPLACE FUNCTION update_article_like_count(article_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE articles
  SET like_count = (
    SELECT COUNT(*)
    FROM likes
    WHERE likes.article_id = articles.id
  ),
  updated_at = NOW()
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update article comment count
CREATE OR REPLACE FUNCTION update_article_comment_count(article_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE articles
  SET comment_count = (
    SELECT COUNT(*)
    FROM comments
    WHERE comments.article_id = articles.id
    AND comments.status = 'approved'
  ),
  updated_at = NOW()
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate reading time based on content
CREATE OR REPLACE FUNCTION calculate_reading_time(content_text TEXT)
RETURNS INTEGER AS $$
DECLARE
  word_count INTEGER;
  reading_time INTEGER;
BEGIN
  -- Count words (rough estimation)
  word_count := array_length(string_to_array(content_text, ' '), 1);
  
  -- Calculate reading time (assuming 200 words per minute)
  reading_time := CEIL(word_count::DECIMAL / 200);
  
  -- Minimum 1 minute
  IF reading_time < 1 THEN
    reading_time := 1;
  END IF;
  
  RETURN reading_time;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update reading time when content changes
CREATE OR REPLACE FUNCTION update_reading_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.reading_time := calculate_reading_time(NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reading time
DROP TRIGGER IF EXISTS trigger_update_reading_time ON articles;
CREATE TRIGGER trigger_update_reading_time
  BEFORE INSERT OR UPDATE OF content ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_reading_time();

-- Function to get article statistics
CREATE OR REPLACE FUNCTION get_article_statistics()
RETURNS TABLE (
  total_articles BIGINT,
  published_articles BIGINT,
  draft_articles BIGINT,
  total_views BIGINT,
  total_likes BIGINT,
  total_comments BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_articles,
    COUNT(*) FILTER (WHERE status = 'published') as published_articles,
    COUNT(*) FILTER (WHERE status = 'draft') as draft_articles,
    COALESCE(SUM(view_count), 0) as total_views,
    COALESCE(SUM(like_count), 0) as total_likes,
    COALESCE(SUM(comment_count), 0) as total_comments
  FROM articles;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get popular articles
CREATE OR REPLACE FUNCTION get_popular_articles(
  time_period TEXT DEFAULT 'week',
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  view_count INTEGER,
  like_count INTEGER,
  published_at TIMESTAMPTZ
) AS $$
DECLARE
  date_threshold TIMESTAMPTZ;
BEGIN
  -- Set date threshold based on period
  CASE time_period
    WHEN 'day' THEN date_threshold := NOW() - INTERVAL '1 day';
    WHEN 'week' THEN date_threshold := NOW() - INTERVAL '1 week';
    WHEN 'month' THEN date_threshold := NOW() - INTERVAL '1 month';
    ELSE date_threshold := NOW() - INTERVAL '1 week';
  END CASE;

  RETURN QUERY
  SELECT
    a.id,
    a.title,
    a.slug,
    a.view_count,
    a.like_count,
    a.published_at
  FROM articles a
  WHERE a.status = 'published'
    AND a.published_at >= date_threshold
  ORDER BY a.view_count DESC NULLS LAST, a.like_count DESC NULLS LAST
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;