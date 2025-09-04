import axios from 'axios'
import jwt from 'jsonwebtoken'
import { Meeting } from './database.types'

// Google Meet Service
export class GoogleMeetService {
  static async createMeeting(meetingData: {
    title: string
    startTime: Date
    endTime: Date
    description?: string
  }): Promise<{ meetingUrl: string; meetingId: string }> {
    // Google Meet meetings are created through Google Calendar
    // The meeting URL is automatically generated when creating a calendar event
    // This is a placeholder - actual implementation depends on Google Calendar integration
    
    const meetingId = `meet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const meetingUrl = `https://meet.google.com/${meetingId}`
    
    return {
      meetingUrl,
      meetingId
    }
  }

  static async updateMeeting(
    meetingId: string, 
    updates: Partial<Meeting>
  ): Promise<{ success: boolean }> {
    // Update through Google Calendar API
    return { success: true }
  }

  static async deleteMeeting(meetingId: string): Promise<{ success: boolean }> {
    // Delete through Google Calendar API
    return { success: true }
  }
}

// Zoom Service
export class ZoomService {
  private static generateJWT(): string {
    const payload = {
      iss: process.env.ZOOM_API_KEY,
      exp: Date.now() + (60 * 60 * 1000) // 1 hour
    }
    
    return jwt.sign(payload, process.env.ZOOM_API_SECRET!, { algorithm: 'HS256' })
  }

  static async createMeeting(meetingData: {
    title: string
    startTime: Date
    endTime: Date
    description?: string
    hostEmail?: string
    recordingEnabled?: boolean
  }): Promise<{ 
    meetingUrl: string
    meetingId: string
    password?: string
    joinUrl: string
  }> {
    try {
      const token = this.generateJWT()
      
      const meetingRequest = {
        topic: meetingData.title,
        type: 2, // Scheduled meeting
        start_time: meetingData.startTime.toISOString(),
        duration: Math.ceil((meetingData.endTime.getTime() - meetingData.startTime.getTime()) / (1000 * 60)), // in minutes
        timezone: 'UTC',
        agenda: meetingData.description || '',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          watermark: false,
          use_pmi: false,
          approval_type: 0,
          auto_recording: meetingData.recordingEnabled ? 'cloud' : 'none',
          enforce_login: false,
          alternative_hosts: '',
          close_registration: false,
          show_share_button: true,
          allow_multiple_devices: true,
          registrants_confirmation_email: true
        }
      }

      const response = await axios.post(
        'https://api.zoom.us/v2/users/me/meetings',
        meetingRequest,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const meeting = response.data
      
      return {
        meetingUrl: meeting.join_url,
        meetingId: meeting.id.toString(),
        password: meeting.password,
        joinUrl: meeting.join_url
      }
    } catch (error: any) {
      console.error('Error creating Zoom meeting:', error.response?.data || error.message)
      throw new Error('Failed to create Zoom meeting')
    }
  }

  static async updateMeeting(
    meetingId: string,
    updates: {
      title?: string
      startTime?: Date
      endTime?: Date
      description?: string
    }
  ): Promise<{ success: boolean }> {
    try {
      const token = this.generateJWT()
      
      const updateData: any = {}
      if (updates.title) updateData.topic = updates.title
      if (updates.startTime) updateData.start_time = updates.startTime.toISOString()
      if (updates.endTime && updates.startTime) {
        updateData.duration = Math.ceil((updates.endTime.getTime() - updates.startTime.getTime()) / (1000 * 60))
      }
      if (updates.description) updateData.agenda = updates.description

      await axios.patch(
        `https://api.zoom.us/v2/meetings/${meetingId}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return { success: true }
    } catch (error: any) {
      console.error('Error updating Zoom meeting:', error.response?.data || error.message)
      return { success: false }
    }
  }

  static async deleteMeeting(meetingId: string): Promise<{ success: boolean }> {
    try {
      const token = this.generateJWT()
      
      await axios.delete(`https://api.zoom.us/v2/meetings/${meetingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      return { success: true }
    } catch (error: any) {
      console.error('Error deleting Zoom meeting:', error.response?.data || error.message)
      return { success: false }
    }
  }

  static async getMeetingRecordings(meetingId: string): Promise<any[]> {
    try {
      const token = this.generateJWT()
      
      const response = await axios.get(
        `https://api.zoom.us/v2/meetings/${meetingId}/recordings`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      return response.data.recording_files || []
    } catch (error: any) {
      console.error('Error fetching Zoom recordings:', error.response?.data || error.message)
      return []
    }
  }

  static async downloadRecording(recordingId: string, downloadUrl: string): Promise<Buffer> {
    try {
      const token = this.generateJWT()
      
      const response = await axios.get(downloadUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'arraybuffer'
      })

      return Buffer.from(response.data)
    } catch (error: any) {
      console.error('Error downloading Zoom recording:', error.response?.data || error.message)
      throw error
    }
  }
}

// Microsoft Teams Service (placeholder for future implementation)
export class TeamsService {
  static async createMeeting(meetingData: {
    title: string
    startTime: Date
    endTime: Date
    description?: string
  }): Promise<{ meetingUrl: string; meetingId: string }> {
    // Microsoft Teams meeting creation would require Microsoft Graph API
    // This is a placeholder implementation
    
    const meetingId = `teams-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const meetingUrl = `https://teams.microsoft.com/l/meetup-join/${meetingId}`
    
    return {
      meetingUrl,
      meetingId
    }
  }
}

// Meeting Platform Factory
export class MeetingPlatformService {
  static async createMeeting(
    platform: 'google_meet' | 'zoom' | 'teams' | 'custom',
    meetingData: {
      title: string
      startTime: Date
      endTime: Date
      description?: string
      hostEmail?: string
      recordingEnabled?: boolean
    }
  ): Promise<{
    meetingUrl: string
    meetingId: string
    password?: string
    platform: string
  }> {
    switch (platform) {
      case 'google_meet':
        const googleMeeting = await GoogleMeetService.createMeeting(meetingData)
        return {
          ...googleMeeting,
          platform: 'google_meet'
        }
      
      case 'zoom':
        const zoomMeeting = await ZoomService.createMeeting(meetingData)
        return {
          ...zoomMeeting,
          platform: 'zoom'
        }
      
      case 'teams':
        const teamsMeeting = await TeamsService.createMeeting(meetingData)
        return {
          ...teamsMeeting,
          platform: 'teams'
        }
      
      case 'custom':
      default:
        // For custom meetings, generate a placeholder URL
        return {
          meetingUrl: meetingData.description || 'Custom meeting location will be provided',
          meetingId: `custom-${Date.now()}`,
          platform: 'custom'
        }
    }
  }

  static async updateMeeting(
    platform: string,
    meetingId: string,
    updates: any
  ): Promise<{ success: boolean }> {
    switch (platform) {
      case 'google_meet':
        return await GoogleMeetService.updateMeeting(meetingId, updates)
      
      case 'zoom':
        return await ZoomService.updateMeeting(meetingId, updates)
      
      default:
        return { success: true }
    }
  }

  static async deleteMeeting(
    platform: string,
    meetingId: string
  ): Promise<{ success: boolean }> {
    switch (platform) {
      case 'google_meet':
        return await GoogleMeetService.deleteMeeting(meetingId)
      
      case 'zoom':
        return await ZoomService.deleteMeeting(meetingId)
      
      default:
        return { success: true }
    }
  }
}