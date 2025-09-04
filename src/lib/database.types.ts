// Database Types for PixelSync - Generated from Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          email: string
          avatar_url: string | null
          timezone: string
          preferred_meeting_platform: 'google_meet' | 'zoom' | 'teams' | 'custom'
          business_hours: Json
          buffer_time_minutes: number
          max_meeting_duration_hours: number
          allow_recording: boolean
          auto_transcribe: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          email: string
          avatar_url?: string | null
          timezone?: string
          preferred_meeting_platform?: 'google_meet' | 'zoom' | 'teams' | 'custom'
          business_hours?: Json
          buffer_time_minutes?: number
          max_meeting_duration_hours?: number
          allow_recording?: boolean
          auto_transcribe?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          email?: string
          avatar_url?: string | null
          timezone?: string
          preferred_meeting_platform?: 'google_meet' | 'zoom' | 'teams' | 'custom'
          business_hours?: Json
          buffer_time_minutes?: number
          max_meeting_duration_hours?: number
          allow_recording?: boolean
          auto_transcribe?: boolean
          is_active?: boolean
          updated_at?: string
        }
      }
      calendar_integrations: {
        Row: {
          id: string
          user_id: string
          provider: 'google' | 'outlook' | 'apple' | 'other'
          provider_calendar_id: string
          access_token: string
          refresh_token: string | null
          expires_at: string | null
          is_primary: boolean
          is_active: boolean
          last_sync: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider: 'google' | 'outlook' | 'apple' | 'other'
          provider_calendar_id: string
          access_token: string
          refresh_token?: string | null
          expires_at?: string | null
          is_primary?: boolean
          is_active?: boolean
          last_sync?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider?: 'google' | 'outlook' | 'apple' | 'other'
          provider_calendar_id?: string
          access_token?: string
          refresh_token?: string | null
          expires_at?: string | null
          is_primary?: boolean
          is_active?: boolean
          last_sync?: string | null
          updated_at?: string
        }
      }
      oauth_providers: {
        Row: {
          id: string
          user_id: string
          provider: string
          provider_user_id: string
          provider_email: string | null
          access_token: string
          refresh_token: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider: string
          provider_user_id: string
          provider_email?: string | null
          access_token: string
          refresh_token?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider?: string
          provider_user_id?: string
          provider_email?: string | null
          access_token?: string
          refresh_token?: string | null
          expires_at?: string | null
          updated_at?: string
        }
      }
      meetings: {
        Row: {
          id: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          timezone: string
          status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          meeting_platform: 'google_meet' | 'zoom' | 'teams' | 'custom'
          meeting_url: string | null
          meeting_id: string | null
          meeting_password: string | null
          host_id: string
          recording_enabled: boolean
          recording_status: 'not_recorded' | 'recording' | 'recorded' | 'processing' | 'failed'
          recording_url: string | null
          transcription_text: string | null
          summary: string | null
          google_calendar_event_id: string | null
          outlook_calendar_event_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          timezone?: string
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          meeting_platform?: 'google_meet' | 'zoom' | 'teams' | 'custom'
          meeting_url?: string | null
          meeting_id?: string | null
          meeting_password?: string | null
          host_id: string
          recording_enabled?: boolean
          recording_status?: 'not_recorded' | 'recording' | 'recorded' | 'processing' | 'failed'
          recording_url?: string | null
          transcription_text?: string | null
          summary?: string | null
          google_calendar_event_id?: string | null
          outlook_calendar_event_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          timezone?: string
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          meeting_platform?: 'google_meet' | 'zoom' | 'teams' | 'custom'
          meeting_url?: string | null
          meeting_id?: string | null
          meeting_password?: string | null
          host_id?: string
          recording_enabled?: boolean
          recording_status?: 'not_recorded' | 'recording' | 'recorded' | 'processing' | 'failed'
          recording_url?: string | null
          transcription_text?: string | null
          summary?: string | null
          google_calendar_event_id?: string | null
          outlook_calendar_event_id?: string | null
          updated_at?: string
        }
      }
      participants: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          timezone: string
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone?: string | null
          timezone?: string
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          timezone?: string
          is_verified?: boolean
          updated_at?: string
        }
      }
      meeting_participants: {
        Row: {
          id: string
          meeting_id: string
          participant_id: string
          role: 'host' | 'attendee'
          status: 'pending' | 'confirmed' | 'declined' | 'no_show'
          joined_at: string | null
          left_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          meeting_id: string
          participant_id: string
          role?: 'host' | 'attendee'
          status?: 'pending' | 'confirmed' | 'declined' | 'no_show'
          joined_at?: string | null
          left_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          meeting_id?: string
          participant_id?: string
          role?: 'host' | 'attendee'
          status?: 'pending' | 'confirmed' | 'declined' | 'no_show'
          joined_at?: string | null
          left_at?: string | null
        }
      }
      meeting_recordings: {
        Row: {
          id: string
          meeting_id: string
          file_name: string
          file_size: number | null
          duration_seconds: number | null
          storage_url: string
          download_url: string | null
          transcription_job_id: string | null
          transcription_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          meeting_id: string
          file_name: string
          file_size?: number | null
          duration_seconds?: number | null
          storage_url: string
          download_url?: string | null
          transcription_job_id?: string | null
          transcription_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          meeting_id?: string
          file_name?: string
          file_size?: number | null
          duration_seconds?: number | null
          storage_url?: string
          download_url?: string | null
          transcription_job_id?: string | null
          transcription_status?: string
          updated_at?: string
        }
      }
      availability_templates: {
        Row: {
          id: string
          user_id: string
          name: string
          timezone: string
          weekly_schedule: Json
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          timezone?: string
          weekly_schedule: Json
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          timezone?: string
          weekly_schedule?: Json
          is_default?: boolean
          updated_at?: string
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
      notifications: {
        Row: {
          id: string
          user_id: string
          meeting_id: string | null
          type: string
          title: string
          message: string
          is_read: boolean
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          meeting_id?: string | null
          type: string
          title: string
          message: string
          is_read?: boolean
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          meeting_id?: string | null
          type?: string
          title?: string
          message?: string
          is_read?: boolean
          sent_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      meeting_status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
      participant_role: 'host' | 'attendee'
      participant_status: 'pending' | 'confirmed' | 'declined' | 'no_show'
      meeting_platform: 'google_meet' | 'zoom' | 'teams' | 'custom'
      calendar_provider: 'google' | 'outlook' | 'apple' | 'other'
      recording_status: 'not_recorded' | 'recording' | 'recorded' | 'processing' | 'failed'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Specific type exports for convenience
export type UserProfile = Tables<'user_profiles'>
export type Meeting = Tables<'meetings'>
export type Participant = Tables<'participants'>
export type MeetingParticipant = Tables<'meeting_participants'>
export type CalendarIntegration = Tables<'calendar_integrations'>
export type OAuthProvider = Tables<'oauth_providers'>
export type MeetingRecording = Tables<'meeting_recordings'>
export type AvailabilityTemplate = Tables<'availability_templates'>
export type MeetingTag = Tables<'meeting_tags'>
export type Notification = Tables<'notifications'>

// API Error interface as specified in CLAUDE.md
export interface ApiError {
  error: string
  message: string
  code: number
  timestamp: string
}

// API Response interface
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
}