import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client for browser usage
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Service client for server-side operations (requires service key)
export const createServiceClient = () => {
  if (!process.env.SUPABASE_SERVICE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_KEY environment variable')
  }
  return createClient<Database>(supabaseUrl, process.env.SUPABASE_SERVICE_KEY!)
}

// Export types from database.types.ts
export type { Database, ApiError, ApiResponse, UserProfile, Meeting, Participant } from './database.types'