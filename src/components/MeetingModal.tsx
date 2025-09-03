'use client';

import { useState } from 'react';
import { Meeting } from '@/types';
import { X } from 'lucide-react';

interface MeetingModalProps {
  meeting: Meeting | null;
  onClose: () => void;
}

export default function MeetingModal({ meeting, onClose }: MeetingModalProps) {
  const [notes, setNotes] = useState(meeting?.notes || '');

  if (!meeting) return null;

  const participant = meeting.participants[0]; // Main participant for form fields

  return (
    <div className="pixel-modal-backdrop flex items-center justify-center z-50 p-4">
      <div className="bg-pixel-surface border-2 border-pixel-border shadow-retro-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pixel-modal">
        {/* Header */}
        <div className="border-b-2 border-pixel-border p-4 flex items-center justify-between bg-pixel-sidebar">
          <h2 className="text-lg font-bold text-pixel-text">
            {meeting.title}
          </h2>
          <button
            onClick={onClose}
            className="text-pixel-text-light hover:text-pixel-text transition-colors p-1 hover:bg-pixel-surface border-2 border-transparent hover:border-pixel-border"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Form Fields - Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-pixel-text-light uppercase mb-2 tracking-wider">
                  Name
                </label>
                <input
                  type="text"
                  value={participant?.name || ''}
                  className="pixel-input w-full"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-pixel-text-light uppercase mb-2 tracking-wider">
                  Company
                </label>
                <input
                  type="text"
                  value={participant?.company || ''}
                  className="pixel-input w-full"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-pixel-text-light uppercase mb-2 tracking-wider">
                  Title
                </label>
                <input
                  type="text"
                  value={participant?.title || ''}
                  className="pixel-input w-full"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-pixel-text-light uppercase mb-2 tracking-wider">
                  Tags
                </label>
                <input
                  type="text"
                  value={meeting.tags.join(', ')}
                  className="pixel-input w-full"
                  readOnly
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-pixel-text-light uppercase mb-2 tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={participant?.email || ''}
                  className="pixel-input w-full"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-pixel-text-light uppercase mb-2 tracking-wider">
                  Website
                </label>
                <input
                  type="url"
                  value={participant?.website || ''}
                  className="pixel-input w-full"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-pixel-text-light uppercase mb-2 tracking-wider">
                  Meeting Type
                </label>
                <input
                  type="text"
                  value={meeting.type}
                  className="pixel-input w-full"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-pixel-text-light uppercase mb-2 tracking-wider">
                  Meeting Date
                </label>
                <input
                  type="text"
                  value={meeting.date}
                  className="pixel-input w-full"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <label className="block text-xs font-bold text-pixel-muted uppercase mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="pixel-input w-full h-20 resize-none"
              placeholder="Add your meeting notes here..."
            />
          </div>

          {/* Call Transcript Section */}
          {meeting.transcript && (
            <div>
              <label className="block text-xs font-medium text-pixel-text-light uppercase mb-2 tracking-wider">
                Call Transcript
              </label>
              <div className="border-2 border-pixel-border bg-pixel-bg p-4 h-40 overflow-y-auto shadow-inner">
                <p className="text-sm text-pixel-text whitespace-pre-wrap leading-relaxed">
                  {meeting.transcript}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}