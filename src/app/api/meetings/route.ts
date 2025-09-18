import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, validateMeetingData } from '@/lib/auth-utils'
import { createServiceClient } from '@/lib/supabase'
import { MeetingPlatformService } from '@/lib/meeting-platforms'
import { CalendarService } from '@/lib/calendar-service'
import { ApiResponse, Meeting } from '@/lib/database.types'
import { addDemoMeeting, determineStatus } from '@/lib/demo-storage'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    
    if (!user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            error: 'UNAUTHORIZED',
            message: 'User not authenticated',
            code: 401,
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = createServiceClient()
    let query = supabase
      .from('meetings')
      .select(`
        *,
        meeting_participants (
          id,
          role,
          status,
          participants (
            id,
            email,
            full_name
          )
        )
      `)
      .eq('host_id', user.id)
      .order('start_time', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            error: 'DATABASE_ERROR',
            message: error.message,
            code: 500,
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || []
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          error: 'INTERNAL_ERROR',
          message: error.message || 'An unexpected error occurred',
          code: 500,
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // For demo purposes, use a mock user (same as combined API)
    let user = await getAuthenticatedUser()

    if (!user?.id) {
      // Use demo user for development
      user = { id: 'demo-user-1', email: 'demo@example.com', name: 'Demo User' }
      console.log('Using demo user for API:', user)
    }

    const body = await request.json()
    const {
      title,
      description,
      start_time,
      end_time,
      timezone = 'UTC',
      meeting_platform = 'google_meet',
      attendees = [],
      recording_enabled = false
    } = body

    // Validate input data
    try {
      validateMeetingData({
        title,
        start_time,
        end_time
      })
    } catch (validationError: any) {
      return NextResponse.json(
        {
          success: false,
          error: {
            error: 'VALIDATION_ERROR',
            message: validationError.message,
            code: 400,
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      )
    }

    // Skip availability checking for demo
    const startTime = new Date(start_time)
    const endTime = new Date(end_time)

    console.log('Skipping availability check for demo mode')

    // For demo purposes, mock the meeting creation
    const meetingPlatformData = {
      meetingUrl: `https://meet.google.com/demo-${Date.now()}`,
      meetingId: `demo-meeting-${Date.now()}`,
      password: null
    }

    // Mock meeting data (simulate database creation)
    const meeting = {
      id: `meeting-${Date.now()}`,
      title,
      description,
      start_time,
      end_time,
      timezone,
      meeting_platform,
      meeting_url: meetingPlatformData.meetingUrl,
      meeting_id: meetingPlatformData.meetingId,
      meeting_password: meetingPlatformData.password,
      host_id: user.id,
      recording_enabled,
      status: 'scheduled',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('Created mock meeting:', meeting)

    // Mock participant creation for demo
    const participants = attendees.map((email: string) => ({
      id: `participant-${Date.now()}-${Math.random()}`,
      email,
      full_name: email.split('@')[0],
      role: 'attendee',
      status: 'pending'
    }))

    console.log('Created mock participants:', participants)

    // Skip calendar integration for demo
    console.log('Skipping calendar integration for demo mode')

    // Store in demo storage for later retrieval
    addDemoMeeting({
      ...meeting,
      attendees,
      source: 'database',
      status: determineStatus(start_time, end_time)
    })

    return NextResponse.json({
      success: true,
      data: {
        ...meeting,
        meeting_url: meetingPlatformData.meetingUrl,
        platform_data: meetingPlatformData,
        participants
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          error: 'INTERNAL_ERROR',
          message: error.message || 'An unexpected error occurred',
          code: 500,
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    )
  }
}