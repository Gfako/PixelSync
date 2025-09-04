import { getServerSession } from 'next-auth'
import { authOptions } from './auth-config-simple'
import { supabase, createServiceClient } from './supabase'
import { UserProfile, ApiResponse, ApiError } from './database.types'
import CryptoJS from 'crypto-js'

// Encryption utilities for sensitive data
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'fallback-key-change-in-production'

export const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString()
}

export const decrypt = (encryptedText: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

// Server-side authentication utilities
export const getAuthenticatedUser = async () => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return null
    }
    return session.user
  } catch (error) {
    console.error('Error getting authenticated user:', error)
    return null
  }
}

export const getUserProfile = async (userId: string): Promise<ApiResponse<UserProfile>> => {
  try {
    const serviceClient = createServiceClient()
    
    const { data, error } = await serviceClient
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      return {
        success: false,
        error: {
          error: 'USER_PROFILE_NOT_FOUND',
          message: 'User profile not found',
          code: 404,
          timestamp: new Date().toISOString()
        }
      }
    }

    return {
      success: true,
      data
    }
  } catch (error: any) {
    return {
      success: false,
      error: {
        error: 'INTERNAL_ERROR',
        message: error.message || 'An unexpected error occurred',
        code: 500,
        timestamp: new Date().toISOString()
      }
    }
  }
}

export const updateUserProfile = async (
  userId: string, 
  updates: Partial<UserProfile>
): Promise<ApiResponse<UserProfile>> => {
  try {
    const serviceClient = createServiceClient()
    
    // Remove fields that shouldn't be updated directly
    const { id, user_id, created_at, updated_at, ...safeUpdates } = updates as any
    
    const { data, error } = await serviceClient
      .from('user_profiles')
      .update({
        ...safeUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: {
          error: 'UPDATE_FAILED',
          message: error.message,
          code: 400,
          timestamp: new Date().toISOString()
        }
      }
    }

    return {
      success: true,
      data
    }
  } catch (error: any) {
    return {
      success: false,
      error: {
        error: 'INTERNAL_ERROR',
        message: error.message || 'An unexpected error occurred',
        code: 500,
        timestamp: new Date().toISOString()
      }
    }
  }
}

// Calendar integration utilities
export const getCalendarIntegrations = async (userId: string) => {
  try {
    const serviceClient = createServiceClient()
    
    const { data, error } = await serviceClient
      .from('calendar_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)

    if (error) throw error

    // Decrypt access tokens for use
    return data?.map(integration => ({
      ...integration,
      access_token: decrypt(integration.access_token),
      refresh_token: integration.refresh_token ? decrypt(integration.refresh_token) : null
    })) || []
  } catch (error) {
    console.error('Error fetching calendar integrations:', error)
    return []
  }
}

export const storeCalendarIntegration = async (
  userId: string,
  provider: 'google' | 'outlook' | 'apple' | 'other',
  integrationData: {
    provider_calendar_id: string
    access_token: string
    refresh_token?: string
    expires_at?: string
  }
) => {
  try {
    const serviceClient = createServiceClient()
    
    const { error } = await serviceClient
      .from('calendar_integrations')
      .upsert({
        user_id: userId,
        provider,
        provider_calendar_id: integrationData.provider_calendar_id,
        access_token: encrypt(integrationData.access_token),
        refresh_token: integrationData.refresh_token ? encrypt(integrationData.refresh_token) : null,
        expires_at: integrationData.expires_at,
        is_active: true
      }, {
        onConflict: 'user_id,provider,provider_calendar_id'
      })

    if (error) throw error
    
    return { success: true }
  } catch (error: any) {
    console.error('Error storing calendar integration:', error)
    return { 
      success: false, 
      error: error.message 
    }
  }
}

// OAuth provider utilities
export const getOAuthProvider = async (userId: string, provider: string) => {
  try {
    const serviceClient = createServiceClient()
    
    const { data, error } = await serviceClient
      .from('oauth_providers')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', provider)
      .single()

    if (error) throw error

    return data ? {
      ...data,
      access_token: decrypt(data.access_token),
      refresh_token: data.refresh_token ? decrypt(data.refresh_token) : null
    } : null
  } catch (error) {
    console.error('Error fetching OAuth provider:', error)
    return null
  }
}

// Validation utilities
export const validateMeetingData = (data: any) => {
  const errors: string[] = []
  
  if (!data.title || data.title.length < 3) {
    errors.push('Title must be at least 3 characters')
  }
  
  if (!data.start_time || !data.end_time) {
    errors.push('Start and end times are required')
  }
  
  if (new Date(data.start_time) >= new Date(data.end_time)) {
    errors.push('End time must be after start time')
  }
  
  // Check if start time is in the past
  if (new Date(data.start_time) < new Date()) {
    errors.push('Meeting cannot be scheduled in the past')
  }
  
  // Check duration limits
  const durationHours = (new Date(data.end_time).getTime() - new Date(data.start_time).getTime()) / (1000 * 60 * 60)
  if (durationHours > 8) {
    errors.push('Meeting duration cannot exceed 8 hours')
  }
  
  if (errors.length > 0) {
    throw new Error(errors.join(', '))
  }
}

// Business hours validation
export const isWithinBusinessHours = (
  dateTime: Date, 
  businessHours: any, 
  timezone: string = 'UTC'
): boolean => {
  try {
    // Convert datetime to user's timezone
    const dayOfWeek = dateTime.toLocaleDateString('en-US', { 
      weekday: 'lowercase', 
      timeZone: timezone 
    }) as keyof typeof businessHours
    
    const timeStr = dateTime.toLocaleTimeString('en-US', { 
      hour12: false, 
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit'
    })
    
    if (!businessHours[dayOfWeek]) {
      return false // Day not configured for work
    }
    
    const { start, end } = businessHours[dayOfWeek]
    return timeStr >= start && timeStr <= end
  } catch (error) {
    console.error('Error checking business hours:', error)
    return true // Default to allowing if validation fails
  }
}