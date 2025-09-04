import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, getUserProfile, updateUserProfile } from '@/lib/auth-utils'

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

    const result = await getUserProfile(user.id)
    
    return NextResponse.json(result, {
      status: result.success ? 200 : (result.error?.code || 500)
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

export async function PUT(request: NextRequest) {
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

    const updates = await request.json()
    
    // Validate required fields if provided
    if (updates.email && !updates.email.includes('@')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            error: 'INVALID_EMAIL',
            message: 'Please provide a valid email address',
            code: 400,
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      )
    }

    if (updates.full_name && updates.full_name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: {
            error: 'INVALID_NAME',
            message: 'Name must be at least 2 characters long',
            code: 400,
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      )
    }

    const result = await updateUserProfile(user.id, updates)
    
    return NextResponse.json(result, {
      status: result.success ? 200 : (result.error?.code || 500)
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