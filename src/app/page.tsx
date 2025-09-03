'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import MeetingCard from '@/components/MeetingCard';
import MeetingModal from '@/components/MeetingModal';
import { Meeting } from '@/types';
import { getMeetings } from '@/lib/database';

export default function Home() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMeetings() {
      try {
        const fetchedMeetings = await getMeetings();
        setMeetings(fetchedMeetings);
      } catch (error) {
        console.error('Error loading meetings:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMeetings();
  }, []);

  const pastMeetings = meetings.filter(m => m.status === 'past');
  const upcomingMeetings = meetings.filter(m => m.status === 'upcoming');

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-pixel-text mb-2">Home</h1>
        </div>

        {/* Main Content Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-pixel-text-light">Loading meetings...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Past Meetings */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-pixel-text">Past Meetings</h2>
              </div>
              <div className="space-y-4">
                {pastMeetings.length > 0 ? (
                  pastMeetings.map((meeting) => (
                    <MeetingCard
                      key={meeting.id}
                      meeting={meeting}
                      onClick={() => setSelectedMeeting(meeting)}
                    />
                  ))
                ) : (
                  <div className="text-pixel-text-light text-center py-8">
                    No past meetings yet
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Meetings */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-pixel-text">Upcoming Meetings</h2>
                <button className="text-pixel-text-light hover:text-pixel-text">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                {upcomingMeetings.length > 0 ? (
                  upcomingMeetings.map((meeting) => (
                    <MeetingCard
                      key={meeting.id}
                      meeting={meeting}
                      onClick={() => setSelectedMeeting(meeting)}
                    />
                  ))
                ) : (
                  <div className="text-pixel-text-light text-center py-8">
                    No upcoming meetings scheduled
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* New Meeting Button */}
        <button className="fixed bottom-8 right-8 pixel-button bg-pixel-primary text-white hover:bg-pixel-primary/90 flex items-center gap-2 px-6 py-3 shadow-retro-xl hover:animate-pixel-pulse">
          <Plus className="w-4 h-4" />
          New Meeting
        </button>
      </div>

      {/* Meeting Modal */}
      <MeetingModal
        meeting={selectedMeeting}
        onClose={() => setSelectedMeeting(null)}
      />
    </div>
  );
}