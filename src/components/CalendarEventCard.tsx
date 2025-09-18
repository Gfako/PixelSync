'use client';

import { Meeting } from '@/types';

interface CalendarEventCardProps {
  meeting: Meeting;
  onClick: () => void;
  onDragStart?: (e: React.DragEvent, meeting: Meeting) => void;
}

const getEventColor = (type?: string, isPast: boolean = false) => {
  if (!type || typeof type !== 'string') {
    return isPast ? 'bg-gray-400 border-gray-400' : 'bg-pixel-muted border-pixel-muted';
  }

  if (isPast) {
    switch (type.toLowerCase()) {
      case 'partnership':
      case 'partnerships': return 'bg-gray-400 border-gray-400';
      case 'ui design':
      case 'design': return 'bg-gray-400 border-gray-400';
      case 'development': return 'bg-gray-400 border-gray-400';
      case 'marketing': return 'bg-gray-400 border-gray-400';
      case 'networking': return 'bg-gray-400 border-gray-400';
      case 'sales': return 'bg-gray-400 border-gray-400';
      default: return 'bg-gray-400 border-gray-400';
    }
  }

  switch (type.toLowerCase()) {
    case 'partnership':
    case 'partnerships': return 'bg-pixel-secondary border-pixel-secondary';
    case 'ui design':
    case 'design': return 'bg-pixel-accent border-pixel-accent';
    case 'development': return 'bg-pixel-success border-pixel-success';
    case 'marketing': return 'bg-pixel-warning border-pixel-warning';
    case 'networking': return 'bg-pixel-danger border-pixel-danger';
    case 'sales': return 'bg-pixel-primary border-pixel-primary';
    default: return 'bg-pixel-muted border-pixel-muted';
  }
};

export default function CalendarEventCard({ meeting, onClick, onDragStart }: CalendarEventCardProps) {
  // Determine if meeting is in the past
  const isPast = meeting.start_time ? new Date(meeting.start_time) < new Date() : false;
  const colorClass = getEventColor(meeting.type, isPast);

  return (
    <div
      draggable={!!onDragStart}
      onDragStart={onDragStart ? (e) => onDragStart(e, meeting) : undefined}
      className={`${colorClass} text-white text-xs p-1 mb-1 border-2 shadow-retro-sm cursor-pointer hover:shadow-retro transition-all duration-200 hover:scale-105 ${onDragStart ? 'cursor-move' : 'cursor-pointer'} ${isPast ? 'opacity-70' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div className="flex items-center justify-between">
        <div className="font-medium truncate flex-1">{meeting.title}</div>
        {isPast && (
          <div className="text-[10px] bg-black/30 px-1 rounded ml-1 text-white/80">PAST</div>
        )}
      </div>
      {meeting.participants && meeting.participants.length > 0 && (
        <div className="text-white/80 truncate">
          {meeting.participants.map(p => p.name.split(' ')[0]).join(', ')}
        </div>
      )}
    </div>
  );
}