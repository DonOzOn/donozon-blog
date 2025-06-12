-- Quick fix for article creation issues
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/xhzurxmliuvexekfilfo/sql

-- Temporarily disable RLS on articles table to allow article creation
ALTER TABLE articles DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'articles';

-- Also make sure categories table allows reading
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- Check if we have any sample categories
SELECT id, name, slug FROM categories LIMIT 5;

-- If no categories exist, insert some sample categories
INSERT INTO categories (name, slug, description, color, is_active) VALUES
('Technology', 'technology', 'Latest technology trends and news', '#3B82F6', true),
('Development', 'development', 'Software development and programming', '#10B981', true),
('Design', 'design', 'UI/UX design and creative topics', '#F59E0B', true),
('Lifestyle', 'lifestyle', 'Lifestyle and personal topics', '#EF4444', true),
('Business', 'business', 'Business and entrepreneurship', '#8B5CF6', true)
ON CONFLICT (slug) DO NOTHING;

-- Verify categories were created
SELECT id, name, slug, color FROM categories;