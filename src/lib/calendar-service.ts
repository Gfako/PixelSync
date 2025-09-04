import { google } from 'googleapis'
import { Client } from '@microsoft/microsoft-graph-client'
import { getCalendarIntegrations, getOAuthProvider } from './auth-utils'

// Google Calendar Service
export class GoogleCalendarService {
  private oauth2Client: any

  constructor(accessToken: string, refreshToken?: string) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.APP_URL}/api/calendar/google/callback`
    )

    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    })
  }

  async getAvailability(startTime: Date, endTime: Date) {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
      
      const response = await calendar.freebusy.query({
        requestBody: {
          timeMin: startTime.toISOString(),
          timeMax: endTime.toISOString(),
          items: [{ id: 'primary' }]
        }
      })

      const busyTimes = response.data.calendars?.primary?.busy || []
      return busyTimes.map((slot: any) => ({
        start: new Date(slot.start),
        end: new Date(slot.end)
      }))
    } catch (error) {
      console.error('Error fetching Google Calendar availability:', error)
      throw error
    }
  }

  async createEvent(eventData: {
    title: string
    description?: string
    startTime: Date
    endTime: Date
    attendees?: string[]
    meetingUrl?: string
  }) {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
      
      const event = {
        summary: eventData.title,
        description: eventData.description,
        start: {
          dateTime: eventData.startTime.toISOString(),
          timeZone: 'UTC'
        },
        end: {
          dateTime: eventData.endTime.toISOString(),
          timeZone: 'UTC'
        },
        attendees: eventData.attendees?.map(email => ({ email })),
        location: eventData.meetingUrl,
        conferenceData: eventData.meetingUrl?.includes('meet.google.com') ? {
          createRequest: {
            requestId: Math.random().toString(36).substring(2, 15),
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        } : undefined
      }

      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        conferenceDataVersion: 1
      })

      return {
        id: response.data.id,
        htmlLink: response.data.htmlLink,
        hangoutLink: response.data.hangoutLink
      }
    } catch (error) {
      console.error('Error creating Google Calendar event:', error)
      throw error
    }
  }

  async updateEvent(eventId: string, eventData: any) {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
      
      const response = await calendar.events.patch({
        calendarId: 'primary',
        eventId,
        requestBody: eventData
      })

      return response.data
    } catch (error) {
      console.error('Error updating Google Calendar event:', error)
      throw error
    }
  }

  async deleteEvent(eventId: string) {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
      
      await calendar.events.delete({
        calendarId: 'primary',
        eventId
      })
    } catch (error) {
      console.error('Error deleting Google Calendar event:', error)
      throw error
    }
  }
}

// Microsoft Graph/Outlook Calendar Service
export class OutlookCalendarService {
  private client: Client

  constructor(accessToken: string) {
    this.client = Client.init({
      authProvider: (done) => {
        done(null, accessToken)
      }
    })
  }

  async getAvailability(startTime: Date, endTime: Date) {
    try {
      const response = await this.client
        .api('/me/calendar/getSchedule')
        .post({
          schedules: ['me'],
          startTime: {
            dateTime: startTime.toISOString(),
            timeZone: 'UTC'
          },
          endTime: {
            dateTime: endTime.toISOString(),
            timeZone: 'UTC'
          }
        })

      const busyTimes = response.value?.[0]?.busyViewEntries || []
      return busyTimes
        .filter((entry: any) => entry.status === 'busy')
        .map((entry: any) => ({
          start: new Date(entry.start.dateTime),
          end: new Date(entry.end.dateTime)
        }))
    } catch (error) {
      console.error('Error fetching Outlook Calendar availability:', error)
      throw error
    }
  }

  async createEvent(eventData: {
    title: string
    description?: string
    startTime: Date
    endTime: Date
    attendees?: string[]
    meetingUrl?: string
  }) {
    try {
      const event = {
        subject: eventData.title,
        body: {
          contentType: 'text',
          content: eventData.description || ''
        },
        start: {
          dateTime: eventData.startTime.toISOString(),
          timeZone: 'UTC'
        },
        end: {
          dateTime: eventData.endTime.toISOString(),
          timeZone: 'UTC'
        },
        attendees: eventData.attendees?.map(email => ({
          emailAddress: {
            address: email,
            name: email.split('@')[0]
          }
        })),
        location: eventData.meetingUrl ? {
          displayName: 'Online Meeting',
          locationUri: eventData.meetingUrl
        } : undefined,
        isOnlineMeeting: !!eventData.meetingUrl,
        onlineMeetingProvider: eventData.meetingUrl?.includes('teams.microsoft.com') ? 'teamsForBusiness' : undefined
      }

      const response = await this.client
        .api('/me/events')
        .post(event)

      return {
        id: response.id,
        webLink: response.webLink,
        onlineMeeting: response.onlineMeeting
      }
    } catch (error) {
      console.error('Error creating Outlook Calendar event:', error)
      throw error
    }
  }

  async updateEvent(eventId: string, eventData: any) {
    try {
      const response = await this.client
        .api(`/me/events/${eventId}`)
        .patch(eventData)

      return response
    } catch (error) {
      console.error('Error updating Outlook Calendar event:', error)
      throw error
    }
  }

  async deleteEvent(eventId: string) {
    try {
      await this.client
        .api(`/me/events/${eventId}`)
        .delete()
    } catch (error) {
      console.error('Error deleting Outlook Calendar event:', error)
      throw error
    }
  }
}

// Calendar Service Factory
export class CalendarService {
  static async getUserAvailability(
    userId: string, 
    startTime: Date, 
    endTime: Date
  ): Promise<{ start: Date; end: Date }[]> {
    const integrations = await getCalendarIntegrations(userId)
    const allBusyTimes: { start: Date; end: Date }[] = []

    for (const integration of integrations) {
      try {
        if (integration.provider === 'google') {
          const googleService = new GoogleCalendarService(
            integration.access_token,
            integration.refresh_token
          )
          const busyTimes = await googleService.getAvailability(startTime, endTime)
          allBusyTimes.push(...busyTimes)
        } else if (integration.provider === 'outlook') {
          const outlookService = new OutlookCalendarService(integration.access_token)
          const busyTimes = await outlookService.getAvailability(startTime, endTime)
          allBusyTimes.push(...busyTimes)
        }
      } catch (error) {
        console.error(`Error fetching availability from ${integration.provider}:`, error)
        // Continue with other integrations
      }
    }

    // Merge overlapping time slots
    return this.mergeTimeSlots(allBusyTimes)
  }

  static async createMeetingInCalendars(
    userId: string,
    eventData: {
      title: string
      description?: string
      startTime: Date
      endTime: Date
      attendees?: string[]
      meetingUrl?: string
    }
  ) {
    const integrations = await getCalendarIntegrations(userId)
    const createdEvents: any[] = []

    for (const integration of integrations) {
      try {
        if (integration.provider === 'google') {
          const googleService = new GoogleCalendarService(
            integration.access_token,
            integration.refresh_token
          )
          const event = await googleService.createEvent(eventData)
          createdEvents.push({
            provider: 'google',
            eventId: event.id,
            link: event.htmlLink
          })
        } else if (integration.provider === 'outlook') {
          const outlookService = new OutlookCalendarService(integration.access_token)
          const event = await outlookService.createEvent(eventData)
          createdEvents.push({
            provider: 'outlook',
            eventId: event.id,
            link: event.webLink
          })
        }
      } catch (error) {
        console.error(`Error creating event in ${integration.provider}:`, error)
      }
    }

    return createdEvents
  }

  private static mergeTimeSlots(slots: { start: Date; end: Date }[]): { start: Date; end: Date }[] {
    if (slots.length === 0) return []

    // Sort by start time
    const sorted = slots.sort((a, b) => a.start.getTime() - b.start.getTime())
    const merged: { start: Date; end: Date }[] = [sorted[0]]

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i]
      const last = merged[merged.length - 1]

      if (current.start <= last.end) {
        // Overlapping or adjacent, merge
        last.end = new Date(Math.max(last.end.getTime(), current.end.getTime()))
      } else {
        // No overlap, add new slot
        merged.push(current)
      }
    }

    return merged
  }

  static findAvailableSlots(
    busyTimes: { start: Date; end: Date }[],
    requestedStart: Date,
    requestedEnd: Date,
    duration: number // in minutes
  ): { start: Date; end: Date }[] {
    const availableSlots: { start: Date; end: Date }[] = []
    const durationMs = duration * 60 * 1000

    let currentTime = new Date(requestedStart)
    
    for (const busySlot of busyTimes) {
      // If there's a gap between currentTime and the next busy slot
      if (currentTime < busySlot.start && (busySlot.start.getTime() - currentTime.getTime()) >= durationMs) {
        availableSlots.push({
          start: new Date(currentTime),
          end: new Date(busySlot.start)
        })
      }
      currentTime = new Date(Math.max(currentTime.getTime(), busySlot.end.getTime()))
    }

    // Check if there's time after the last busy slot
    if (currentTime < requestedEnd && (requestedEnd.getTime() - currentTime.getTime()) >= durationMs) {
      availableSlots.push({
        start: new Date(currentTime),
        end: new Date(requestedEnd)
      })
    }

    return availableSlots
  }
}