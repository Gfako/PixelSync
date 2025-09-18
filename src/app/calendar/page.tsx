'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, RefreshCw } from 'lucide-react';
import { useAuthSimple } from '@/hooks/useAuthSimple';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import CalendarEventCard from '@/components/CalendarEventCard';
import MeetingDetailModal from '@/components/MeetingDetailModal';
import NewMeetingModal from '@/components/NewMeetingModal';
import { Meeting } from '@/types';

const filterOptions = [
  { id: 'all', label: 'View All', color: 'bg-pixel-muted', active: true },
  { id: 'networking', label: 'Networking', color: 'bg-pixel-danger' },
  { id: 'partnerships', label: 'Partnerships', color: 'bg-pixel-secondary' },
  { id: 'sales', label: 'Sales', color: 'bg-pixel-primary' },
  { id: 'holiday', label: 'Holiday', color: 'bg-pixel-success' },
  { id: 'hiring', label: 'Hiring', color: 'bg-pixel-accent' }
];

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar() {
  const { isAuthenticated, loading: isLoading } = useAuthSimple();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date()); // Current month
  const [meetings, setMeetings] = useState<any>({ past: [], upcoming: [], all: [] });
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'Month' | 'Week' | 'Day' | 'List'>('Month');
  const [draggedMeeting, setDraggedMeeting] = useState<Meeting | null>(null);
  const [draggedOverDate, setDraggedOverDate] = useState<string | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [selectedDateForNewMeeting, setSelectedDateForNewMeeting] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
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

  // Handle new meeting for specific date
  const handleNewMeetingForDate = (date: string) => {
    setSelectedDateForNewMeeting(date);
    setIsNewMeetingModalOpen(true);
  };

  // Close new meeting modal and reset selected date
  const closeNewMeetingModal = () => {
    setIsNewMeetingModalOpen(false);
    setSelectedDateForNewMeeting(null);
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

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) { // 6 weeks × 7 days
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getMeetingsForDate = (date: Date) => {
    const dateKey = formatDateKey(date);
    // Get all meetings from both past and upcoming
    const allMeetings = [...(meetings.past || []), ...(meetings.upcoming || [])];
    let dateMeetings = allMeetings.filter(meeting => {
      // Handle both date formats (YYYY-MM-DD and ISO)
      const meetingDate = meeting.start_time ? new Date(meeting.start_time) : null;
      return meetingDate && formatDateKey(meetingDate) === dateKey;
    });

    // Apply active filter
    if (activeFilter && activeFilter !== 'all') {
      dateMeetings = dateMeetings.filter(meeting => {
        try {
          // Safe type checking and filtering
          const meetingType = meeting.type;
          const meetingTags = meeting.tags;

          // Check meeting type with null/undefined safety
          const typeMatch = meetingType &&
                           typeof meetingType === 'string' &&
                           meetingType.toLowerCase() === activeFilter.toLowerCase();

          // Check tags with null/undefined safety
          const tagMatch = meetingTags &&
                          Array.isArray(meetingTags) &&
                          meetingTags.some((tag: any) =>
                            tag &&
                            typeof tag === 'string' &&
                            tag.toLowerCase() === activeFilter.toLowerCase()
                          );

          return typeMatch || tagMatch;
        } catch (error) {
          console.error('Error filtering meeting:', error, meeting);
          return true; // Include meeting if filtering fails
        }
      });
    }

    return dateMeetings;
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleDragStart = (e: React.DragEvent, meeting: Meeting) => {
    setDraggedMeeting(meeting);
    e.dataTransfer.setData('text/plain', meeting.id);
  };

  const handleDragOver = (e: React.DragEvent, dateKey: string) => {
    e.preventDefault();

    // Check if this is a past date
    const targetDateObj = new Date(dateKey);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDateObj.setHours(0, 0, 0, 0);

    // Only set draggedOverDate if it's not a past date
    if (targetDateObj >= today) {
      setDraggedOverDate(dateKey);
    } else {
      setDraggedOverDate(null);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOverDate(null);
  };

  const handleDrop = async (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();

    if (!draggedMeeting) return;

    // Prevent dropping on past dates
    const targetDateObj = new Date(targetDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates
    targetDateObj.setHours(0, 0, 0, 0);

    if (targetDateObj < today) {
      console.warn('Cannot move meeting to a past date');
      setDraggedMeeting(null);
      setDraggedOverDate(null);
      return;
    }

    try {
      // Create new date using the target date and original time
      const originalDateTime = new Date(draggedMeeting.start_time);
      const targetDateTime = new Date(targetDate);

      // Set the new date while preserving the original time
      targetDateTime.setHours(originalDateTime.getHours());
      targetDateTime.setMinutes(originalDateTime.getMinutes());
      targetDateTime.setSeconds(originalDateTime.getSeconds());

      // Update local state optimistically
      const updateMeetingDate = (meetingList: any[]) =>
        meetingList.map(meeting =>
          meeting.id === draggedMeeting.id
            ? { ...meeting, start_time: targetDateTime.toISOString() }
            : meeting
        );

      setMeetings(prevMeetings => ({
        ...prevMeetings,
        past: updateMeetingDate(prevMeetings.past),
        upcoming: updateMeetingDate(prevMeetings.upcoming),
        all: updateMeetingDate(prevMeetings.all)
      }));

      // TODO: Add API call to update the meeting in the database
      // For now, this is just a local state update

    } catch (error) {
      console.error('Error updating meeting date:', error);
      // Optionally refresh meetings to revert the change
      fetchMeetings();
    }

    setDraggedMeeting(null);
    setDraggedOverDate(null);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const calendarDays = generateCalendarDays();

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
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-pixel-text">Calendar</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchMeetings}
                disabled={loading}
                className="pixel-button bg-pixel-secondary text-pixel-text hover:bg-pixel-secondary/90 flex items-center gap-2 px-4 py-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => setIsNewMeetingModalOpen(true)}
                className="pixel-button bg-pixel-primary text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Meeting
              </button>
            </div>
          </div>

          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-1 text-pixel-text-light hover:text-pixel-text transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-bold text-pixel-text min-w-[140px]">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-1 text-pixel-text-light hover:text-pixel-text transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center gap-1">
              {['Month', 'Week', 'Day', 'List'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  className={`px-3 py-1 text-sm border-2 transition-all duration-200 ${
                    viewMode === mode
                      ? 'bg-pixel-primary text-white border-pixel-primary'
                      : 'bg-pixel-surface text-pixel-text border-pixel-border hover:bg-pixel-bg'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-6">
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-3 py-2 text-sm border-2 transition-all duration-200 ${
                  activeFilter === filter.id
                    ? 'bg-pixel-primary text-white border-pixel-primary'
                    : 'bg-pixel-surface text-pixel-text border-pixel-border hover:bg-pixel-bg'
                }`}
              >
                <div className={`w-3 h-3 ${filter.color} border border-pixel-border`} />
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-pixel-surface border-2 border-pixel-border shadow-retro overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 280px)', maxHeight: '600px' }}>
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b-2 border-pixel-border">
            {daysOfWeek.map((day) => (
              <div key={day} className="p-3 text-center font-medium text-pixel-text-light bg-pixel-sidebar border-r-2 border-pixel-border last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 flex-1">
            {calendarDays.map((date, index) => {
              const dateKey = formatDateKey(date);
              const dayMeetings = getMeetingsForDate(date);
              const isCurrentMonthDay = isCurrentMonth(date);
              const isTodayDate = isToday(date);
              const isPastDate = date < new Date(new Date().toDateString());

              return (
                <div
                  key={dateKey}
                  className={`p-2 border-r-2 border-b-2 border-pixel-border last:border-r-0 transition-colors flex flex-col min-h-0 ${
                    isPastDate
                      ? 'opacity-50 bg-pixel-surface'
                      : draggedOverDate === dateKey && draggedMeeting
                        ? 'bg-pixel-primary/20 border-pixel-primary'
                        : 'bg-pixel-surface'
                  }`}
                  style={{
                    borderBottomWidth: Math.floor(index / 7) === 5 ? 0 : '2px'
                  }}
                  onDragOver={(e) => handleDragOver(e, dateKey)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, dateKey)}
                  onMouseEnter={() => setHoveredDate(dateKey)}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  {/* Date Number */}
                  <div className={`text-sm font-medium mb-1 ${
                    isTodayDate
                      ? 'bg-pixel-primary text-white w-6 h-6 flex items-center justify-center border-2 border-pixel-primary'
                      : isPastDate ? 'text-pixel-muted' : isCurrentMonthDay ? 'text-pixel-text' : 'text-pixel-text-light'
                  }`}>
                    {date.getDate()}
                  </div>

                  {/* Meetings */}
                  <div className="space-y-1 flex-1 overflow-y-auto">
                    {dayMeetings.map((meeting) => {
                      const isPast = meeting.start_time ? new Date(meeting.start_time) < new Date() : false;
                      return (
                        <CalendarEventCard
                          key={meeting.id}
                          meeting={meeting}
                          onClick={() => handleMeetingClick(meeting)}
                          onDragStart={!isPast ? handleDragStart : undefined}
                        />
                      );
                    })}

                    {/* New Meeting Button - Only show on hover and for current/future dates */}
                    {hoveredDate === dateKey && !draggedMeeting && new Date(dateKey) >= new Date(new Date().toDateString()) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNewMeetingForDate(dateKey);
                        }}
                        className="text-xs px-2 py-1 bg-pixel-primary text-white border-2 border-pixel-border shadow-retro-sm hover:shadow-retro transition-all duration-200 hover:scale-105 mt-1"
                      >
                        + New Meeting
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* New Meeting Modal */}
        <NewMeetingModal
          isOpen={isNewMeetingModalOpen}
          onClose={closeNewMeetingModal}
          onSubmit={handleCreateMeeting}
          isLoading={isCreatingMeeting}
          initialDate={selectedDateForNewMeeting}
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