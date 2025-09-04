import { NextRequest, NextResponse } from 'next/server'
import { ZoomRecordingWebhook } from '@/lib/recording-service'
import crypto from 'crypto'

// Verify Zoom webhook signature
function verifyZoomWebhook(payload: string, signature: string): boolean {
  const webhookSecret = process.env.ZOOM_WEBHOOK_SECRET!
  const computedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex')
  
  return signature === `sha256=${computedSignature}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('authorization') || request.headers.get('x-zm-signature') || ''
    
    // Verify webhook signature for security
    if (!verifyZoomWebhook(body, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const data = JSON.parse(body)
    const { event, payload } = data

    console.log('Zoom webhook received:', event)

    switch (event) {
      case 'recording.completed':
        // Handle recording completion
        await ZoomRecordingWebhook.handleRecordingCompleted(payload)
        break
      
      case 'meeting.started':
        // Update meeting status to in progress
        await handleMeetingStarted(payload)
        break
      
      case 'meeting.ended':
        // Update meeting status to completed
        await handleMeetingEnded(payload)
        break
      
      case 'meeting.participant_joined':
        // Update participant status
        await handleParticipantJoined(payload)
        break
      
      case 'meeting.participant_left':
        // Update participant status
        await handleParticipantLeft(payload)
        break
      
      default:
        console.log('Unhandled Zoom webhook event:', event)
    }

    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Error handling Zoom webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleMeetingStarted(payload: any) {
  try {
    const { createServiceClient } = await import('@/lib/supabase')
    const supabase = createServiceClient()
    
    await supabase
      .from('meetings')
      .update({ 
        status: 'in_progress',
        updated_at: new Date().toISOString()
      })
      .eq('meeting_id', payload.object.id.toString())
  } catch (error) {
    console.error('Error updating meeting start status:', error)
  }
}

async function handleMeetingEnded(payload: any) {
  try {
    const { createServiceClient } = await import('@/lib/supabase')
    const supabase = createServiceClient()
    
    await supabase
      .from('meetings')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('meeting_id', payload.object.id.toString())
  } catch (error) {
    console.error('Error updating meeting end status:', error)
  }
}

async function handleParticipantJoined(payload: any) {
  try {
    const { createServiceClient } = await import('@/lib/supabase')
    const supabase = createServiceClient()
    
    const participant = payload.object.participant
    
    // Find the participant by email and update their status
    await supabase
      .from('meeting_participants')
      .update({ 
        status: 'confirmed',
        joined_at: new Date().toISOString()
      })
      .eq('meeting_id', payload.object.id.toString())
      .in('participant_id', 
        supabase
          .from('participants')
          .select('id')
          .eq('email', participant.email)
      )
  } catch (error) {
    console.error('Error updating participant join status:', error)
  }
}

async function handleParticipantLeft(payload: any) {
  try {
    const { createServiceClient } = await import('@/lib/supabase')
    const supabase = createServiceClient()
    
    const participant = payload.object.participant
    
    // Update participant left time
    await supabase
      .from('meeting_participants')
      .update({ 
        left_at: new Date().toISOString()
      })
      .eq('meeting_id', payload.object.id.toString())
      .in('participant_id', 
        supabase
          .from('participants')
          .select('id')
          .eq('email', participant.email)
      )
  } catch (error) {
    console.error('Error updating participant left status:', error)
  }
}