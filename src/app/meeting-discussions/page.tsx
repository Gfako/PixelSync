'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ProgressMeetingCard from '@/components/ProgressMeetingCard';
import MeetingModal from '@/components/MeetingModal';
import { Meeting } from '@/types';

const tabs = [
  { id: 'meetings', label: 'Meetings', active: true },
  { id: 'overview', label: 'Overview', active: false },
  { id: 'transcripts', label: 'Meeting Transcripts', active: false },
  { id: 'recordings', label: 'Recordings', active: false },
];

// Sample meeting data for Meeting Discussions
const lastSevenDaysMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Nickel Design Studio',
    participants: [
      { id: '1', name: 'George', email: 'george@pixelsync.io', company: 'PixelSync', title: 'Product Manager' },
      { id: '2', name: 'Sarah', email: 'sarah@nickel.com', company: 'Nickel Design', title: 'Lead Designer' }
    ],
    date: '08/29/2025',
    time: '2 days ago',
    type: 'Design',
    tags: ['Design', 'UI/UX'],
    status: 'past',
    notes: 'Discussed redesign approach for the main website with animations.',
    transcript: 'Meeting focused on creating modern web animations that align with brand guidelines...'
  },
  {
    id: '2',
    title: 'Meeting Hub Website',
    participants: [
      { id: '1', name: 'George', email: 'george@pixelsync.io', company: 'PixelSync', title: 'Product Manager' },
      { id: '3', name: 'Alex', email: 'alex@meetinghub.com', company: 'Meeting Hub', title: 'Developer' }
    ],
    date: '08/28/2025',
    time: '3 days ago',
    type: 'Development',
    tags: ['Development', 'Website'],
    status: 'past',
    notes: 'Planning the technical implementation for the new meeting hub platform.',
    transcript: 'Technical discussion about architecture, database design, and user interface requirements...'
  },
  {
    id: '3',
    title: 'Dribbble Presentation',
    participants: [
      { id: '1', name: 'George', email: 'george@pixelsync.io', company: 'PixelSync', title: 'Product Manager' },
      { id: '4', name: 'Maria', email: 'maria@dribbble.com', company: 'Dribbble', title: 'Designer' }
    ],
    date: '08/27/2025',
    time: '4 days ago',
    type: 'Presentation',
    tags: ['Design', 'Portfolio'],
    status: 'past',
    notes: 'Reviewed portfolio presentation materials for Dribbble showcase.',
    transcript: 'Detailed feedback on visual presentation style and portfolio organization...'
  }
];

const previousThirtyDaysMeetings: Meeting[] = [
  {
    id: '4',
    title: 'Pixels Design Studio',
    participants: [
      { id: '1', name: 'George', email: 'george@pixelsync.io', company: 'PixelSync', title: 'Product Manager' },
      { id: '5', name: 'David', email: 'david@pixels.com', company: 'Pixels Design', title: 'Creative Director' }
    ],
    date: '08/15/2025',
    time: '2 weeks ago',
    type: 'Strategy',
    tags: ['Strategy', 'Branding'],
    status: 'past',
    notes: 'Strategic planning session for brand identity redesign project.',
    transcript: 'Comprehensive discussion about brand positioning and visual identity direction...'
  },
  {
    id: '5',
    title: 'Tubik Presentation',
    participants: [
      { id: '1', name: 'George', email: 'george@pixelsync.io', company: 'PixelSync', title: 'Product Manager' },
      { id: '6', name: 'John', email: 'john@tubik.com', company: 'Tubik Studio', title: 'Art Director' }
    ],
    date: '08/10/2025',
    time: '3 weeks ago',
    type: 'Review',
    tags: ['Review', 'Design'],
    status: 'past',
    notes: 'Design review session for the mobile app interface concepts.',
    transcript: 'Detailed review of mobile interface designs with feedback on user experience...'
  },
  {
    id: '6',
    title: 'Voni Design Studio',
    participants: [
      { id: '1', name: 'George', email: 'george@pixelsync.io', company: 'PixelSync', title: 'Product Manager' },
      { id: '7', name: 'Emma', email: 'emma@voni.com', company: 'Voni Design', title: 'Senior Designer' }
    ],
    date: '08/05/2025',
    time: '4 weeks ago',
    type: 'Consultation',
    tags: ['Consultation', 'UX'],
    status: 'past',
    notes: 'UX consultation for improving user onboarding flow.',
    transcript: 'In-depth analysis of current user journey and recommendations for improvements...'
  }
];

// Helper function to get icon for meeting type
const getIconForType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'design':
      return (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm0 6h6v2H7v-2z" clipRule="evenodd" />
        </svg>
      );
    case 'development':
      return (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
      );
    case 'presentation':
      return (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

const getColorForType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'design': return 'bg-pixel-accent';
    case 'development': return 'bg-pixel-success';
    case 'presentation': return 'bg-pixel-danger';
    case 'strategy': return 'bg-pixel-secondary';
    case 'review': return 'bg-pixel-warning';
    case 'consultation': return 'bg-pixel-accent';
    default: return 'bg-pixel-primary';
  }
};

export default function MeetingDiscussions() {
  const [activeTab, setActiveTab] = useState('meetings');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-pixel-text mb-6">Meeting Discussions</h1>
          
          {/* Tabs */}
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium border-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-pixel-primary text-white border-pixel-primary shadow-retro'
                    : 'bg-pixel-surface text-pixel-text border-pixel-border hover:bg-pixel-bg hover:border-pixel-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'meetings' && (
          <div className="space-y-8">
            {/* Last 7 Days Section */}
            <div>
              <h2 className="text-lg font-bold text-pixel-text mb-4">Last 7 Days Meetings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lastSevenDaysMeetings.map((meeting) => (
                  <ProgressMeetingCard
                    key={meeting.id}
                    title={meeting.title}
                    description={`Meeting with ${meeting.participants.map(p => p.name).join(' & ')}`}
                    icon={getIconForType(meeting.type)}
                    iconBgColor={getColorForType(meeting.type)}
                    onClick={() => setSelectedMeeting(meeting)}
                  />
                ))}
              </div>
            </div>

            {/* Previous 30 Days Section */}
            <div>
              <h2 className="text-lg font-bold text-pixel-text mb-4">Previous 30 Days Meetings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {previousThirtyDaysMeetings.map((meeting) => (
                  <ProgressMeetingCard
                    key={meeting.id}
                    title={meeting.title}
                    description={`Meeting with ${meeting.participants.map(p => p.name).join(' & ')}`}
                    icon={getIconForType(meeting.type)}
                    iconBgColor={getColorForType(meeting.type)}
                    onClick={() => setSelectedMeeting(meeting)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other tab content placeholders */}
        {activeTab === 'overview' && (
          <div className="text-center py-16 text-pixel-text-light">
            Overview content coming soon...
          </div>
        )}

        {activeTab === 'transcripts' && (
          <div className="text-center py-16 text-pixel-text-light">
            Meeting Transcripts content coming soon...
          </div>
        )}

        {activeTab === 'recordings' && (
          <div className="text-center py-16 text-pixel-text-light">
            Recordings content coming soon...
          </div>
        )}

        {/* Meeting Modal */}
        <MeetingModal
          meeting={selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
        />
      </div>
    </div>
  );
}