// Simple in-memory storage for demo meetings
// This simulates a database for demo purposes

interface DemoMeeting {
  id: string
  title: string
  description: string
  start_time: string
  end_time: string
  timezone: string
  meeting_platform: string
  meeting_url: string
  meeting_id: string
  host_id: string
  recording_enabled: boolean
  status: string
  created_at: string
  updated_at: string
  attendees: string[]
  source: 'database'
}

// In-memory storage
let demoMeetings: DemoMeeting[] = []

export const addDemoMeeting = (meeting: DemoMeeting): void => {
  demoMeetings.push(meeting)
  console.log('Added demo meeting to storage:', meeting.title)
  console.log('Total demo meetings:', demoMeetings.length)
}

export const getDemoMeetings = (): DemoMeeting[] => {
  return [...demoMeetings]
}

export const clearDemoMeetings = (): void => {
  demoMeetings = []
  console.log('Cleared all demo meetings')
}

// Utility to determine meeting status based on time
export const determineStatus = (startTime: string, endTime: string): string => {
  const now = new Date()
  const start = new Date(startTime)
  const end = new Date(endTime)

  if (now < start) {
    return 'scheduled'
  } else if (now >= start && now <= end) {
    return 'in_progress'
  } else {
    return 'completed'
  }
}