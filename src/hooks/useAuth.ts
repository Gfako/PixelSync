'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { UserProfile, ApiResponse } from '@/lib/database.types'

export const useAuth = () => {
  const { data: session, status } = useSession()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create a basic user profile from session data
  useEffect(() => {
    if (session?.user) {
      const basicProfile: UserProfile = {
        id: session.user.id as string,
        user_id: session.user.id as string,
        email: session.user.email || '',
        full_name: session.user.name || '',
        avatar_url: null,
        timezone: 'UTC',
        preferred_meeting_platform: 'google_meet',
        business_hours: {},
        buffer_time_minutes: 15,
        max_meeting_duration_hours: 4,
        allow_recording: true,
        auto_transcribe: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setUserProfile(basicProfile)
    } else {
      setUserProfile(null)
    }
  }, [session])

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!session?.user?.id) return false

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })

      const result: ApiResponse<UserProfile> = await response.json()
      
      if (result.success) {
        setUserProfile(result.data!)
        return true
      } else {
        setError(result.error?.message || 'Failed to update profile')
        return false
      }
    } catch (err) {
      setError('Network error while updating profile')
      return false
    }
  }

  const googleSignIn = () => signIn('google', { callbackUrl: '/' })
  const linkedinSignIn = () => signIn('linkedin', { callbackUrl: '/' })
  
  const handleSignOut = async () => {
    console.log('useAuth signOut triggered')
    try {
      await signOut({ callbackUrl: '/auth/signin', redirect: true })
      console.log('Sign out completed successfully')
    } catch (error) {
      console.error('Sign out failed:', error)
      // Force redirect if signOut fails
      window.location.href = '/auth/signin'
    }
  }

  return {
    session,
    userProfile,
    loading,
    error,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    updateProfile,
    signIn: {
      google: googleSignIn,
      linkedin: linkedinSignIn
    },
    signOut: handleSignOut,
    clearError: () => setError(null)
  }
}

export const useCalendarIntegrations = () => {
  const { session } = useSession()
  const [integrations, setIntegrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIntegrations = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/calendar/integrations')
          const result = await response.json()
          
          if (result.success) {
            setIntegrations(result.data || [])
          }
        } catch (err) {
          console.error('Error fetching calendar integrations:', err)
        }
      }
      setLoading(false)
    }

    fetchIntegrations()
  }, [session])

  const connectGoogle = async () => {
    try {
      // Trigger Google OAuth flow for calendar access
      window.location.href = '/api/calendar/google/connect'
    } catch (err) {
      console.error('Error connecting Google Calendar:', err)
    }
  }

  const connectOutlook = async () => {
    try {
      // Trigger Microsoft OAuth flow for calendar access
      window.location.href = '/api/calendar/outlook/connect'
    } catch (err) {
      console.error('Error connecting Outlook Calendar:', err)
    }
  }

  const disconnectIntegration = async (integrationId: string) => {
    try {
      const response = await fetch(`/api/calendar/integrations/${integrationId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setIntegrations(prev => prev.filter(int => int.id !== integrationId))
      }
    } catch (err) {
      console.error('Error disconnecting integration:', err)
    }
  }

  return {
    integrations,
    loading,
    connectGoogle,
    connectOutlook,
    disconnectIntegration,
    hasGoogleCalendar: integrations.some(int => int.provider === 'google' && int.is_active),
    hasOutlookCalendar: integrations.some(int => int.provider === 'outlook' && int.is_active)
  }
}