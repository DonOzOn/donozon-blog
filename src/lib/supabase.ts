import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Public client for read operations (articles, categories, etc.)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Admin client for server-side operations (only available when service role key is set)
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Debug logging for development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Supabase Client Configuration:')
  console.log('  NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set ✅' : 'Missing ❌')
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set ✅' : 'Missing ❌')
  console.log('  SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? 'Set ✅' : 'Missing ❌')
  console.log('  Admin client available:', supabaseAdmin ? 'Yes ✅' : 'No (using API routes) ❌')
}

// Export for server-side usage (if needed)
export const createServerSupabaseClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// NOTE: Admin operations are now handled via API routes (/api/admin/*)
// This ensures service role key stays server-side only for security