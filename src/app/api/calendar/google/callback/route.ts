import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { storeCalendarIntegration } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state') // This contains the user ID
    const error = searchParams.get('error')

    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.redirect('/dashboard?error=calendar_access_denied')
    }

    if (!code || !state) {
      return NextResponse.redirect('/dashboard?error=invalid_callback')
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.APP_URL}/api/calendar/google/callback`
    )

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    
    if (!tokens.access_token) {
      throw new Error('Failed to obtain access token')
    }

    // Store the integration
    const result = await storeCalendarIntegration(state, 'google', {
      provider_calendar_id: 'primary',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : undefined
    })

    if (result.success) {
      return NextResponse.redirect('/dashboard?success=google_calendar_connected')
    } else {
      return NextResponse.redirect('/dashboard?error=calendar_integration_failed')
    }
  } catch (error) {
    console.error('Error in Google Calendar callback:', error)
    return NextResponse.redirect('/dashboard?error=calendar_callback_error')
  }
}