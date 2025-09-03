'use client';

interface ProgressMeetingCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  status?: string;
  onClick: () => void;
}

export default function ProgressMeetingCard({ 
  title, 
  description,
  icon,
  iconBgColor,
  status,
  onClick
}: ProgressMeetingCardProps) {
  return (
    <div className="pixel-card relative cursor-pointer group" onClick={onClick}>
      {/* Status Badge */}
      {status && (
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium border-2 shadow-retro-sm ${
            status === '3 Days Left' ? 'bg-pixel-warning text-white border-pixel-warning' :
            status === '11 Days Left' ? 'bg-pixel-warning text-white border-pixel-warning' :
            'bg-pixel-muted text-white border-pixel-muted'
          }`}>
            {status}
          </span>
        </div>
      )}

      {/* Icon */}
      <div className={`w-12 h-12 ${iconBgColor} border-2 border-pixel-border flex items-center justify-center shadow-retro mb-4`}>
        {icon}
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="font-bold text-pixel-text mb-2 group-hover:text-pixel-primary transition-colors">{title}</h3>
        <p className="text-sm text-pixel-text-light">{description}</p>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-1">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="w-6 h-6 border-2 border-pixel-border bg-pixel-secondary flex items-center justify-center text-xs font-bold text-white shadow-retro-sm group-hover:animate-pixel-bounce"
              style={{ zIndex: 3 - index, animationDelay: `${index * 100}ms` }}
            >
              {String.fromCharCode(65 + index)}
            </div>
          ))}
        </div>
        <button 
          className="text-pixel-text-light hover:text-pixel-text opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>
    </div>
  );
}