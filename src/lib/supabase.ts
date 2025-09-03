import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Database {
  public: {
    Tables: {
      meetings: {
        Row: {
          id: string
          title: string
          date: string
          time: string
          type: string
          status: 'past' | 'upcoming'
          notes: string | null
          transcript: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          date: string
          time: string
          type: string
          status: 'past' | 'upcoming'
          notes?: string | null
          transcript?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          date?: string
          time?: string
          type?: string
          status?: 'past' | 'upcoming'
          notes?: string | null
          transcript?: string | null
          updated_at?: string
        }
      }
      participants: {
        Row: {
          id: string
          name: string
          email: string
          company: string | null
          website: string | null
          title: string | null
          avatar: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          company?: string | null
          website?: string | null
          title?: string | null
          avatar?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          company?: string | null
          website?: string | null
          title?: string | null
          avatar?: string | null
        }
      }
      meeting_participants: {
        Row: {
          id: string
          meeting_id: string
          participant_id: string
          created_at: string
        }
        Insert: {
          id?: string
          meeting_id: string
          participant_id: string
          created_at?: string
        }
        Update: {
          id?: string
          meeting_id?: string
          participant_id?: string
        }
      }
      meeting_tags: {
        Row: {
          id: string
          meeting_id: string
          tag: string
          created_at: string
        }
        Insert: {
          id?: string
          meeting_id: string
          tag: string
          created_at?: string
        }
        Update: {
          id?: string
          meeting_id?: string
          tag?: string
        }
      }
    }
  }
}