'use client';

import { Meeting } from '@/types';
import { Clock, Calendar, Users, ExternalLink, Video } from 'lucide-react';

interface MeetingCardProps {
  meeting: Meeting & {
    source?: string;
    provider?: string;
    attendees?: string[];
    location?: string;
  };
  onClick?: () => void;
}

export default function MeetingCard({ meeting, onClick }: MeetingCardProps) {
  const startDate = new Date(meeting.start_time)
  const endDate = new Date(meeting.end_time)
  const now = new Date()

  const isUpcoming = startDate > now
  const isPast = endDate < now
  const isInProgress = startDate <= now && endDate > now

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  const getStatusBadge = () => {
    if (isInProgress) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Live
        </span>
      )
    } else if (isPast) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Completed
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Scheduled
        </span>
      )
    }
  }

  const getSourceBadge = () => {
    if (meeting.source === 'calendar') {
      const providerName = meeting.provider === 'google' ? 'Google' : 'Outlook'
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {providerName}
        </span>
      )
    } else if (meeting.source === 'database') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          PixelSync
        </span>
      )
    }
    return null
  }

  const getPlatformIcon = () => {
    switch (meeting.meeting_platform) {
      case 'zoom':
        return <Video className="w-4 h-4" />
      case 'google_meet':
        return <Video className="w-4 h-4" />
      case 'teams':
        return <Video className="w-4 h-4" />
      default:
        return <Video className="w-4 h-4" />
    }
  }

  const getAttendeeCount = () => {
    if (meeting.attendees?.length) {
      return meeting.attendees.length
    }
    if (meeting.participants?.length) {
      return meeting.participants.length
    }
    return 0
  }

  return (
    <div
      className="pixel-card cursor-pointer hover:bg-pixel-bg/30 group"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-pixel-text truncate">
            {meeting.title}
          </h3>
          {meeting.description && (
            <p className="text-xs text-pixel-text-light mt-1 line-clamp-2">
              {meeting.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 ml-3">
          {getSourceBadge()}
          {getStatusBadge()}
        </div>
      </div>

      {/* Meeting Details */}
      <div className="space-y-2 mb-3">
        {/* Date and Time */}
        <div className="flex items-center text-xs text-pixel-text-light">
          <Calendar className="w-3 h-3 mr-2 flex-shrink-0" />
          <span>
            {formatDate(startDate)} • {formatTime(startDate)} - {formatTime(endDate)}
          </span>
        </div>

        {/* Duration */}
        <div className="flex items-center text-xs text-pixel-text-light">
          <Clock className="w-3 h-3 mr-2 flex-shrink-0" />
          <span>
            {Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))} minutes
          </span>
        </div>

        {/* Attendees */}
        {getAttendeeCount() > 0 && (
          <div className="flex items-center text-xs text-pixel-text-light">
            <Users className="w-3 h-3 mr-2 flex-shrink-0" />
            <span>{getAttendeeCount()} attendee{getAttendeeCount() === 1 ? '' : 's'}</span>
          </div>
        )}

        {/* Location */}
        {meeting.location && (
          <div className="flex items-center text-xs text-pixel-text-light">
            <ExternalLink className="w-3 h-3 mr-2 flex-shrink-0" />
            <span className="truncate">{meeting.location}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {meeting.tags && meeting.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {meeting.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-pixel-accent text-white border-2 border-pixel-accent font-medium shadow-retro-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-pixel-border/50">
        <div className="flex items-center text-xs text-pixel-text-light">
          {getPlatformIcon()}
          <span className="ml-1 capitalize">
            {meeting.meeting_platform?.replace('_', ' ') || 'Meeting'}
          </span>
        </div>

        {meeting.meeting_url && isUpcoming && (
          <a
            href={meeting.meeting_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-pixel-primary hover:text-pixel-primary/80"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Join
          </a>
        )}

        {meeting.meeting_url && isPast && (
          <span className="text-xs text-pixel-text-light">
            Ended
          </span>
        )}

        {meeting.meeting_url && isInProgress && (
          <a
            href={meeting.meeting_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-green-600 hover:text-green-700 font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Join Now
          </a>
        )}
      </div>
    </div>
  );
}