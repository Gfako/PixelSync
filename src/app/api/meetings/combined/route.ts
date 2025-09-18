import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config-simple'
import { createServiceClient } from '@/lib/supabase'
import { CalendarService } from '@/lib/calendar-service'
import { Meeting } from '@/lib/database.types'
import { getDemoMeetings } from '@/lib/demo-storage'

export async function GET(request: NextRequest) {
  try {
    // For demo purposes, use a mock user - in production this should be properly authenticated
    const user = { id: 'demo-user-1', email: 'demo@example.com', name: 'Demo User' }
    console.log('Using demo user for API:', user)

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get date range (default to 3 months back and 6 months forward)
    const now = new Date()
    const startDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000)) // 3 months ago
    const endDate = new Date(now.getTime() + (180 * 24 * 60 * 60 * 1000)) // 6 months from now

    const supabase = createServiceClient()

    // Get newly created demo meetings
    const demoMeetings = getDemoMeetings()

    // For demo purposes, return mock data plus any newly created meetings
    const dbMeetings = [
      {
        id: 'meeting-1',
        title: 'Team Standup',
        description: 'Daily team standup meeting',
        start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        end_time: new Date(Date.now() + 86400000 + 1800000).toISOString(), // Tomorrow + 30 min
        timezone: 'UTC',
        meeting_platform: 'google_meet',
        meeting_url: 'https://meet.google.com/abc-def-ghi',
        host_id: user.id,
        status: 'scheduled',
        source: 'database',
        meeting_participants: []
      },
      {
        id: 'meeting-2',
        title: 'Project Review',
        description: 'Weekly project review meeting',
        start_time: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        end_time: new Date(Date.now() - 86400000 + 3600000).toISOString(), // Yesterday + 1 hour
        timezone: 'UTC',
        meeting_platform: 'zoom',
        meeting_url: 'https://zoom.us/j/123456789',
        host_id: user.id,
        status: 'completed',
        source: 'database',
        meeting_participants: []
      },
      // Add newly created demo meetings
      ...demoMeetings.map(meeting => ({
        ...meeting,
        meeting_participants: []
      }))
    ]

    // Mock calendar events (simulating Google Calendar events)
    const calendarEvents = [
      {
        id: 'cal-event-1',
        title: 'Client Meeting',
        description: 'Meeting with important client',
        start_time: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
        end_time: new Date(Date.now() + 172800000 + 3600000).toISOString(), // Day after tomorrow + 1 hour
        attendees: ['client@example.com'],
        htmlLink: 'https://calendar.google.com/event?eid=example',
        provider: 'google'
      },
      {
        id: 'cal-event-2',
        title: 'Conference Call',
        description: 'Quarterly all-hands meeting',
        start_time: new Date(Date.now() - 172800000).toISOString(), // Day before yesterday
        end_time: new Date(Date.now() - 172800000 + 7200000).toISOString(), // Day before yesterday + 2 hours
        attendees: ['team@example.com'],
        htmlLink: 'https://calendar.google.com/event?eid=example2',
        provider: 'google'
      }
    ]

    // Convert calendar events to meeting format
    const formattedCalendarEvents = calendarEvents.map(event => ({
      id: `calendar_${event.provider}_${event.id}`,
      title: event.title,
      description: event.description || '',
      start_time: event.start_time,
      end_time: event.end_time,
      timezone: 'UTC', // Calendar events should already be in UTC
      meeting_platform: event.provider === 'google' ? 'google_meet' : 'teams',
      meeting_url: event.htmlLink || event.webLink || '',
      meeting_id: event.id,
      host_id: user.id,
      status: determineEventStatus(new Date(event.start_time), new Date(event.end_time)),
      source: 'calendar',
      provider: event.provider,
      attendees: event.attendees || [],
      location: event.location || '',
      created_at: event.created || new Date().toISOString(),
      updated_at: event.updated || new Date().toISOString(),
      meeting_participants: []
    }))

    // Combine and deduplicate meetings
    const allMeetings = [
      ...(dbMeetings || []).map(meeting => ({
        ...meeting,
        source: 'database'
      })),
      ...formattedCalendarEvents
    ]

    // Remove duplicates (meetings that exist in both DB and calendar)
    const uniqueMeetings = removeDuplicateMeetings(allMeetings)

    // Sort by start time (newest first)
    uniqueMeetings.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())

    // Apply pagination
    const paginatedMeetings = uniqueMeetings.slice(offset, offset + limit)

    // Separate into past and upcoming
    const pastMeetings = paginatedMeetings.filter(m =>
      m.status === 'completed' || new Date(m.end_time) < now
    )
    const upcomingMeetings = paginatedMeetings.filter(m =>
      m.status === 'scheduled' || new Date(m.start_time) > now
    )

    return NextResponse.json({
      success: true,
      data: {
        all: paginatedMeetings,
        past: pastMeetings,
        upcoming: upcomingMeetings,
        total: uniqueMeetings.length,
        dbCount: dbMeetings.length || 0,
        calendarCount: calendarEvents.length
      }
    })
  } catch (error: any) {
    console.error('Combined meetings API error:', error)
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

function determineEventStatus(startTime: Date, endTime: Date): string {
  const now = new Date()

  if (endTime < now) {
    return 'completed'
  } else if (startTime > now) {
    return 'scheduled'
  } else {
    return 'in_progress'
  }
}

function removeDuplicateMeetings(meetings: any[]): any[] {
  const seen = new Map()
  const result: any[] = []

  for (const meeting of meetings) {
    // Create a key for deduplication based on title, start time, and duration
    const startTime = new Date(meeting.start_time).getTime()
    const endTime = new Date(meeting.end_time).getTime()
    const duration = endTime - startTime
    const key = `${meeting.title.toLowerCase().trim()}_${startTime}_${duration}`

    if (seen.has(key)) {
      // Prefer database meetings over calendar events
      const existing = seen.get(key)
      if (existing.source === 'calendar' && meeting.source === 'database') {
        seen.set(key, meeting)
        // Replace in result array
        const index = result.findIndex(m => m === existing)
        if (index >= 0) {
          result[index] = meeting
        }
      }
    } else {
      seen.set(key, meeting)
      result.push(meeting)
    }
  }

  return result
}