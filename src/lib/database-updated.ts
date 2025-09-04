import { supabase, ApiResponse, ApiError } from './supabase'
import { Meeting, Participant, CreateMeetingData, ValidationError } from '@/types'

// Logger utility as specified in CLAUDE.md
const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      meta,
      timestamp: new Date().toISOString()
    }));
  },
  error: (message: string, error: Error, meta?: any) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error.message,
      stack: error.stack,
      meta,
      timestamp: new Date().toISOString()
    }));
  }
};

// Input validation as specified in CLAUDE.md
const validateMeetingData = (data: CreateMeetingData): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!data.title || data.title.length < 3) {
    errors.push({ field: 'title', message: 'Title must be at least 3 characters' });
  }
  
  if (data.title && data.title.length > 255) {
    errors.push({ field: 'title', message: 'Title must be less than 255 characters' });
  }
  
  if (!data.start_time || !data.end_time) {
    errors.push({ field: 'time', message: 'Start and end times are required' });
  }
  
  if (data.start_time && data.end_time) {
    const startTime = new Date(data.start_time);
    const endTime = new Date(data.end_time);
    
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      errors.push({ field: 'time', message: 'Invalid date format' });
    } else {
      if (startTime >= endTime) {
        errors.push({ field: 'time', message: 'End time must be after start time' });
      }
      
      // Check minimum duration (15 minutes)
      const duration = endTime.getTime() - startTime.getTime();
      const minDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
      if (duration < minDuration) {
        errors.push({ field: 'time', message: 'Meeting duration must be at least 15 minutes' });
      }
      
      // Check maximum duration (4 hours)
      const maxDuration = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
      if (duration > maxDuration) {
        errors.push({ field: 'time', message: 'Meeting duration cannot exceed 4 hours' });
      }
      
      // Check if meeting is in the past
      const now = new Date();
      if (startTime <= now) {
        errors.push({ field: 'time', message: 'Meeting cannot be scheduled in the past' });
      }
    }
  }
  
  // Validate participant emails
  if (data.participant_emails) {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    data.participant_emails.forEach((email, index) => {
      if (!emailRegex.test(email)) {
        errors.push({ field: `participant_emails[${index}]`, message: 'Invalid email format' });
      }
    });
  }
  
  return errors;
};

// Error handling utility as specified in CLAUDE.md
const handleDatabaseError = (error: any, operation: string): ApiResponse => {
  logger.error(`Database operation failed: ${operation}`, error);
  
  return {
    success: false,
    error: {
      error: error.code || 'DATABASE_ERROR',
      message: error.message || 'An unexpected database error occurred',
      code: error.status || 500,
      timestamp: new Date().toISOString()
    }
  };
};

// Meeting Operations
export async function getMeetings(hostId?: string): Promise<ApiResponse<Meeting[]>> {
  try {
    logger.info('Fetching meetings', { hostId });
    
    let query = supabase
      .from('meetings')
      .select(`
        id,
        title,
        description,
        start_time,
        end_time,
        timezone,
        status,
        meeting_url,
        host_id,
        created_at,
        updated_at,
        meeting_participants!inner(
          role,
          status,
          participants!inner(
            id,
            email,
            full_name,
            phone,
            timezone,
            is_verified,
            created_at,
            updated_at
          )
        ),
        meeting_tags(tag)
      `)
      .order('start_time', { ascending: true });

    if (hostId) {
      query = query.eq('host_id', hostId);
    }

    const { data: meetings, error } = await query;

    if (error) {
      return handleDatabaseError(error, 'getMeetings');
    }

    const formattedMeetings: Meeting[] = meetings?.map(meeting => ({
      id: meeting.id,
      title: meeting.title,
      description: meeting.description,
      start_time: meeting.start_time,
      end_time: meeting.end_time,
      timezone: meeting.timezone,
      status: meeting.status,
      meeting_url: meeting.meeting_url,
      host_id: meeting.host_id,
      created_at: meeting.created_at,
      updated_at: meeting.updated_at,
      participants: meeting.meeting_participants?.map((mp: any) => mp.participants) || [],
      tags: meeting.meeting_tags?.map((mt: any) => mt.tag) || []
    })) || [];

    logger.info('Successfully fetched meetings', { count: formattedMeetings.length });
    return { success: true, data: formattedMeetings };

  } catch (error) {
    return handleDatabaseError(error as Error, 'getMeetings');
  }
}

export async function createMeeting(meetingData: CreateMeetingData, hostId: string): Promise<ApiResponse<Meeting>> {
  try {
    logger.info('Creating meeting', { title: meetingData.title, hostId });
    
    // Validate input
    const validationErrors = validateMeetingData(meetingData);
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: {
          error: 'VALIDATION_ERROR',
          message: validationErrors.map(e => `${e.field}: ${e.message}`).join(', '),
          code: 400,
          timestamp: new Date().toISOString()
        }
      };
    }

    // Start transaction
    const { data: newMeeting, error: meetingError } = await supabase
      .from('meetings')
      .insert({
        title: meetingData.title,
        description: meetingData.description,
        start_time: meetingData.start_time,
        end_time: meetingData.end_time,
        timezone: meetingData.timezone || 'UTC',
        status: 'scheduled',
        meeting_url: meetingData.meeting_url,
        host_id: hostId
      })
      .select()
      .single();

    if (meetingError) {
      return handleDatabaseError(meetingError, 'createMeeting');
    }

    // Add participants if provided
    const participants: Participant[] = [];
    if (meetingData.participant_emails && meetingData.participant_emails.length > 0) {
      for (const email of meetingData.participant_emails) {
        const participant = await getOrCreateParticipant({
          email,
          full_name: email.split('@')[0], // Temporary name, should be updated later
          timezone: meetingData.timezone || 'UTC',
          is_verified: false
        });

        if (participant.success && participant.data) {
          participants.push(participant.data);
          
          // Add to meeting_participants
          await supabase
            .from('meeting_participants')
            .insert({
              meeting_id: newMeeting.id,
              participant_id: participant.data.id,
              role: 'attendee',
              status: 'pending'
            });
        }
      }
    }

    // Add tags if provided
    if (meetingData.tags && meetingData.tags.length > 0) {
      await supabase
        .from('meeting_tags')
        .insert(
          meetingData.tags.map(tag => ({
            meeting_id: newMeeting.id,
            tag
          }))
        );
    }

    const meeting: Meeting = {
      ...newMeeting,
      participants,
      tags: meetingData.tags || []
    };

    logger.info('Successfully created meeting', { meetingId: newMeeting.id });
    return { success: true, data: meeting };

  } catch (error) {
    return handleDatabaseError(error as Error, 'createMeeting');
  }
}

export async function updateMeeting(id: string, updates: Partial<CreateMeetingData>, hostId: string): Promise<ApiResponse<Meeting>> {
  try {
    logger.info('Updating meeting', { meetingId: id, hostId });
    
    // Validate input if provided
    if (updates.title || updates.start_time || updates.end_time) {
      const tempData: CreateMeetingData = {
        title: updates.title || 'temp',
        start_time: updates.start_time || new Date().toISOString(),
        end_time: updates.end_time || new Date(Date.now() + 60*60*1000).toISOString(),
        ...updates
      };
      
      const validationErrors = validateMeetingData(tempData);
      if (validationErrors.length > 0) {
        return {
          success: false,
          error: {
            error: 'VALIDATION_ERROR',
            message: validationErrors.map(e => `${e.field}: ${e.message}`).join(', '),
            code: 400,
            timestamp: new Date().toISOString()
          }
        };
      }
    }

    const { data: updatedMeeting, error } = await supabase
      .from('meetings')
      .update({
        title: updates.title,
        description: updates.description,
        start_time: updates.start_time,
        end_time: updates.end_time,
        timezone: updates.timezone,
        meeting_url: updates.meeting_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('host_id', hostId) // Ensure only host can update
      .select()
      .single();

    if (error) {
      return handleDatabaseError(error, 'updateMeeting');
    }

    // Fetch complete meeting data
    const meetingResponse = await getMeetings();
    const meeting = meetingResponse.data?.find(m => m.id === id);

    if (!meeting) {
      return {
        success: false,
        error: {
          error: 'NOT_FOUND',
          message: 'Meeting not found after update',
          code: 404,
          timestamp: new Date().toISOString()
        }
      };
    }

    logger.info('Successfully updated meeting', { meetingId: id });
    return { success: true, data: meeting };

  } catch (error) {
    return handleDatabaseError(error as Error, 'updateMeeting');
  }
}

export async function deleteMeeting(id: string, hostId: string): Promise<ApiResponse<void>> {
  try {
    logger.info('Deleting meeting', { meetingId: id, hostId });
    
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id)
      .eq('host_id', hostId); // Ensure only host can delete

    if (error) {
      return handleDatabaseError(error, 'deleteMeeting');
    }

    logger.info('Successfully deleted meeting', { meetingId: id });
    return { success: true };

  } catch (error) {
    return handleDatabaseError(error as Error, 'deleteMeeting');
  }
}

// Participant Operations
export async function getOrCreateParticipant(participantData: Omit<Participant, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Participant>> {
  try {
    logger.info('Getting or creating participant', { email: participantData.email });
    
    // First, try to find existing participant by email
    const { data: existing, error: fetchError } = await supabase
      .from('participants')
      .select('*')
      .eq('email', participantData.email)
      .single();

    if (existing && !fetchError) {
      logger.info('Found existing participant', { participantId: existing.id });
      return { success: true, data: existing };
    }

    // If not found, create new participant
    const { data: newParticipant, error: insertError } = await supabase
      .from('participants')
      .insert(participantData)
      .select()
      .single();

    if (insertError) {
      return handleDatabaseError(insertError, 'createParticipant');
    }

    logger.info('Successfully created participant', { participantId: newParticipant.id });
    return { success: true, data: newParticipant };

  } catch (error) {
    return handleDatabaseError(error as Error, 'getOrCreateParticipant');
  }
}

// Meeting participant operations
export async function updateMeetingParticipantStatus(
  meetingId: string, 
  participantId: string, 
  status: 'confirmed' | 'declined' | 'no_show'
): Promise<ApiResponse<void>> {
  try {
    logger.info('Updating meeting participant status', { meetingId, participantId, status });
    
    const { error } = await supabase
      .from('meeting_participants')
      .update({ status })
      .eq('meeting_id', meetingId)
      .eq('participant_id', participantId);

    if (error) {
      return handleDatabaseError(error, 'updateMeetingParticipantStatus');
    }

    logger.info('Successfully updated meeting participant status');
    return { success: true };

  } catch (error) {
    return handleDatabaseError(error as Error, 'updateMeetingParticipantStatus');
  }
}

// Utility functions for business logic
export const businessLogic = {
  // Check if meeting time conflicts with existing meetings
  checkTimeConflicts: async (hostId: string, startTime: string, endTime: string, excludeMeetingId?: string): Promise<boolean> => {
    const { data: meetings, error } = await supabase
      .from('meetings')
      .select('id, start_time, end_time')
      .eq('host_id', hostId)
      .eq('status', 'scheduled')
      .neq('id', excludeMeetingId || '');

    if (error || !meetings) return false;

    return meetings.some(meeting => {
      const meetingStart = new Date(meeting.start_time);
      const meetingEnd = new Date(meeting.end_time);
      const newStart = new Date(startTime);
      const newEnd = new Date(endTime);

      return (newStart < meetingEnd && newEnd > meetingStart);
    });
  },

  // Calculate meeting duration in minutes
  calculateDuration: (startTime: string, endTime: string): number => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
  },

  // Check if time is within business hours
  isWithinBusinessHours: (dateTime: string, businessHours: { start: string; end: string; days: number[] }): boolean => {
    const date = new Date(dateTime);
    const day = date.getDay();
    const time = date.toTimeString().substring(0, 5); // HH:mm format

    return businessHours.days.includes(day) && 
           time >= businessHours.start && 
           time <= businessHours.end;
  }
};