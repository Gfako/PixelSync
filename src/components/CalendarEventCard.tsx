'use client';

import { Meeting } from '@/types';

interface CalendarEventCardProps {
  meeting: Meeting;
  onClick: () => void;
  onDragStart?: (e: React.DragEvent, meeting: Meeting) => void;
}

const getEventColor = (type: string) => {
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
  const colorClass = getEventColor(meeting.type);
  
  return (
    <div
      draggable={!!onDragStart}
      onDragStart={onDragStart ? (e) => onDragStart(e, meeting) : undefined}
      className={`${colorClass} text-white text-xs p-1 mb-1 border-2 shadow-retro-sm cursor-pointer hover:shadow-retro transition-all duration-200 hover:scale-105 ${onDragStart ? 'cursor-move' : 'cursor-pointer'}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div className="font-medium truncate">{meeting.title}</div>
      <div className="text-white/80 truncate">
        {meeting.participants.map(p => p.name.split(' ')[0]).join(', ')}
      </div>
    </div>
  );
}