'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Clock, Calendar, Type, Palette, Image as ImageIcon, Edit, Plus, Trash2, ChevronDown, ChevronUp, Upload } from 'lucide-react';

interface CustomTextComponent {
  id: string;
  text: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  alignment: 'left' | 'center' | 'right';
}

interface AccordionComponent {
  id: string;
  title: string;
  content: string;
  isExpanded: boolean;
}

interface SchedulingPageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  templateId?: string;
  onSave?: (settings: any) => void;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

// Sample time slots
const timeSlots = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'];

// Font families available
const fontFamilies = [
  { name: 'Montserrat', value: 'font-montserrat' },
  { name: 'Roboto', value: 'font-roboto' },
  { name: 'Poppins', value: 'font-poppins' },
  { name: 'Lato', value: 'font-lato' },
  { name: 'Open Sans', value: 'font-open-sans' },
  { name: 'Dancing Script', value: 'font-dancing' },
  { name: 'Pacifico', value: 'font-pacifico' },
  { name: 'Caveat', value: 'font-caveat' },
  { name: 'Kalam', value: 'font-kalam' },
  { name: 'Architects Daughter', value: 'font-architects' },
  { name: 'Playfair Display', value: 'font-playfair' },
  { name: 'Merriweather', value: 'font-merriweather' },
  { name: 'Crimson Text', value: 'font-crimson' },
  { name: 'Fira Code', value: 'font-fira' },
  { name: 'Source Code Pro', value: 'font-source' },
  { name: 'Pixel (Monospace)', value: 'font-pixel' }
];

export default function SchedulingPageEditor({ isOpen, onClose, templateId, onSave }: SchedulingPageEditorProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 3, 1)); // April 2024
  const [selectedDate, setSelectedDate] = useState(24); // 24th selected
  const [selectedTimes, setSelectedTimes] = useState<string[]>(['14:00']);
  const [activeTab, setActiveTab] = useState('design');

  // Design customization state with improved color controls
  const [designSettings, setDesignSettings] = useState({
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
    customTextComponents: [] as CustomTextComponent[],
    accordionComponents: [] as AccordionComponent[]
  });

  const [editingComponent, setEditingComponent] = useState<string | null>(null);
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (onSave) {
      onSave(designSettings);
    }
    console.log('Saving design settings:', designSettings);
  };

  const handlePreview = () => {
    // Store design settings in sessionStorage for preview
    console.log('Editor - Saving settings to sessionStorage:', designSettings);
    console.log('Editor - Primary color being saved:', designSettings.primaryColor);
    sessionStorage.setItem('previewDesignSettings', JSON.stringify(designSettings));
    
    // Open preview in new tab
    const previewUrl = `/book/${templateId || '1'}?preview=true`;
    window.open(previewUrl, '_blank');
  };

  const handleImageUpload = (type: 'avatar' | 'cover', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'avatar') {
          setDesignSettings(prev => ({ ...prev, avatarUrl: result }));
        } else {
          setDesignSettings(prev => ({ 
            ...prev, 
            coverPhoto: result,
            showCoverPhoto: true 
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addCustomTextComponent = () => {
    const newComponent: CustomTextComponent = {
      id: Date.now().toString(),
      text: 'New text component',
      fontSize: '16px',
      fontWeight: '400',
      color: designSettings.textColor,
      alignment: 'left'
    };
    setDesignSettings(prev => ({
      ...prev,
      customTextComponents: [...prev.customTextComponents, newComponent]
    }));
  };

  const updateCustomTextComponent = (id: string, updates: Partial<CustomTextComponent>) => {
    setDesignSettings(prev => ({
      ...prev,
      customTextComponents: prev.customTextComponents.map(comp =>
        comp.id === id ? { ...comp, ...updates } : comp
      )
    }));
  };

  const deleteCustomTextComponent = (id: string) => {
    setDesignSettings(prev => ({
      ...prev,
      customTextComponents: prev.customTextComponents.filter(comp => comp.id !== id)
    }));
  };

  const addAccordionComponent = () => {
    const newComponent: AccordionComponent = {
      id: Date.now().toString(),
      title: 'New FAQ',
      content: 'Your answer content goes here...',
      isExpanded: false
    };
    setDesignSettings(prev => ({
      ...prev,
      accordionComponents: [...prev.accordionComponents, newComponent]
    }));
  };

  const updateAccordionComponent = (id: string, updates: Partial<AccordionComponent>) => {
    setDesignSettings(prev => ({
      ...prev,
      accordionComponents: prev.accordionComponents.map(comp =>
        comp.id === id ? { ...comp, ...updates } : comp
      )
    }));
  };

  const deleteAccordionComponent = (id: string) => {
    setDesignSettings(prev => ({
      ...prev,
      accordionComponents: prev.accordionComponents.filter(comp => comp.id !== id)
    }));
  };

  const toggleAccordion = (id: string) => {
    setExpandedAccordions(prev =>
      prev.includes(id)
        ? prev.filter(accordionId => accordionId !== id)
        : [...prev, id]
    );
  };

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

  const calendarDays = generateCalendarDays();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="border-2 border-pixel-border shadow-retro-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: designSettings.pageBackgroundColor }}
      >
        {/* Header */}
        <div className="border-b-2 border-pixel-border p-4 flex items-center justify-between bg-pixel-sidebar">
          <div className="flex items-center gap-4">
            {designSettings.showAvatar && (
              <div 
                className="w-12 h-12 bg-gray-200 border-2 border-pixel-border flex items-center justify-center overflow-hidden"
                style={{ borderRadius: designSettings.borderRadius }}
              >
                {designSettings.avatarUrl ? (
                  <img src={designSettings.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-600 font-bold">😊</span>
                )}
              </div>
            )}
            <div>
              <h2 
                className="text-lg font-bold"
                style={{ 
                  color: designSettings.textColor,
                  fontFamily: designSettings.fontFamily,
                  fontWeight: designSettings.fontWeight
                }}
              >
                {designSettings.eventTitle}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreview}
              className="pixel-button bg-pixel-accent text-white px-4 py-2 text-sm"
            >
              Preview
            </button>
            <button
              onClick={handleSave}
              className="pixel-button bg-pixel-success text-white px-4 py-2 text-sm"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="text-pixel-text-light hover:text-pixel-text transition-colors p-1 hover:bg-pixel-surface border-2 border-transparent hover:border-pixel-border"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div 
          className="flex"
          style={{ backgroundColor: designSettings.pageBackgroundColor }}
        >
          {/* Main Content - Left Side */}
          <div 
            className={`flex-1 p-6 ${designSettings.fontFamily}`}
            style={{ 
              backgroundColor: designSettings.backgroundColor,
              borderRadius: designSettings.borderRadius,
              margin: '20px'
            }}
          >
            {/* Cover Photo */}
            {designSettings.showCoverPhoto && designSettings.coverPhoto && (
              <div className="mb-6">
                <img 
                  src={designSettings.coverPhoto} 
                  alt="Cover" 
                  className="w-full h-48 object-cover"
                  style={{ borderRadius: designSettings.borderRadius }}
                />
              </div>
            )}

            {/* Event Details */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2" style={{ color: designSettings.textColor }}>
                <Clock className="w-4 h-4" />
                <span className={`text-sm ${designSettings.fontFamily}`} style={{ fontWeight: designSettings.fontWeight }}>
                  {designSettings.duration}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-4" style={{ color: designSettings.textColor }}>
                <Calendar className="w-4 h-4" />
                <span className={`text-sm ${designSettings.fontFamily}`} style={{ fontWeight: designSettings.fontWeight }}>
                  {designSettings.description}
                </span>
              </div>
            </div>

            {/* Custom Text Components */}
            {designSettings.customTextComponents.map((component) => (
              <div
                key={component.id}
                className={`mb-4 ${designSettings.fontFamily}`}
                style={{
                  fontSize: component.fontSize,
                  fontWeight: component.fontWeight,
                  color: component.color,
                  textAlign: component.alignment
                }}
              >
                {component.text}
              </div>
            ))}

            {/* Accordion Components */}
            {designSettings.accordionComponents.map((accordion) => (
              <div key={accordion.id} className="mb-4 border-2 border-pixel-border" style={{ borderRadius: designSettings.borderRadius }}>
                <button
                  onClick={() => toggleAccordion(accordion.id)}
                  className={`w-full p-4 flex items-center justify-between bg-pixel-surface hover:bg-pixel-border transition-colors ${designSettings.fontFamily}`}
                  style={{ 
                    borderRadius: expandedAccordions.includes(accordion.id) ? `${designSettings.borderRadius} ${designSettings.borderRadius} 0 0` : designSettings.borderRadius,
                    color: designSettings.textColor,
                    fontWeight: designSettings.fontWeight
                  }}
                >
                  <span>{accordion.title}</span>
                  {expandedAccordions.includes(accordion.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedAccordions.includes(accordion.id) && (
                  <div 
                    className={`p-4 border-t-2 border-pixel-border bg-pixel-surface ${designSettings.fontFamily}`}
                    style={{ 
                      color: designSettings.textColor,
                      fontWeight: designSettings.fontWeight
                    }}
                  >
                    {accordion.content}
                  </div>
                )}
              </div>
            ))}

            {/* Date Selection */}
            <div className="mb-6">
              <h3 
                className={`font-bold mb-4 ${designSettings.fontFamily}`}
                style={{ 
                  color: designSettings.textColor,
                  fontWeight: designSettings.fontWeight
                }}
              >
                Select a Date & Time
              </h3>
              
              {/* Calendar */}
              <div 
                className="rounded-xl shadow-sm border border-gray-100 mb-4"
                style={{ 
                  backgroundColor: designSettings.calendarBackgroundColor
                }}
              >
                {/* Calendar Header */}
                <div 
                  className={`flex items-center justify-between p-3 ${designSettings.fontFamily}`}
                  style={{ 
                    color: designSettings.calendarTextColor,
                    fontWeight: designSettings.fontWeight
                  }}
                >
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-1 hover:bg-gray-100 transition-colors"
                    style={{ 
                      borderRadius: designSettings.buttonBorderRadius,
                      color: designSettings.calendarTextColor 
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h4 
                    className={`font-bold ${designSettings.fontFamily}`}
                    style={{ 
                      color: designSettings.calendarTextColor,
                      fontWeight: designSettings.fontWeight
                    }}
                  >
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h4>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-1 hover:bg-gray-100 transition-colors"
                    style={{ 
                      borderRadius: designSettings.buttonBorderRadius,
                      color: designSettings.calendarTextColor 
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Days of Week */}
                <div className="grid grid-cols-7 pb-2">
                  {daysOfWeek.map((day) => (
                    <div 
                      key={day} 
                      className={`p-2 text-center text-xs font-medium ${designSettings.fontFamily}`}
                      style={{ 
                        color: designSettings.calendarTextColor,
                        fontWeight: designSettings.fontWeight
                      }}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7">
                  {calendarDays.slice(0, 35).map((date, index) => {
                    const dayNum = date.getDate();
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                    const isSelected = dayNum === selectedDate && isCurrentMonth;
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isPast = date < new Date();

                    return (
                      <button
                        key={index}
                        onClick={() => {
                          if (isCurrentMonth && !isPast) {
                            setSelectedDate(dayNum);
                          }
                        }}
                        disabled={isPast || !isCurrentMonth}
                        className={`text-xs hover:bg-gray-50 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30 flex items-center justify-center ${designSettings.fontFamily} ${
                          !isCurrentMonth ? 'opacity-40' : ''
                        } ${isSelected ? 'text-white' : ''}`}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          margin: '4px auto',
                          backgroundColor: isSelected ? designSettings.primaryColor : (isToday && !isSelected ? '#64748b' : 'transparent'),
                          color: isSelected ? 'white' : (isToday && !isSelected ? 'white' : designSettings.calendarTextColor),
                          fontWeight: designSettings.fontWeight
                        }}
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-3 gap-1 mb-4">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => {
                      setSelectedTimes(prev => 
                        prev.includes(time) 
                          ? prev.filter(t => t !== time)
                          : [...prev, time]
                      );
                    }}
                    className={`py-1 px-2 text-xs border-2 border-pixel-border hover:bg-pixel-border transition-colors ${
                      selectedTimes.includes(time) ? 'bg-pixel-primary text-white' : 'bg-pixel-surface'
                    } ${designSettings.fontFamily}`}
                    style={{ 
                      borderRadius: designSettings.buttonBorderRadius,
                      backgroundColor: selectedTimes.includes(time) ? designSettings.primaryColor : designSettings.calendarBackgroundColor,
                      fontWeight: designSettings.fontWeight
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Time Selection & Customization */}
          <div className="w-80 border-l-2 border-pixel-border bg-pixel-sidebar custom-scrollbar overflow-y-auto">
            {/* Selected Date */}
            <div className="p-4 border-b-2 border-pixel-border">
              <div className="text-sm font-medium text-pixel-text">
                {selectedDate ? `${monthNames[currentDate.getMonth()]} ${selectedDate}, ${currentDate.getFullYear()}` : 'Select a date'}
              </div>
            </div>

            {/* Design & Content Controls */}
            <div className="p-4 space-y-4">
              {/* Tab Navigation */}
              <div className="flex border-2 border-pixel-border">
                {(['design', 'content', 'media', 'components'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-2 py-2 text-xs font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-pixel-primary text-white'
                        : 'bg-pixel-surface text-pixel-text hover:bg-pixel-border'
                    }`}
                  >
                    {tab === 'design' && '🎨'}
                    {tab === 'content' && '📝'}
                    {tab === 'media' && '🖼️'}
                    {tab === 'components' && '⚡'}
                  </button>
                ))}
              </div>

              {/* Design Controls */}
              {activeTab === 'design' && (
                <div className="space-y-3">
                  {/* Typography */}
                  <div>
                    <label className="block text-xs font-medium text-pixel-text-light mb-2">Font Family</label>
                    <select
                      value={designSettings.fontFamily}
                      onChange={(e) => setDesignSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                      className="w-full px-2 py-1 border-2 border-pixel-border text-xs"
                    >
                      {fontFamilies.map(font => (
                        <option 
                          key={font.value} 
                          value={font.value}
                          className={font.value}
                          style={{ fontFamily: font.name === 'Pixel (Monospace)' ? 'monospace' : font.name }}
                        >
                          {font.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-pixel-text-light mb-2">Font Weight</label>
                    <select
                      value={designSettings.fontWeight}
                      onChange={(e) => setDesignSettings(prev => ({ ...prev, fontWeight: e.target.value }))}
                      className="w-full px-2 py-1 border-2 border-pixel-border text-xs"
                    >
                      <option value="300">Light (300)</option>
                      <option value="400">Regular (400)</option>
                      <option value="500">Medium (500)</option>
                      <option value="600">Semi-Bold (600)</option>
                      <option value="700">Bold (700)</option>
                    </select>
                  </div>

                  {/* Colors */}
                  <div>
                    <label className="block text-xs font-medium text-pixel-text-light mb-1">Page Background</label>
                    <input
                      type="color"
                      value={designSettings.pageBackgroundColor}
                      onChange={(e) => setDesignSettings(prev => ({ ...prev, pageBackgroundColor: e.target.value }))}
                      className="w-full h-8 border-2 border-pixel-border"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-pixel-text-light mb-1">Main Container Background</label>
                    <input
                      type="color"
                      value={designSettings.backgroundColor}
                      onChange={(e) => setDesignSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-full h-8 border-2 border-pixel-border"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-pixel-text-light mb-1">Calendar Background</label>
                    <input
                      type="color"
                      value={designSettings.calendarBackgroundColor}
                      onChange={(e) => setDesignSettings(prev => ({ ...prev, calendarBackgroundColor: e.target.value }))}
                      className="w-full h-8 border-2 border-pixel-border"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-pixel-text-light mb-1">Primary Color</label>
                    <input
                      type="color"
                      value={designSettings.primaryColor}
                      onChange={(e) => setDesignSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-full h-8 border-2 border-pixel-border"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-pixel-text-light mb-1">Text Color</label>
                    <input
                      type="color"
                      value={designSettings.textColor}
                      onChange={(e) => setDesignSettings(prev => ({ ...prev, textColor: e.target.value }))}
                      className="w-full h-8 border-2 border-pixel-border"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-pixel-text-light mb-1">Calendar Text Color</label>
                    <input
                      type="color"
                      value={designSettings.calendarTextColor}
                      onChange={(e) => setDesignSettings(prev => ({ ...prev, calendarTextColor: e.target.value }))}
                      className="w-full h-8 border-2 border-pixel-border"
                    />
                  </div>

                  {/* Border Radius Controls */}
                  <div>
                    <label className="block text-xs font-medium text-pixel-text-light mb-1">General Border Radius</label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={parseInt(designSettings.borderRadius)}
                      onChange={(e) => setDesignSettings(prev => ({ ...prev, borderRadius: e.target.value + 'px' }))}
                      className="w-full"
                    />
                    <div className="text-xs text-pixel-text-light">{designSettings.borderRadius}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-pixel-text-light mb-1">Calendar Border Radius</label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={parseInt(designSettings.calendarBorderRadius)}
                      onChange={(e) => setDesignSettings(prev => ({ ...prev, calendarBorderRadius: e.target.value + 'px' }))}
                      className="w-full"
                    />
                    <div className="text-xs text-pixel-text-light">{designSettings.calendarBorderRadius}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-pixel-text-light mb-1">Button Border Radius</label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={parseInt(designSettings.buttonBorderRadius)}
                      onChange={(e) => setDesignSettings(prev => ({ ...prev, buttonBorderRadius: e.target.value + 'px' }))}
                      className="w-full"
                    />
                    <div className="text-xs text-pixel-text-light">{designSettings.buttonBorderRadius}</div>
                  </div>
                </div>
              )}

              {/* Content Controls */}
              {activeTab === 'content' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-pixel-text-light mb-1">Event Title</label>
                    <input
                      type="text"
                      value={designSettings.eventTitle}
                      onChange={(e) => setDesignSettings(prev => ({ ...prev, eventTitle: e.target.value }))}
                      className="w-full px-2 py-1 border-2 border-pixel-border text-xs"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-pixel-text-light mb-1">Meeting Duration</label>
                    <select
                      value={designSettings.durationMinutes}
                      onChange={(e) => {
                        const minutes = parseInt(e.target.value);
                        setDesignSettings(prev => ({ 
                          ...prev, 
                          durationMinutes: minutes,
                          duration: minutes < 60 ? `${minutes} min` : `${minutes / 60}h`
                        }));
                      }}
                      className="w-full px-2 py-1 border-2 border-pixel-border text-xs"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-pixel-text-light mb-1">Meeting Timezone</label>
                    <select
                      value={designSettings.timezone}
                      onChange={(e) => setDesignSettings(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-2 py-1 border-2 border-pixel-border text-xs"
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
                    <div className="text-xs text-pixel-text-light mt-1">This is the timezone for your meeting times</div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-pixel-text-light mb-1">Description</label>
                    <textarea
                      value={designSettings.description}
                      onChange={(e) => setDesignSettings(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-2 py-1 border-2 border-pixel-border text-xs resize-none"
                    />
                  </div>

                  {/* Avatar Settings */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-pixel-text-light mb-2">
                      <input
                        type="checkbox"
                        checked={designSettings.showAvatar}
                        onChange={(e) => setDesignSettings(prev => ({ ...prev, showAvatar: e.target.checked }))}
                        className="border-2 border-pixel-border"
                      />
                      Show Profile Picture
                    </label>
                  </div>
                </div>
              )}

              {/* Media Controls */}
              {activeTab === 'media' && (
                <div className="space-y-3">
                  {/* Profile Image Upload */}
                  <div>
                    <label className="block text-xs font-medium text-pixel-text-light mb-2">Profile Picture</label>
                    <div className="flex items-center gap-2">
                      {designSettings.avatarUrl && (
                        <img src={designSettings.avatarUrl} alt="Profile" className="w-8 h-8 object-cover border-2 border-pixel-border" style={{ borderRadius: designSettings.borderRadius }} />
                      )}
                      <label className="pixel-button-secondary cursor-pointer flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        <span className="text-xs">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload('avatar', e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Cover Photo Upload */}
                  <div>
                    <label className="block text-xs font-medium text-pixel-text-light mb-2">Cover Photo</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={designSettings.showCoverPhoto}
                          onChange={(e) => setDesignSettings(prev => ({ ...prev, showCoverPhoto: e.target.checked }))}
                          className="border-2 border-pixel-border"
                        />
                        Show Cover Photo
                      </label>
                      {designSettings.showCoverPhoto && (
                        <>
                          {designSettings.coverPhoto && (
                            <img src={designSettings.coverPhoto} alt="Cover" className="w-full h-20 object-cover border-2 border-pixel-border" style={{ borderRadius: designSettings.borderRadius }} />
                          )}
                          <label className="pixel-button-secondary cursor-pointer flex items-center gap-1 w-full justify-center">
                            <Upload className="w-3 h-3" />
                            <span className="text-xs">Upload Cover</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload('cover', e)}
                              className="hidden"
                            />
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Components Controls */}
              {activeTab === 'components' && (
                <div className="space-y-4">
                  {/* Custom Text Components */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-pixel-text-light">Custom Text</label>
                      <button
                        onClick={addCustomTextComponent}
                        className="pixel-button-secondary text-xs p-1"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                      {designSettings.customTextComponents.map((component) => (
                        <div key={component.id} className="border-2 border-pixel-border p-2 space-y-1">
                          {editingComponent === component.id ? (
                            <>
                              <input
                                type="text"
                                value={component.text}
                                onChange={(e) => updateCustomTextComponent(component.id, { text: e.target.value })}
                                className="w-full px-1 py-1 border border-pixel-border text-xs"
                                placeholder="Text content"
                              />
                              <div className="flex gap-1">
                                <select
                                  value={component.fontSize}
                                  onChange={(e) => updateCustomTextComponent(component.id, { fontSize: e.target.value })}
                                  className="flex-1 px-1 py-1 border border-pixel-border text-xs"
                                >
                                  <option value="12px">12px</option>
                                  <option value="14px">14px</option>
                                  <option value="16px">16px</option>
                                  <option value="18px">18px</option>
                                  <option value="20px">20px</option>
                                  <option value="24px">24px</option>
                                </select>
                                <select
                                  value={component.alignment}
                                  onChange={(e) => updateCustomTextComponent(component.id, { alignment: e.target.value as 'left' | 'center' | 'right' })}
                                  className="flex-1 px-1 py-1 border border-pixel-border text-xs"
                                >
                                  <option value="left">Left</option>
                                  <option value="center">Center</option>
                                  <option value="right">Right</option>
                                </select>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => setEditingComponent(null)}
                                  className="pixel-button text-xs p-1 flex-1"
                                >
                                  Done
                                </button>
                                <button
                                  onClick={() => deleteCustomTextComponent(component.id)}
                                  className="text-red-500 p-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-xs truncate">{component.text}</div>
                              <button
                                onClick={() => setEditingComponent(component.id)}
                                className="text-pixel-primary text-xs flex items-center gap-1"
                              >
                                <Edit className="w-3 h-3" />
                                Edit
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Accordion Components */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-pixel-text-light">FAQ/Accordion</label>
                      <button
                        onClick={addAccordionComponent}
                        className="pixel-button-secondary text-xs p-1"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                      {designSettings.accordionComponents.map((accordion) => (
                        <div key={accordion.id} className="border-2 border-pixel-border p-2 space-y-1">
                          {editingComponent === accordion.id ? (
                            <>
                              <input
                                type="text"
                                value={accordion.title}
                                onChange={(e) => updateAccordionComponent(accordion.id, { title: e.target.value })}
                                className="w-full px-1 py-1 border border-pixel-border text-xs"
                                placeholder="Question"
                              />
                              <textarea
                                value={accordion.content}
                                onChange={(e) => updateAccordionComponent(accordion.id, { content: e.target.value })}
                                rows={2}
                                className="w-full px-1 py-1 border border-pixel-border text-xs resize-none"
                                placeholder="Answer"
                              />
                              <div className="flex gap-1">
                                <button
                                  onClick={() => setEditingComponent(null)}
                                  className="pixel-button text-xs p-1 flex-1"
                                >
                                  Done
                                </button>
                                <button
                                  onClick={() => deleteAccordionComponent(accordion.id)}
                                  className="text-red-500 p-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-xs truncate font-medium">{accordion.title}</div>
                              <div className="text-xs text-pixel-text-light truncate">{accordion.content}</div>
                              <button
                                onClick={() => setEditingComponent(accordion.id)}
                                className="text-pixel-primary text-xs flex items-center gap-1"
                              >
                                <Edit className="w-3 h-3" />
                                Edit
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}