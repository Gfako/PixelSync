'use client';

import { useState, useEffect } from 'react';
import { useAuthSimple } from '@/hooks/useAuthSimple';
import { useRouter } from 'next/navigation';
import { Plus, RefreshCw } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import MeetingCard from '@/components/MeetingCard';
import NewMeetingModal from '@/components/NewMeetingModal';
import MeetingDetailModal from '@/components/MeetingDetailModal';
import { Meeting } from '@/types';

export default function Home() {
  const { isAuthenticated, loading: isLoading } = useAuthSimple();
  const router = useRouter();
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [meetings, setMeetings] = useState<any>({ past: [], upcoming: [], all: [] });
  const [loading, setLoading] = useState(false);
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
  const [stats, setStats] = useState({ total: 0, dbCount: 0, calendarCount: 0 });
  const [isMeetingDetailModalOpen, setIsMeetingDetailModalOpen] = useState(false);

  // Fetch combined meetings from database and calendar
  const fetchMeetings = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const response = await fetch('/api/meetings/combined', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMeetings(data.data);
          setStats({
            total: data.data.total || 0,
            dbCount: data.data.dbCount || 0,
            calendarCount: data.data.calendarCount || 0
          });
        } else {
          console.error('Failed to fetch meetings:', data.error);
        }
      } else {
        console.error('Failed to fetch meetings:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new meeting
  const handleCreateMeeting = async (meetingData: any) => {
    setIsCreatingMeeting(true);
    try {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData),
      });

      const data = await response.json();
      if (data.success) {
        setIsNewMeetingModalOpen(false);
        // Refresh meetings list
        await fetchMeetings();
      } else {
        console.error('Failed to create meeting:', data.error);
        alert('Failed to create meeting: ' + (data.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('Error creating meeting. Please try again.');
    } finally {
      setIsCreatingMeeting(false);
    }
  };

  // Handle notes update
  const handleUpdateNotes = async (meetingId: string, notes: string) => {
    try {
      const response = await fetch(`/api/meetings/${meetingId}/notes`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        // Update the local state
        setMeetings((prev: any) => {
          const updateMeetingNotes = (meetingList: any[]) =>
            meetingList.map(meeting =>
              meeting.id === meetingId ? { ...meeting, notes } : meeting
            );

          return {
            ...prev,
            past: updateMeetingNotes(prev.past),
            upcoming: updateMeetingNotes(prev.upcoming),
            all: updateMeetingNotes(prev.all)
          };
        });

        // Update selected meeting if it's the same one
        if (selectedMeeting?.id === meetingId) {
          setSelectedMeeting(prev => prev ? { ...prev, notes } : null);
        }
      } else {
        throw new Error('Failed to update notes');
      }
    } catch (error) {
      console.error('Error updating notes:', error);
      throw error;
    }
  };

  // Handle meeting card click
  const handleMeetingClick = (meeting: any) => {
    setSelectedMeeting(meeting);
    setIsMeetingDetailModalOpen(true);
  };

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch meetings when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchMeetings();
    }
  }, [isAuthenticated]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--background)'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-foreground mx-auto mb-4" style={{borderColor: 'var(--foreground)'}}></div>
          <div className="text-xl brutalist-text">LOADING...</div>
        </div>
      </div>
    );
  }

  // Don't render app if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen max-h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-8 pb-4">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-pixel-text mb-2">Home</h1>
                <p className="text-pixel-text-light">
                  {stats.total > 0 && (
                    <>Total: {stats.total} meetings • PixelSync: {stats.dbCount} • Calendar: {stats.calendarCount}</>
                  )}
                </p>
              </div>
              <button
                onClick={fetchMeetings}
                disabled={loading}
                className="pixel-button bg-pixel-secondary text-pixel-text hover:bg-pixel-secondary/90 flex items-center gap-2 px-4 py-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid - Scrollable */}
        <div className="flex-1 px-8 pb-24 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-pixel-text-light">Loading meetings...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
              {/* Past Meetings */}
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <h2 className="text-lg font-bold text-pixel-text">Past Meetings</h2>
                </div>
                <div className="space-y-4 flex-1 min-h-0 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                  {meetings.past && meetings.past.length > 0 ? (
                    meetings.past.map((meeting: any) => (
                      <MeetingCard
                        key={meeting.id}
                        meeting={meeting}
                        onClick={() => handleMeetingClick(meeting)}
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
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <h2 className="text-lg font-bold text-pixel-text">Upcoming Meetings</h2>
                  <button className="text-pixel-text-light hover:text-pixel-text">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4 flex-1 min-h-0 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                  {meetings.upcoming && meetings.upcoming.length > 0 ? (
                    meetings.upcoming.map((meeting: any) => (
                      <MeetingCard
                        key={meeting.id}
                        meeting={meeting}
                        onClick={() => handleMeetingClick(meeting)}
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
        </div>

        {/* New Meeting Button - Positioned at bottom right */}
        <button
          onClick={() => setIsNewMeetingModalOpen(true)}
          className="fixed bottom-8 right-8 pixel-button bg-pixel-primary text-white hover:bg-pixel-primary/90 flex items-center gap-2 px-6 py-3 shadow-retro-xl hover:animate-pixel-pulse z-10"
        >
          <Plus className="w-4 h-4" />
          New Meeting
        </button>

        {/* New Meeting Modal */}
        <NewMeetingModal
          isOpen={isNewMeetingModalOpen}
          onClose={() => setIsNewMeetingModalOpen(false)}
          onSubmit={handleCreateMeeting}
          isLoading={isCreatingMeeting}
        />

        {/* Meeting Detail Modal */}
        <MeetingDetailModal
          isOpen={isMeetingDetailModalOpen}
          onClose={() => setIsMeetingDetailModalOpen(false)}
          meeting={selectedMeeting}
          onUpdateNotes={handleUpdateNotes}
        />
      </div>
    </div>
  );
}