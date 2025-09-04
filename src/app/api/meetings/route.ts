import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, validateMeetingData } from '@/lib/auth-utils'
import { createServiceClient } from '@/lib/supabase'
import { MeetingPlatformService } from '@/lib/meeting-platforms'
import { CalendarService } from '@/lib/calendar-service'
import { ApiResponse, Meeting } from '@/lib/database.types'

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

    const supabase = createServiceClient()
    
    // Check for availability conflicts
    const startTime = new Date(start_time)
    const endTime = new Date(end_time)
    
    try {
      const busyTimes = await CalendarService.getUserAvailability(
        user.id,
        startTime,
        endTime
      )

      const hasConflict = busyTimes.some(busy => 
        (startTime >= busy.start && startTime < busy.end) ||
        (endTime > busy.start && endTime <= busy.end) ||
        (startTime <= busy.start && endTime >= busy.end)
      )

      if (hasConflict) {
        return NextResponse.json(
          {
            success: false,
            error: {
              error: 'SCHEDULING_CONFLICT',
              message: 'You have a conflict with an existing meeting at this time',
              code: 409,
              timestamp: new Date().toISOString()
            }
          },
          { status: 409 }
        )
      }
    } catch (calendarError) {
      console.warn('Could not check calendar availability:', calendarError)
      // Continue anyway - calendar integration might not be set up
    }

    // Create meeting platform session
    let meetingPlatformData
    try {
      meetingPlatformData = await MeetingPlatformService.createMeeting(
        meeting_platform,
        {
          title,
          description,
          startTime,
          endTime,
          hostEmail: user.email,
          recordingEnabled: recording_enabled
        }
      )
    } catch (platformError: any) {
      return NextResponse.json(
        {
          success: false,
          error: {
            error: 'PLATFORM_ERROR',
            message: `Failed to create ${meeting_platform} meeting: ${platformError.message}`,
            code: 500,
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      )
    }

    // Create meeting in database
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .insert({
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
        status: 'scheduled'
      })
      .select()
      .single()

    if (meetingError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            error: 'DATABASE_ERROR',
            message: meetingError.message,
            code: 500,
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      )
    }

    // Add participants
    for (const attendeeEmail of attendees) {
      try {
        // Find or create participant
        let { data: participant, error: participantError } = await supabase
          .from('participants')
          .select('id')
          .eq('email', attendeeEmail)
          .single()

        if (participantError) {
          // Create new participant
          const { data: newParticipant, error: createError } = await supabase
            .from('participants')
            .insert({
              email: attendeeEmail,
              full_name: attendeeEmail.split('@')[0], // Default name
              timezone
            })
            .select()
            .single()

          if (createError) {
            console.error('Error creating participant:', createError)
            continue
          }
          participant = newParticipant
        }

        // Add to meeting
        await supabase
          .from('meeting_participants')
          .insert({
            meeting_id: meeting.id,
            participant_id: participant.id,
            role: 'attendee',
            status: 'pending'
          })
      } catch (error) {
        console.error('Error adding participant:', attendeeEmail, error)
      }
    }

    // Create calendar events
    try {
      await CalendarService.createMeetingInCalendars(user.id, {
        title,
        description,
        startTime,
        endTime,
        attendees,
        meetingUrl: meetingPlatformData.meetingUrl
      })
    } catch (calendarError) {
      console.warn('Could not create calendar events:', calendarError)
      // Continue - meeting is still created
    }

    // TODO: Send notification emails to attendees

    return NextResponse.json({
      success: true,
      data: {
        ...meeting,
        meeting_url: meetingPlatformData.meetingUrl,
        platform_data: meetingPlatformData
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