'use client';

import { Meeting } from '@/types';
import { Clock, Calendar } from 'lucide-react';

interface MeetingCardProps {
  meeting: Meeting;
  onClick: () => void;
}

export default function MeetingCard({ meeting, onClick }: MeetingCardProps) {
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
          <p className="text-xs text-pixel-text-light mt-1">
            {meeting.participants.map(p => p.name).join(' <> ')}
          </p>
        </div>
        <div className="flex -space-x-1 ml-2">
          {meeting.participants.slice(0, 3).map((participant, index) => (
            <div
              key={participant.id}
              className="w-6 h-6 border-2 border-pixel-border bg-pixel-secondary flex items-center justify-center text-xs font-bold text-white shadow-retro-sm group-hover:animate-pixel-bounce"
              style={{ zIndex: meeting.participants.length - index, animationDelay: `${index * 100}ms` }}
            >
              {participant.name.charAt(0)}
            </div>
          ))}
          {meeting.participants.length > 3 && (
            <div className="w-6 h-6 border-2 border-pixel-border bg-pixel-muted flex items-center justify-center text-xs font-bold text-white shadow-retro-sm">
              +{meeting.participants.length - 3}
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {meeting.tags.length > 0 && (
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

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-pixel-text-light">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{meeting.date}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{meeting.time}</span>
        </div>
      </div>

      {/* Status Indicators */}
      {meeting.status === 'upcoming' && meeting.transcript && (
        <div className="mt-2 text-xs text-pixel-success font-medium">
          📝 AI Summary
        </div>
      )}
    </div>
  );
}