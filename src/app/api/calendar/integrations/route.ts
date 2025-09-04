import { NextResponse } from 'next/server'
import { getAuthenticatedUser, getCalendarIntegrations } from '@/lib/auth-utils'

export async function GET() {
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

    const integrations = await getCalendarIntegrations(user.id)
    
    // Remove sensitive data before sending to client
    const safeIntegrations = integrations.map(integration => ({
      id: integration.id,
      provider: integration.provider,
      provider_calendar_id: integration.provider_calendar_id,
      is_primary: integration.is_primary,
      is_active: integration.is_active,
      last_sync: integration.last_sync,
      created_at: integration.created_at
    }))

    return NextResponse.json({
      success: true,
      data: safeIntegrations
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