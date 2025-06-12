-- Fix RLS Policy Issues for DonOzOn Blog
-- Run this in Supabase SQL Editor to fix article creation issues

-- Option 1: Temporarily disable RLS on articles table
-- (Quick fix for development - not recommended for production)
ALTER TABLE articles DISABLE ROW LEVEL SECURITY;

-- Option 2: Create proper RLS policies that allow service role access
-- (Recommended approach for production)

-- Re-enable RLS first (if you want to use policies instead of disabling)
-- ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create policy for service role to bypass all restrictions
-- CREATE POLICY "Service role can do everything on articles" ON articles
--   FOR ALL
--   TO service_role
--   USING (true)
--   WITH CHECK (true);

-- Create policy for authenticated users to read published articles
-- CREATE POLICY "Anyone can read published articles" ON articles
--   FOR SELECT
--   USING (status = 'published');

-- Create policy for admin users to manage articles
-- CREATE POLICY "Admins can manage all articles" ON articles
--   FOR ALL
--   TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM profiles 
--       WHERE profiles.id = auth.uid() 
--       AND profiles.role = 'admin'
--     )
--   )
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM profiles 
--       WHERE profiles.id = auth.uid() 
--       AND profiles.role = 'admin'
--     )
--   );

-- Create policy for authors to manage their own articles
-- CREATE POLICY "Authors can manage their own articles" ON articles
--   FOR ALL
--   TO authenticated
--   USING (author_id = auth.uid())
--   WITH CHECK (author_id = auth.uid());

-- Also ensure the profiles table has proper RLS policies
-- CREATE POLICY "Users can read all profiles" ON profiles
--   FOR SELECT
--   USING (true);

-- CREATE POLICY "Users can update their own profile" ON profiles
--   FOR UPDATE
--   TO authenticated
--   USING (id = auth.uid())
--   WITH CHECK (id = auth.uid());

-- Show current policies to verify
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'articles';

-- Show RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'articles';