'use client';

interface MeetingTemplateCardProps {
  title: string;
  description: string;
  duration: string;
  image: string;
  onEdit: () => void;
  onCopyLink: () => void;
}

export default function MeetingTemplateCard({ 
  title, 
  description, 
  duration, 
  image, 
  onEdit, 
  onCopyLink 
}: MeetingTemplateCardProps) {
  return (
    <div className="pixel-card group">
      {/* Image */}
      <div className="relative mb-4 overflow-hidden border-2 border-pixel-border">
        <img 
          src={image} 
          alt={title}
          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="font-bold text-pixel-text mb-2">{title}</h3>
        <p className="text-sm text-pixel-text-light mb-1">{description}</p>
        <p className="text-xs text-pixel-muted">{duration}</p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button 
          onClick={onEdit}
          className="w-full pixel-button-secondary text-pixel-text hover:text-pixel-primary"
        >
          Edit
        </button>
        <button 
          onClick={onCopyLink}
          className="w-full pixel-button bg-pixel-primary text-white hover:bg-pixel-primary/90"
        >
          Copy Link
        </button>
      </div>
    </div>
  );
}