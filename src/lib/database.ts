import { supabase } from './supabase'
import { Meeting, Participant } from '@/types'

// Meeting Operations
export async function getMeetings(): Promise<Meeting[]> {
  const { data: meetings, error } = await supabase
    .from('meetings')
    .select(`
      *,
      meeting_participants(
        participants(*)
      ),
      meeting_tags(tag)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching meetings:', error)
    return []
  }

  return meetings?.map(meeting => ({
    id: meeting.id,
    title: meeting.title,
    date: meeting.date,
    time: meeting.time,
    type: meeting.type,
    status: meeting.status,
    notes: meeting.notes,
    transcript: meeting.transcript,
    participants: meeting.meeting_participants?.map((mp: any) => mp.participants) || [],
    tags: meeting.meeting_tags?.map((mt: any) => mt.tag) || []
  })) || []
}

export async function createMeeting(meeting: Omit<Meeting, 'id'>): Promise<Meeting | null> {
  const { data: newMeeting, error } = await supabase
    .from('meetings')
    .insert({
      title: meeting.title,
      date: meeting.date,
      time: meeting.time,
      type: meeting.type,
      status: meeting.status,
      notes: meeting.notes,
      transcript: meeting.transcript
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating meeting:', error)
    return null
  }

  // Add participants
  if (meeting.participants.length > 0) {
    await addParticipantsToMeeting(newMeeting.id, meeting.participants)
  }

  // Add tags
  if (meeting.tags.length > 0) {
    await addTagsToMeeting(newMeeting.id, meeting.tags)
  }

  return {
    ...newMeeting,
    participants: meeting.participants,
    tags: meeting.tags
  }
}

export async function updateMeeting(id: string, updates: Partial<Meeting>): Promise<boolean> {
  const { error } = await supabase
    .from('meetings')
    .update({
      title: updates.title,
      date: updates.date,
      time: updates.time,
      type: updates.type,
      status: updates.status,
      notes: updates.notes,
      transcript: updates.transcript,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating meeting:', error)
    return false
  }

  return true
}

// Participant Operations
export async function createParticipant(participant: Omit<Participant, 'id'>): Promise<Participant | null> {
  const { data, error } = await supabase
    .from('participants')
    .insert(participant)
    .select()
    .single()

  if (error) {
    console.error('Error creating participant:', error)
    return null
  }

  return data
}

export async function getOrCreateParticipant(participant: Omit<Participant, 'id'>): Promise<Participant | null> {
  // First, try to find existing participant by email
  const { data: existing } = await supabase
    .from('participants')
    .select('*')
    .eq('email', participant.email)
    .single()

  if (existing) {
    return existing
  }

  // If not found, create new participant
  return await createParticipant(participant)
}

// Helper functions
async function addParticipantsToMeeting(meetingId: string, participants: Participant[]) {
  for (const participant of participants) {
    const existingParticipant = await getOrCreateParticipant(participant)
    if (existingParticipant) {
      await supabase
        .from('meeting_participants')
        .insert({
          meeting_id: meetingId,
          participant_id: existingParticipant.id
        })
    }
  }
}

async function addTagsToMeeting(meetingId: string, tags: string[]) {
  const tagInserts = tags.map(tag => ({
    meeting_id: meetingId,
    tag: tag
  }))

  await supabase
    .from('meeting_tags')
    .insert(tagInserts)
}