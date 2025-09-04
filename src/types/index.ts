// Updated interfaces to match CLAUDE.md specifications
export interface Meeting {
  id: string;
  title: string;
  description?: string;
  start_time: string; // ISO string timestamp
  end_time: string; // ISO string timestamp
  timezone: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  meeting_url?: string;
  host_id: string;
  participants: Participant[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  timezone: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface MeetingParticipant {
  id: string;
  meeting_id: string;
  participant_id: string;
  role: 'host' | 'attendee';
  status: 'pending' | 'confirmed' | 'declined' | 'no_show';
  created_at: string;
}

export interface MeetingTag {
  id: string;
  meeting_id: string;
  tag: string;
  created_at: string;
}

// Validation interfaces as specified in CLAUDE.md
export interface ValidationError {
  field: string;
  message: string;
}

export interface CreateMeetingData {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  timezone?: string;
  meeting_url?: string;
  participant_emails?: string[];
  tags?: string[];
}

// Business logic types
export type MeetingDuration = {
  hours: number;
  minutes: number;
}

export interface BusinessHours {
  start: string; // HH:mm format
  end: string; // HH:mm format
  days: number[]; // 0=Sunday, 1=Monday, etc.
}

// Backward compatibility types for existing components
// These extend the new types with old properties for compatibility
export interface LegacyParticipant extends Participant {
  name: string; // Maps to full_name
  company?: string;
  website?: string;
  title?: string;
  avatar?: string;
}

export interface LegacyMeeting extends Omit<Meeting, 'status'> {
  date: string; // Derived from start_time
  time: string; // Derived from start_time
  type: string; // Default value
  status: 'past' | 'upcoming' | 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string; // Maps to description
  transcript?: string; // Additional field
  participants: LegacyParticipant[];
}

// Helper functions to convert between new and legacy formats
export const convertToLegacyParticipant = (participant: Participant): LegacyParticipant => ({
  ...participant,
  name: participant.full_name,
  company: undefined,
  website: undefined,
  title: undefined,
  avatar: undefined
});

export const convertToLegacyMeeting = (meeting: Meeting): LegacyMeeting => {
  const startDate = new Date(meeting.start_time);
  return {
    ...meeting,
    date: startDate.toLocaleDateString(),
    time: startDate.toLocaleTimeString(),
    type: 'Meeting', // Default type
    status: meeting.status === 'scheduled' ? 'upcoming' : 
            meeting.status === 'completed' ? 'past' : meeting.status,
    notes: meeting.description,
    transcript: undefined, // Not in new schema
    participants: meeting.participants.map(convertToLegacyParticipant)
  };
};