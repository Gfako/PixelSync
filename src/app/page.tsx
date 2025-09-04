'use client';

import { useState, useEffect } from 'react';
import { useAuthSimple } from '@/hooks/useAuthSimple';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { Meeting } from '@/types';

export default function Home() {
  const { isAuthenticated, loading: isLoading } = useAuthSimple();
  const router = useRouter();
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render app if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Mock meetings data for now
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
                    <div
                      key={meeting.id}
                      className="bg-pixel-card p-4 rounded-lg border border-pixel-border cursor-pointer hover:bg-pixel-card-hover transition-colors"
                      onClick={() => setSelectedMeeting(meeting)}
                    >
                      <h3 className="font-semibold text-pixel-text">{meeting.title}</h3>
                      <p className="text-pixel-text-light text-sm">{meeting.description}</p>
                    </div>
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
                    <div
                      key={meeting.id}
                      className="bg-pixel-card p-4 rounded-lg border border-pixel-border cursor-pointer hover:bg-pixel-card-hover transition-colors"
                      onClick={() => setSelectedMeeting(meeting)}
                    >
                      <h3 className="font-semibold text-pixel-text">{meeting.title}</h3>
                      <p className="text-pixel-text-light text-sm">{meeting.description}</p>
                    </div>
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
    </div>
  );
}