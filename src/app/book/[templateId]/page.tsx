'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

// Helper function to convert hex color to rgba
const hexToRgba = (hex: string, alpha: number) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Sample time slots
const timeSlots = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

// Sample design settings - in real app, fetch from database based on templateId
const defaultDesignSettings = {
  pageBackgroundColor: '#f8fafc',
  backgroundColor: '#ffffff',
  calendarBackgroundColor: '#ffffff',
  timeSlotButtonColor: '#ffffff',
  primaryColor: '#3b82f6',
  textColor: '#1e293b',
  calendarTextColor: '#1e293b',
  fontFamily: 'font-montserrat',
  fontWeight: '400',
  borderRadius: '8px',
  calendarBorderRadius: '8px',
  buttonBorderRadius: '8px',
  eventTitle: 'Event title',
  duration: '30 min',
  durationMinutes: 30,
  timezone: 'America/New_York',
  description: 'Web conferencing details provided upon confirmation.',
  showAvatar: true,
  avatarUrl: '/api/placeholder/60/60',
  coverPhoto: '',
  showCoverPhoto: false,
  customTextComponents: [],
  accordionComponents: []
};

export default function BookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  
  const [currentDate, setCurrentDate] = useState(new Date()); // Current month/year
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Details, 3: Confirmation
  const [designSettings, setDesignSettings] = useState(defaultDesignSettings);
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([]);
  const [userTimezone, setUserTimezone] = useState<string>('America/New_York'); // User's preferred timezone for viewing
  const [isClient, setIsClient] = useState(false);
  // Form data for booking - moved to top level with other hooks
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Ensure component is hydrated
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load design settings from sessionStorage for preview mode
  useEffect(() => {
    if (isClient && isPreview && typeof window !== 'undefined') {
      try {
        const storedSettings = sessionStorage.getItem('previewDesignSettings');
        console.log('Preview mode - stored settings:', storedSettings);
        if (storedSettings) {
          const parsed = JSON.parse(storedSettings);
          console.log('Preview mode - parsed settings:', parsed);
          console.log('Preview mode - primary color:', parsed.primaryColor);
          // Properly merge settings to avoid overwriting important defaults
          setDesignSettings(prev => ({
            ...prev,
            ...parsed,
            // Ensure these arrays exist even if not in stored settings
            customTextComponents: parsed.customTextComponents || [],
            accordionComponents: parsed.accordionComponents || []
          }));
        }
      } catch (e) {
        console.error('Failed to parse design settings from sessionStorage:', e);
      }
    }
  }, [isClient, isPreview]);

  // Show loading while hydrating
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - (firstDay.getDay() || 7) + 1);
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const handleBooking = () => {
    // TODO: Submit booking to database
    console.log('Booking submitted:', {
      templateId: params.templateId,
      date: selectedDate,
      time: selectedTime,
      ...formData
    });
    setStep(3);
  };

  const toggleAccordion = (id: string) => {
    setExpandedAccordions(prev =>
      prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]
    );
  };

  const getTimezoneDisplay = (timezone: string) => {
    const timezoneMap = {
      'America/New_York': 'Eastern Time (ET)',
      'America/Chicago': 'Central Time (CT)',
      'America/Denver': 'Mountain Time (MT)',
      'America/Los_Angeles': 'Pacific Time (PT)',
      'Europe/London': 'London (GMT)',
      'Europe/Paris': 'Paris (CET)',
      'Europe/Berlin': 'Berlin (CET)',
      'Asia/Tokyo': 'Tokyo (JST)',
      'Asia/Shanghai': 'Shanghai (CST)',
      'Asia/Dubai': 'Dubai (GST)',
      'Australia/Sydney': 'Sydney (AEDT)',
      'UTC': 'UTC'
    };
    return timezoneMap[timezone] || timezone;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: designSettings.pageBackgroundColor,
              }}
    >
      {/* Preview Banner */}
      {isPreview && (
        <div className="bg-pixel-warning text-white px-4 py-2 text-center text-sm font-medium">
          🔍 Preview Mode - This is how your booking page looks to visitors
          <Link href="/scheduling" className="ml-4 underline hover:no-underline">
            ← Back to Editor
          </Link>
        </div>
      )}

      {/* Cover Photo - Same width as content */}
      {designSettings.coverPhoto && (
        <div className="max-w-6xl mx-auto px-6 mb-0">
          <img 
            src={designSettings.coverPhoto} 
            alt="Cover" 
            className="w-full h-64 object-cover"
            style={{ borderRadius: designSettings.borderRadius }}
          />
        </div>
      )}

      <div className="min-h-screen px-6 pb-6">
        <div 
          className="max-w-6xl mx-auto backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8"
          style={{ backgroundColor: designSettings.backgroundColor }}
        >
          {/* Step 1: Date & Time Selection */}
          {step === 1 && (
            <div className="grid lg:grid-cols-4 gap-12 h-full">
              {/* Left Column - Event Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Header */}
                <div>
                  {designSettings.showAvatar && (
                    <div 
                      className="w-20 h-20 bg-gray-200 border-2 border-gray-300 flex items-center justify-center mb-6 overflow-hidden shadow-lg"
                      style={{ borderRadius: designSettings.borderRadius }}
                    >
                      {designSettings.avatarUrl ? (
                        <img src={designSettings.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-600 font-bold text-2xl">😊</span>
                      )}
                    </div>
                  )}
                  <h1 
                    className={`text-3xl font-bold mb-4 ${designSettings.fontFamily}`}
                    style={{ 
                      color: designSettings.textColor,
                      fontWeight: designSettings.fontWeight
                    }}
                  >
                    {designSettings.eventTitle}
                  </h1>
                  
                  <div className="space-y-3 mb-6">
                    <div className={`flex items-center gap-3 text-base ${designSettings.fontFamily}`} style={{ color: designSettings.textColor, fontWeight: designSettings.fontWeight }}>
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">{designSettings.duration}</span>
                    </div>
                    <div className={`flex items-center gap-3 text-base ${designSettings.fontFamily}`} style={{ color: designSettings.textColor, fontWeight: designSettings.fontWeight }}>
                      <Calendar className="w-5 h-5" />
                      <span className="font-medium">Web Meeting • {getTimezoneDisplay(designSettings.timezone)}</span>
                    </div>
                  </div>
                  
                  <p className={`text-base leading-relaxed ${designSettings.fontFamily}`} style={{ color: designSettings.textColor, fontWeight: designSettings.fontWeight }}>
                    {designSettings.description}
                  </p>
                </div>

                {/* Custom Text Components */}
                {designSettings.customTextComponents && designSettings.customTextComponents.length > 0 && (
                  <div className="space-y-5">
                    {designSettings.customTextComponents
                      .filter(textComp => textComp.text && textComp.text.trim() !== '')
                      .map((textComp) => (
                      <div key={textComp.id} className="p-4 rounded-lg border-l-4 border-transparent" style={{ backgroundColor: 'transparent' }}>
                        <p 
                          className={`leading-relaxed ${designSettings.fontFamily}`}
                          style={{
                            color: textComp.color,
                            fontSize: textComp.fontSize,
                            fontWeight: textComp.fontWeight
                          }}
                        >
                          {textComp.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Accordion Components */}
                {designSettings.accordionComponents && designSettings.accordionComponents.length > 0 && (
                  <div className="space-y-4">
                    {designSettings.accordionComponents
                      .filter(accordion => accordion.title && accordion.title.trim() !== '' && accordion.content && accordion.content.trim() !== '')
                      .map((accordion) => (
                      <div key={accordion.id}>
                        <div 
                          className="border border-gray-200 overflow-hidden transition-all duration-200"
                          style={{ 
                            borderRadius: designSettings.borderRadius,
                            backgroundColor: 'transparent'
                          }}
                        >
                          <button
                            onClick={() => toggleAccordion(accordion.id)}
                            className={`w-full p-4 text-left flex items-center justify-between transition-colors text-base font-medium ${designSettings.fontFamily}`}
                            style={{ 
                              color: designSettings.textColor
                            }}
                          >
                            <span>{accordion.title}</span>
                            {expandedAccordions.includes(accordion.id) ? (
                              <ChevronUp className="w-5 h-5 transition-transform duration-200" />
                            ) : (
                              <ChevronDown className="w-5 h-5 transition-transform duration-200" />
                            )}
                          </button>
                          {expandedAccordions.includes(accordion.id) && (
                            <div className="p-4 border-t border-gray-200 animate-fade-in" style={{ backgroundColor: 'transparent' }}>
                              <p 
                                className="text-base leading-relaxed" 
                                style={{ 
                                  color: designSettings.textColor,
                                                                }}
                              >
                                {accordion.content}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column - Calendar & Time Selection */}
              <div className="lg:col-span-3">
                <div>
                  <div className="flex gap-8 h-full">
                    {/* Calendar - Much Larger */}
                    <div className="flex-1">
                      <h2 
                        className={`text-2xl font-bold mb-6 ${designSettings.fontFamily}`}
                        style={{ 
                          color: designSettings.textColor || '#000000',
                          fontWeight: designSettings.fontWeight || 'bold'
                        }}
                      >
                        Select a Date & Time
                      </h2>
                      
                      <div 
                        className="rounded-xl shadow-sm border border-gray-100"
                        style={{ 
                          backgroundColor: designSettings.calendarBackgroundColor
                        }}
                      >
                        {/* Calendar Header */}
                        <div 
                          className={`flex items-center justify-between p-6 ${designSettings.fontFamily}`}
                          style={{ 
                            color: designSettings.calendarTextColor
                          }}
                        >
                          <button
                            onClick={() => navigateMonth('prev')}
                            className="p-2 hover:bg-gray-100 transition-colors rounded-full"
                            style={{ 
                              borderRadius: designSettings.buttonBorderRadius,
                              color: designSettings.calendarTextColor 
                            }}
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <h3 
                            className="font-bold text-xl"
                            style={{ 
                              color: designSettings.calendarTextColor,
                              fontWeight: designSettings.fontWeight,
                                                          }}
                          >
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                          </h3>
                          <button
                            onClick={() => navigateMonth('next')}
                            className="p-2 hover:bg-gray-100 transition-colors rounded-full"
                            style={{ 
                              borderRadius: designSettings.buttonBorderRadius,
                              color: designSettings.calendarTextColor 
                            }}
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </div>

                        {/* Days of Week */}
                        <div className="grid grid-cols-7 pb-2">
                          {daysOfWeek.map((day) => (
                            <div 
                              key={day} 
                              className={`p-4 text-center text-sm font-semibold ${designSettings.fontFamily}`}
                              style={{ 
                                color: designSettings.calendarTextColor,
                                fontWeight: designSettings.fontWeight
                              }}
                            >
                              {day}
                            </div>
                          ))}
                        </div>

                        {/* Calendar Grid - Larger cells */}
                        <div className="grid grid-cols-7">
                          {calendarDays.slice(0, 35).map((date, index) => {
                            const dayNum = date.getDate();
                            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                            const isSelected = dayNum === selectedDate && isCurrentMonth;
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const dateToCompare = new Date(date);
                            dateToCompare.setHours(0, 0, 0, 0);
                            const isPast = dateToCompare < today;

                            return (
                              <button
                                key={index}
                                onClick={() => {
                                  if (isCurrentMonth && !isPast) {
                                    setSelectedDate(dayNum);
                                  }
                                }}
                                disabled={isPast || !isCurrentMonth}
                                className={`text-base font-medium hover:bg-gray-50 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center ${designSettings.fontFamily} ${
                                  !isCurrentMonth ? 'opacity-40' : ''
                                } ${isSelected ? 'text-white' : ''}`}
                                style={{
                                  width: '44px',
                                  height: '44px',
                                  borderRadius: '50%',
                                  margin: '8px auto',
                                  backgroundColor: isSelected ? designSettings.primaryColor : 'transparent',
                                  color: isSelected ? 'white' : designSettings.calendarTextColor,
                                  fontWeight: designSettings.fontWeight
                                }}
                              >
                                {dayNum}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Time Slots - Always visible with beautiful design */}
                    <div className="w-72">
                      <h3 
                        className={`text-2xl font-bold mb-6 ${designSettings.fontFamily}`}
                        style={{ 
                          color: designSettings.textColor,
                          fontWeight: designSettings.fontWeight
                        }}
                      >
                        Pick a Time
                      </h3>

                      {/* Timezone Selector for User */}
                      <div className="mb-4">
                        <label 
                          className={`block text-lg font-medium mb-2 ${designSettings.fontFamily}`}
                          style={{ 
                            color: designSettings.calendarTextColor,
                            fontWeight: designSettings.fontWeight 
                          }}
                        >
                          View times in:
                        </label>
                        <select
                          value={userTimezone}
                          onChange={(e) => setUserTimezone(e.target.value)}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md ${designSettings.fontFamily} focus:ring-2 focus:border-transparent transition-all duration-200`}
                          style={{
                            backgroundColor: designSettings.calendarBackgroundColor,
                            color: designSettings.calendarTextColor,
                            fontWeight: designSettings.fontWeight,
                            borderRadius: designSettings.buttonBorderRadius,
                            focusRingColor: designSettings.primaryColor
                          }}
                        >
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                          <option value="Europe/London">London (GMT)</option>
                          <option value="Europe/Paris">Paris (CET)</option>
                          <option value="Europe/Berlin">Berlin (CET)</option>
                          <option value="Asia/Tokyo">Tokyo (JST)</option>
                          <option value="Asia/Shanghai">Shanghai (CST)</option>
                          <option value="Asia/Dubai">Dubai (GST)</option>
                          <option value="Australia/Sydney">Sydney (AEDT)</option>
                          <option value="UTC">UTC</option>
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <p 
                          className={`text-lg font-medium ${designSettings.fontFamily}`}
                          style={{ 
                            color: designSettings.textColor,
                            fontWeight: designSettings.fontWeight
                          }}
                        >
                          {selectedDate 
                            ? `${monthNames[currentDate.getMonth()]} ${selectedDate}, ${currentDate.getFullYear()}`
                            : "Select a date to see available times"
                          }
                        </p>
                      </div>
                      
                      <div className="custom-scrollbar space-y-1 max-h-96 overflow-y-auto pr-2">
                        {timeSlots.map((time) => {
                          // Debug logging for primary color
                          if (time === '12:00') {
                            console.log('Time slot button - primaryColor:', designSettings.primaryColor);
                            console.log('Time slot button - selectedTime:', selectedTime);
                          }
                          return (
                          <button
                            key={time}
                            onClick={() => selectedDate && setSelectedTime(time)}
                            disabled={!selectedDate}
                            className={`w-full px-2 py-1.5 text-xs font-medium text-center border transition-all duration-200 ${designSettings.fontFamily} ${
                              !selectedDate 
                                ? 'opacity-50 cursor-not-allowed'
                                : selectedTime === time
                                  ? 'shadow-sm'
                                  : 'hover:shadow-sm'
                            }`}
                            style={{
                              borderRadius: designSettings.buttonBorderRadius,
                              fontWeight: designSettings.fontWeight,
                              color: !selectedDate 
                                ? '#9ca3af' 
                                : selectedTime === time 
                                  ? '#ffffff'
                                  : designSettings.textColor,
                              backgroundColor: !selectedDate 
                                ? '#f9fafb'
                                : selectedTime === time 
                                  ? designSettings.primaryColor
                                  : designSettings.calendarBackgroundColor,
                              borderColor: !selectedDate 
                                ? '#e5e7eb'
                                : selectedTime === time 
                                  ? designSettings.primaryColor
                                  : '#e5e7eb',
                              boxShadow: selectedTime === time && selectedDate
                                ? `0 4px 12px ${hexToRgba(designSettings.primaryColor, 0.3)}`
                                : 'none'
                            }}
                          >
                            {time}
                          </button>
                          );
                        })}
                      </div>
                      
                      {selectedDate && selectedTime && (
                        <button
                          onClick={() => setStep(2)}
                          className={`w-full mt-8 px-8 py-4 text-white text-lg font-bold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] shadow-lg ${designSettings.fontFamily}`}
                          style={{
                            backgroundColor: designSettings.primaryColor,
                            borderRadius: designSettings.buttonBorderRadius,
                            fontWeight: designSettings.fontWeight,
                            boxShadow: `0 6px 20px ${designSettings.primaryColor}40`
                          }}
                        >
                          Continue to Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Details */}
          {step === 2 && (
            <div className="grid lg:grid-cols-4 gap-12 h-full">
              {/* Left Column - Event Info (same as step 1) */}
              <div className="lg:col-span-1 space-y-6">
                {/* Header */}
                <div>
                  {designSettings.showAvatar && (
                    <div 
                      className="w-20 h-20 bg-gray-200 border-2 border-gray-300 flex items-center justify-center mb-6 overflow-hidden shadow-lg"
                      style={{ borderRadius: designSettings.borderRadius }}
                    >
                      {designSettings.avatarUrl ? (
                        <img src={designSettings.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-600 font-bold text-2xl">😊</span>
                      )}
                    </div>
                  )}
                  <h1 
                    className={`text-3xl font-bold mb-4 ${designSettings.fontFamily}`}
                    style={{ 
                      color: designSettings.textColor,
                      fontWeight: designSettings.fontWeight
                    }}
                  >
                    {designSettings.eventTitle}
                  </h1>
                  
                  <div className="space-y-3 mb-6">
                    <div className={`flex items-center gap-3 text-base ${designSettings.fontFamily}`} style={{ color: designSettings.textColor, fontWeight: designSettings.fontWeight }}>
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">{designSettings.duration}</span>
                    </div>
                    <div className={`flex items-center gap-3 text-base ${designSettings.fontFamily}`} style={{ color: designSettings.textColor, fontWeight: designSettings.fontWeight }}>
                      <Calendar className="w-5 h-5" />
                      <span className="font-medium">Web Meeting • {getTimezoneDisplay(designSettings.timezone)}</span>
                    </div>
                  </div>
                  
                  <p className={`text-base leading-relaxed ${designSettings.fontFamily}`} style={{ color: designSettings.textColor, fontWeight: designSettings.fontWeight }}>
                    {designSettings.description}
                  </p>
                </div>

                {/* Custom Text Components */}
                {designSettings.customTextComponents && designSettings.customTextComponents.length > 0 && (
                  <div className="space-y-5">
                    {designSettings.customTextComponents
                      .filter(textComp => textComp.text && textComp.text.trim() !== '')
                      .map((textComp) => (
                      <div key={textComp.id} className="p-4 rounded-lg border-l-4 border-transparent" style={{ backgroundColor: 'transparent' }}>
                        <p 
                          className={`leading-relaxed ${designSettings.fontFamily}`}
                          style={{
                            color: textComp.color,
                            fontSize: textComp.fontSize,
                            fontWeight: textComp.fontWeight
                          }}
                        >
                          {textComp.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Accordion Components */}
                {designSettings.accordionComponents && designSettings.accordionComponents.length > 0 && (
                  <div className="space-y-4">
                    {designSettings.accordionComponents
                      .filter(accordion => accordion.title && accordion.title.trim() !== '' && accordion.content && accordion.content.trim() !== '')
                      .map((accordion) => (
                      <div key={accordion.id}>
                        <div 
                          className="border border-gray-200 overflow-hidden transition-all duration-200"
                          style={{ 
                            borderRadius: designSettings.borderRadius,
                            backgroundColor: 'transparent'
                          }}
                        >
                          <button
                            onClick={() => toggleAccordion(accordion.id)}
                            className={`w-full p-4 text-left flex items-center justify-between transition-colors text-base font-medium ${designSettings.fontFamily}`}
                            style={{ 
                              color: designSettings.textColor
                            }}
                          >
                            <span>{accordion.title}</span>
                            {expandedAccordions.includes(accordion.id) ? (
                              <ChevronUp className="w-5 h-5 transition-transform duration-200" />
                            ) : (
                              <ChevronDown className="w-5 h-5 transition-transform duration-200" />
                            )}
                          </button>
                          {expandedAccordions.includes(accordion.id) && (
                            <div className="p-4 border-t border-gray-200 animate-fade-in" style={{ backgroundColor: 'transparent' }}>
                              <p 
                                className="text-base leading-relaxed" 
                                style={{ 
                                  color: designSettings.textColor
                                }}
                              >
                                {accordion.content}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column - Contact Form */}
              <div className="lg:col-span-3">
                <div className="mb-8">
                  <button
                    onClick={() => setStep(1)}
                    className={`flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors ${designSettings.fontFamily}`}
                    style={{ 
                      borderRadius: designSettings.buttonBorderRadius,
                      fontWeight: designSettings.fontWeight
                    }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Date & Time
                  </button>
                </div>
              
                <h2 
                  className={`text-2xl font-bold mb-6 ${designSettings.fontFamily}`}
                  style={{ 
                    color: designSettings.textColor,
                    fontWeight: designSettings.fontWeight
                  }}
                >
                  Enter your details
                </h2>

                <div className="max-w-lg space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${designSettings.fontFamily}`} style={{ 
                      color: designSettings.textColor,
                      fontWeight: designSettings.fontWeight
                    }}>
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-3 py-2 border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors ${designSettings.fontFamily}`}
                      style={{ 
                        borderRadius: designSettings.buttonBorderRadius,
                        fontWeight: designSettings.fontWeight
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${designSettings.fontFamily}`} style={{ 
                      color: designSettings.textColor,
                      fontWeight: designSettings.fontWeight
                    }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-3 py-2 border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors ${designSettings.fontFamily}`}
                      style={{ 
                        borderRadius: designSettings.buttonBorderRadius,
                        fontWeight: designSettings.fontWeight
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${designSettings.fontFamily}`} style={{ 
                      color: designSettings.textColor,
                      fontWeight: designSettings.fontWeight
                    }}>
                      Additional Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      rows={3}
                      className={`w-full px-3 py-2 border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors resize-none ${designSettings.fontFamily}`}
                      style={{ 
                        borderRadius: designSettings.buttonBorderRadius,
                        fontWeight: designSettings.fontWeight
                      }}
                      placeholder="Anything you'd like to share before the meeting?"
                    />
                  </div>

                  <div className="pt-4">
                    <p className={`text-sm text-gray-600 mb-4 ${designSettings.fontFamily}`} style={{ fontWeight: designSettings.fontWeight }}>
                      <strong>Booking Summary:</strong><br />
                      {monthNames[currentDate.getMonth()]} {selectedDate}, {currentDate.getFullYear()} at {selectedTime}<br />
                      {designSettings.duration} meeting
                    </p>
                    
                    <button
                      onClick={handleBooking}
                      disabled={!formData.name || !formData.email}
                      className={`w-full px-6 py-3 text-white font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${designSettings.fontFamily}`}
                      style={{
                        backgroundColor: designSettings.primaryColor,
                        borderRadius: designSettings.buttonBorderRadius,
                        fontWeight: designSettings.fontWeight
                      }}
                    >
                      Confirm Booking
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="max-w-md mx-auto text-center">
              <div className="mb-6">
                <div 
                  className="w-16 h-16 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
                  style={{
                    backgroundColor: designSettings.primaryColor,
                    borderRadius: designSettings.borderRadius === '0px' ? '0px' : '50%'
                  }}
                >
                  ✓
                </div>
                <h2 
                  className="text-2xl font-bold mb-4"
                  style={{ 
                    color: designSettings.textColor,
                    fontWeight: designSettings.fontWeight
                  }}
                >
                  Booking Confirmed!
                </h2>
                <p className="text-gray-600 mb-4">
                  Your meeting has been scheduled for:<br />
                  <strong>{monthNames[currentDate.getMonth()]} {selectedDate}, {currentDate.getFullYear()} at {selectedTime}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  A confirmation email has been sent to {formData.email}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}