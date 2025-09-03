'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import CalendarEventCard from '@/components/CalendarEventCard';
import MeetingModal from '@/components/MeetingModal';
import { Meeting } from '@/types';

// Sample calendar data
const sampleMeetings: Meeting[] = [
  {
    id: '1',
    title: 'George <> Maria',
    participants: [
      { id: '1', name: 'George', email: 'george@pixelsync.io', company: 'PixelSync', title: 'Product Manager' },
      { id: '2', name: 'Maria', email: 'maria@company.com', company: 'TechCorp', title: 'Designer' }
    ],
    date: '2025-08-08', // Friday, 8th
    time: '10:00 AM',
    type: 'Partnerships',
    tags: ['Partnerships'],
    status: 'upcoming',
    notes: 'Discussion about partnership opportunities.',
    transcript: 'Partnership meeting transcript...'
  },
  {
    id: '2',
    title: 'Business Meeting',
    participants: [
      { id: '1', name: 'George', email: 'george@pixelsync.io', company: 'PixelSync', title: 'Product Manager' },
      { id: '3', name: 'John', email: 'john@business.com', company: 'BusinessCorp', title: 'CEO' }
    ],
    date: '2025-08-10', // Sunday, 10th
    time: '2:00 PM',
    type: 'Networking',
    tags: ['Networking'],
    status: 'upcoming',
    notes: 'Business networking session.'
  },
  {
    id: '3',
    title: 'Partnership Discuss',
    participants: [
      { id: '1', name: 'George', email: 'george@pixelsync.io', company: 'PixelSync', title: 'Product Manager' },
      { id: '4', name: 'Sarah', email: 'sarah@partner.com', company: 'PartnerCorp', title: 'Director' }
    ],
    date: '2025-08-12', // Tuesday, 12th
    time: '11:00 AM',
    type: 'Partnership',
    tags: ['Partnership'],
    status: 'upcoming',
    notes: 'Partnership discussion and planning.'
  },
  {
    id: '4',
    title: 'Next Intro',
    participants: [
      { id: '1', name: 'George', email: 'george@pixelsync.io', company: 'PixelSync', title: 'Product Manager' },
      { id: '5', name: 'Alex', email: 'alex@next.com', company: 'NextGen', title: 'CTO' }
    ],
    date: '2025-08-18', // Monday, 18th
    time: '3:00 PM',
    type: 'Development',
    tags: ['Development'],
    status: 'upcoming',
    notes: 'Introduction and technical discussion.'
  },
  {
    id: '5',
    title: 'Sales Call',
    participants: [
      { id: '1', name: 'George', email: 'george@pixelsync.io', company: 'PixelSync', title: 'Product Manager' },
      { id: '6', name: 'Emma', email: 'emma@sales.com', company: 'SalesCorp', title: 'Sales Manager' }
    ],
    date: '2025-08-21', // Thursday, 21st
    time: '1:00 PM',
    type: 'Sales',
    tags: ['Sales'],
    status: 'upcoming',
    notes: 'Sales presentation and demo.'
  },
  {
    id: '6',
    title: 'Call with Mat',
    participants: [
      { id: '1', name: 'George', email: 'george@pixelsync.io', company: 'PixelSync', title: 'Product Manager' },
      { id: '7', name: 'Mat', email: 'mat@design.com', company: 'DesignStudio', title: 'Designer' }
    ],
    date: '2025-08-25', // Monday, 25th
    time: '4:00 PM',
    type: 'Design',
    tags: ['Design'],
    status: 'upcoming',
    notes: 'Design review and feedback session.'
  },
  {
    id: '7',
    title: 'Holiday Party',
    participants: [
      { id: '1', name: 'George', email: 'george@pixelsync.io', company: 'PixelSync', title: 'Product Manager' }
    ],
    date: '2025-08-26', // Tuesday, 26th
    time: '6:00 PM',
    type: 'Holiday',
    tags: ['Holiday'],
    status: 'upcoming',
    notes: 'Company holiday celebration.'
  },
  {
    id: '8',
    title: 'Call John > Trip',
    participants: [
      { id: '1', name: 'George', email: 'george@pixelsync.io', company: 'PixelSync', title: 'Product Manager' },
      { id: '8', name: 'John', email: 'john@travel.com', company: 'TravelCorp', title: 'Manager' }
    ],
    date: '2025-08-27', // Wednesday, 27th
    time: '9:00 AM',
    type: 'Personal',
    tags: ['Personal'],
    status: 'upcoming',
    notes: 'Discussion about upcoming business trip.'
  }
];

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
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 1)); // August 2025
  const [meetings, setMeetings] = useState<Meeting[]>(sampleMeetings);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'Month' | 'Week' | 'Day' | 'List'>('Month');
  const [draggedMeeting, setDraggedMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    // Any initialization logic can go here
  }, []);

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
    let dateMeetings = meetings.filter(meeting => meeting.date === dateKey);
    
    // Apply active filter
    if (activeFilter !== 'all') {
      dateMeetings = dateMeetings.filter(meeting => 
        meeting.type.toLowerCase() === activeFilter.toLowerCase() ||
        meeting.tags.some(tag => tag.toLowerCase() === activeFilter.toLowerCase())
      );
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();
    
    if (!draggedMeeting) return;

    // Update meeting date
    setMeetings(prevMeetings =>
      prevMeetings.map(meeting =>
        meeting.id === draggedMeeting.id
          ? { ...meeting, date: targetDate }
          : meeting
      )
    );
    
    setDraggedMeeting(null);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-pixel-text">Calendar</h1>
            <button className="pixel-button bg-pixel-primary text-white flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Meeting
            </button>
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
        <div className="bg-pixel-surface border-2 border-pixel-border shadow-retro">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b-2 border-pixel-border">
            {daysOfWeek.map((day) => (
              <div key={day} className="p-3 text-center font-medium text-pixel-text-light bg-pixel-sidebar border-r-2 border-pixel-border last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((date, index) => {
              const dateKey = formatDateKey(date);
              const dayMeetings = getMeetingsForDate(date);
              const isCurrentMonthDay = isCurrentMonth(date);
              const isTodayDate = isToday(date);

              return (
                <div
                  key={dateKey}
                  className={`min-h-[120px] p-2 border-r-2 border-b-2 border-pixel-border last:border-r-0 bg-pixel-surface ${!isCurrentMonthDay ? 'opacity-40' : ''} transition-colors`}
                  style={{
                    borderBottomWidth: Math.floor(index / 7) === 5 ? 0 : '2px'
                  }}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, dateKey)}
                >
                  {/* Date Number */}
                  <div className={`text-sm font-medium mb-1 ${
                    isTodayDate 
                      ? 'bg-pixel-primary text-white w-6 h-6 flex items-center justify-center border-2 border-pixel-primary' 
                      : isCurrentMonthDay ? 'text-pixel-text' : 'text-pixel-muted'
                  }`}>
                    {date.getDate()}
                  </div>

                  {/* Meetings */}
                  <div className="space-y-1">
                    {dayMeetings.map((meeting) => (
                      <CalendarEventCard
                        key={meeting.id}
                        meeting={meeting}
                        onClick={() => setSelectedMeeting(meeting)}
                        onDragStart={handleDragStart}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Meeting Modal */}
        <MeetingModal
          meeting={selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
        />
      </div>
    </div>
  );
}