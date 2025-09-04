import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { getAuthenticatedUser } from '@/lib/auth-utils'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    
    if (!user?.id) {
      return NextResponse.redirect('/auth/signin')
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.APP_URL}/api/calendar/google/callback`
    )

    const scopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events'
    ]

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: user.id // Pass user ID in state parameter
    })

    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('Error initiating Google Calendar connection:', error)
    return NextResponse.redirect('/dashboard?error=calendar_connect_failed')
  }
}