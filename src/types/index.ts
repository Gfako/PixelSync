// Updated interfaces to match CLAUDE.md specifications
// Includes template customization types for saving design settings
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

// Template Customization Types
export interface CustomTextComponent {
  id: string;
  text: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  alignment: 'left' | 'center' | 'right';
}

export interface AccordionComponent {
  id: string;
  title: string;
  content: string;
  isExpanded: boolean;
}

export interface TemplateCustomization {
  id: string;
  template_id: string;
  user_id: string;
  
  // Basic template info
  template_name?: string;
  event_title: string;
  description: string;
  duration_minutes: number;
  timezone: string;
  
  // Design settings - Colors
  page_background_color: string;
  background_color: string;
  calendar_background_color: string;
  time_slot_button_color: string;
  primary_color: string;
  text_color: string;
  calendar_text_color: string;
  
  // Design settings - Typography
  font_family: string;
  font_weight: string;
  
  // Design settings - Border radius
  border_radius: string;
  calendar_border_radius: string;
  button_border_radius: string;
  
  // Media settings
  show_avatar: boolean;
  avatar_url?: string;
  show_cover_photo: boolean;
  cover_photo?: string;
  
  // Custom components
  custom_text_components: CustomTextComponent[];
  accordion_components: AccordionComponent[];
  
  // Metadata
  created_at: string;
  updated_at: string;
}

// Interface for creating/updating template customizations
export interface TemplateCustomizationData {
  template_id: string;
  template_name?: string;
  event_title?: string;
  description?: string;
  duration_minutes?: number;
  timezone?: string;
  
  // Design settings - Colors
  page_background_color?: string;
  background_color?: string;
  calendar_background_color?: string;
  time_slot_button_color?: string;
  primary_color?: string;
  text_color?: string;
  calendar_text_color?: string;
  
  // Design settings - Typography
  font_family?: string;
  font_weight?: string;
  
  // Design settings - Border radius
  border_radius?: string;
  calendar_border_radius?: string;
  button_border_radius?: string;
  
  // Media settings
  show_avatar?: boolean;
  avatar_url?: string;
  show_cover_photo?: boolean;
  cover_photo?: string;
  
  // Custom components
  custom_text_components?: CustomTextComponent[];
  accordion_components?: AccordionComponent[];
}

// Default template customization values
export const DEFAULT_TEMPLATE_CUSTOMIZATION: Omit<TemplateCustomization, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  template_id: '1',
  event_title: 'Event title',
  description: 'Web conferencing details provided upon confirmation.',
  duration_minutes: 30,
  timezone: 'America/New_York',
  
  // Design settings - Colors
  page_background_color: '#f8fafc',
  background_color: '#ffffff',
  calendar_background_color: '#ffffff',
  time_slot_button_color: '#ffffff',
  primary_color: '#3b82f6',
  text_color: '#1e293b',
  calendar_text_color: '#1e293b',
  
  // Design settings - Typography
  font_family: 'font-montserrat',
  font_weight: '400',
  
  // Design settings - Border radius
  border_radius: '8px',
  calendar_border_radius: '8px',
  button_border_radius: '8px',
  
  // Media settings
  show_avatar: true,
  show_cover_photo: false,
  
  // Custom components
  custom_text_components: [],
  accordion_components: []
};