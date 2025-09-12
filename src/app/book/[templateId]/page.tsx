'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar, ArrowLeft, ChevronDown, ChevronUp, Check, User, Mail, MessageSquare } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { TemplateCustomizationService } from '@/lib/template-customizations';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

// Advanced Superdesign CSS with Glassmorphism, Neumorphism & 3D Effects
const superDesignStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  /* Advanced Keyframe Animations */
  @keyframes morphIn {
    0% { opacity: 0; transform: translateY(30px) scale(0.95); filter: blur(10px); }
    50% { opacity: 0.7; transform: translateY(10px) scale(0.98); filter: blur(2px); }
    100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
  }
  
  @keyframes glassSlide {
    0% { opacity: 0; transform: translateX(-50px) rotateY(-10deg); backdrop-filter: blur(0px); }
    100% { opacity: 1; transform: translateX(0) rotateY(0deg); backdrop-filter: blur(20px); }
  }
  
  @keyframes neomorphLift {
    0% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-5px) scale(1.02); }
    100% { transform: translateY(-8px) scale(1.05); }
  }
  
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
    50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 80px rgba(59, 130, 246, 0.3); }
  }
  
  @keyframes floatingOrb {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-20px) rotate(120deg); }
    66% { transform: translateY(10px) rotate(240deg); }
  }
  
  /* Glassmorphism Classes */
  .glass-morphism {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  
  .glass-card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.1),
      0 1px 0 rgba(255, 255, 255, 0.2) inset;
  }
  
  /* Neumorphism Classes */
  .neomorph-soft {
    background: #f0f0f3;
    box-shadow: 
      20px 20px 60px #d0d0d3,
      -20px -20px 60px #ffffff;
  }
  
  .neomorph-pressed {
    background: #f0f0f3;
    box-shadow: 
      inset 8px 8px 16px #d0d0d3,
      inset -8px -8px 16px #ffffff;
  }
  
  .neomorph-floating {
    background: linear-gradient(145deg, #f0f0f3, #cacaca);
    box-shadow: 
      15px 15px 30px #bebebe,
      -15px -15px 30px #ffffff;
  }
  
  /* 3D Transform Effects */
  .transform-3d {
    transform-style: preserve-3d;
    perspective: 1000px;
  }
  
  .card-3d {
    transform: rotateX(5deg) rotateY(-5deg);
    transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
  }
  
  .card-3d:hover {
    transform: rotateX(0deg) rotateY(0deg) translateY(-10px);
  }
  
  /* Advanced Animations */
  .animate-morph-in {
    animation: morphIn 0.8s cubic-bezier(0.23, 1, 0.320, 1);
  }
  
  .animate-glass-slide {
    animation: glassSlide 0.6s cubic-bezier(0.23, 1, 0.320, 1);
  }
  
  .animate-neomorph-lift {
    animation: neomorphLift 0.3s cubic-bezier(0.23, 1, 0.320, 1) forwards;
  }
  
  .animate-pulse-glow {
    animation: pulseGlow 2s ease-in-out infinite;
  }
  
  .animate-floating-orb {
    animation: floatingOrb 6s ease-in-out infinite;
  }
  
  /* Interactive Micro-animations */
  .micro-bounce:hover {
    animation: none;
    transform: translateY(-3px) scale(1.05);
    transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  .micro-press:active {
    transform: scale(0.98);
    transition: transform 0.1s cubic-bezier(0.23, 1, 0.320, 1);
  }
  
  .ripple-effect {
    position: relative;
    overflow: hidden;
  }
  
  .ripple-effect::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  .ripple-effect:active::after {
    width: 300px;
    height: 300px;
  }
  
  /* Gradient Backgrounds */
  .gradient-mesh {
    background: 
      radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.2) 0%, transparent 50%);
  }
  
  /* Advanced Shadows */
  .shadow-luxury {
    box-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.1),
      0 1px 8px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
  
  .shadow-deep {
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.15),
      0 15px 35px rgba(0, 0, 0, 0.1),
      0 5px 15px rgba(0, 0, 0, 0.12);
  }
  
  /* Custom Scrollbar */
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    backdrop-filter: blur(10px);
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.6));
    border-radius: 10px;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .mobile-calendar-grid {
      grid-template-columns: repeat(7, minmax(45px, 1fr));
      gap: 6px;
    }
    
    .mobile-time-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    
    .mobile-steps {
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
    }
    
    .glass-morphism, .glass-card {
      backdrop-filter: blur(15px);
    }
  }
  
  /* Performance Optimizations */
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .gpu-accelerate {
    transform: translateZ(0);
    will-change: transform;
  }
`;

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

  // Load design settings - either from sessionStorage (preview) or Supabase (live)
  useEffect(() => {
    if (!isClient) return;
    
    const loadSettings = async () => {
      if (isPreview && typeof window !== 'undefined') {
        // Preview mode - load from sessionStorage
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
      } else {
        // Live mode - load from Supabase (public access for booking pages)
        try {
          const templateId = Array.isArray(params.templateId) 
            ? params.templateId[0] 
            : params.templateId;
            
          if (templateId) {
            const customization = await TemplateCustomizationService.loadCustomizations(templateId);
            
            if (customization) {
              const editorSettings = TemplateCustomizationService.convertApiToEditor(customization);
              setDesignSettings(editorSettings);
            }
            // If no customization found, keep default settings
          }
        } catch (error) {
          console.error('Error loading template customizations:', error);
          // Fall back to defaults on error (already set)
        }
      }
    };
    
    loadSettings();
  }, [isClient, isPreview, params.templateId]);

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

  const calendarDays = generateCalendarDays();

  return (
    <>
      {/* Inject Superdesign Styles */}
      <style dangerouslySetInnerHTML={{ __html: superDesignStyles }} />
      
      <div 
        className="min-h-screen relative overflow-hidden gradient-mesh"
        style={{ 
          background: `
            radial-gradient(circle at 20% 20%, ${designSettings.primaryColor}15 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${designSettings.primaryColor}20 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, ${designSettings.primaryColor}10 0%, transparent 50%),
            linear-gradient(135deg, ${designSettings.pageBackgroundColor} 0%, ${designSettings.pageBackgroundColor}f0 100%)
          `,
        }}
      >
        {/* Floating Orbs Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-30 animate-floating-orb"
            style={{ 
              background: `linear-gradient(45deg, ${designSettings.primaryColor}40, ${designSettings.primaryColor}20)`,
              filter: 'blur(20px)'
            }}
          />
          <div 
            className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full opacity-20 animate-floating-orb"
            style={{ 
              background: `linear-gradient(45deg, ${designSettings.primaryColor}30, ${designSettings.primaryColor}10)`,
              filter: 'blur(15px)',
              animationDelay: '2s'
            }}
          />
          <div 
            className="absolute top-1/2 right-1/3 w-16 h-16 rounded-full opacity-25 animate-floating-orb"
            style={{ 
              background: `linear-gradient(45deg, ${designSettings.primaryColor}35, ${designSettings.primaryColor}15)`,
              filter: 'blur(10px)',
              animationDelay: '4s'
            }}
          />
        </div>
      {/* Preview Banner */}
      {isPreview && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 text-center text-sm font-medium shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>Preview Mode - This is how your booking page looks to visitors</span>
            <Link href="/scheduling" className="ml-4 px-3 py-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
              ← Back to Editor
            </Link>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto pt-8 pb-4 px-6">
        <div className="flex items-center justify-center space-x-4 md:space-x-8 mobile-steps">
          {[
            { number: 1, title: 'Select Time', active: step === 1, completed: step > 1 },
            { number: 2, title: 'Your Details', active: step === 2, completed: step > 2 },
            { number: 3, title: 'Confirmed', active: step === 3, completed: false }
          ].map((stepItem, index) => (
            <div key={stepItem.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                    stepItem.completed 
                      ? 'text-white shadow-lg' 
                      : stepItem.active 
                        ? 'text-white shadow-lg ring-4 ring-opacity-30' 
                        : 'bg-gray-200 text-gray-500'
                  }`}
                  style={{
                    backgroundColor: stepItem.completed || stepItem.active ? designSettings.primaryColor : undefined,
                    ringColor: stepItem.active ? `${designSettings.primaryColor}30` : undefined
                  }}
                >
                  {stepItem.completed ? <Check className="w-5 h-5" /> : stepItem.number}
                </div>
                <span className={`text-xs mt-2 font-medium ${designSettings.fontFamily}`} 
                      style={{ color: stepItem.active ? designSettings.primaryColor : '#6b7280' }}>
                  {stepItem.title}
                </span>
              </div>
              {index < 2 && (
                <div 
                  className={`w-20 h-0.5 mx-4 transition-colors duration-300 ${
                    step > stepItem.number ? 'bg-current' : 'bg-gray-300'
                  }`}
                  style={{ color: step > stepItem.number ? designSettings.primaryColor : undefined }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cover Photo */}
      {designSettings.coverPhoto && (
        <div className="max-w-4xl mx-auto px-6 mb-8">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img 
              src={designSettings.coverPhoto} 
              alt="Cover" 
              className="w-full h-48 md:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div 
          className="backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          style={{ backgroundColor: `${designSettings.backgroundColor}f5` }}
        >
          {/* Step 1: Date & Time Selection */}
          {step === 1 && (
            <div className="animate-fade-in">
              {/* Hero Section */}
              <div className="p-8 md:p-12 text-center border-b border-gray-100/50">
                {designSettings.showAvatar && (
                  <div className="flex justify-center mb-6">
                    <div 
                      className="relative w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white flex items-center justify-center overflow-hidden shadow-xl"
                      style={{ borderRadius: designSettings.borderRadius === '0px' ? '12px' : '50%' }}
                    >
                      {designSettings.avatarUrl ? (
                        <img src={designSettings.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-600 font-bold text-2xl">😊</span>
                      )}
                      <div className="absolute inset-0 ring-2 ring-white/50 rounded-full"></div>
                    </div>
                  </div>
                )}
                
                <h1 
                  className={`text-4xl md:text-5xl font-bold mb-6 ${designSettings.fontFamily} leading-tight`}
                  style={{ 
                    color: designSettings.textColor,
                    fontWeight: designSettings.fontWeight
                  }}
                >
                  {designSettings.eventTitle}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
                  <div className={`flex items-center gap-3 text-lg ${designSettings.fontFamily} px-4 py-2 rounded-full bg-gradient-to-r from-gray-50 to-gray-100/50`} 
                       style={{ color: designSettings.textColor, fontWeight: designSettings.fontWeight }}>
                    <div 
                      className="p-2 rounded-full"
                      style={{ backgroundColor: `${designSettings.primaryColor}15` }}
                    >
                      <Clock className="w-5 h-5" style={{ color: designSettings.primaryColor }} />
                    </div>
                    <span className="font-semibold">{designSettings.duration}</span>
                  </div>
                  <div className={`flex items-center gap-3 text-lg ${designSettings.fontFamily} px-4 py-2 rounded-full bg-gradient-to-r from-gray-50 to-gray-100/50`} 
                       style={{ color: designSettings.textColor, fontWeight: designSettings.fontWeight }}>
                    <div 
                      className="p-2 rounded-full"
                      style={{ backgroundColor: `${designSettings.primaryColor}15` }}
                    >
                      <Calendar className="w-5 h-5" style={{ color: designSettings.primaryColor }} />
                    </div>
                    <span className="font-semibold">Web Meeting • {getTimezoneDisplay(designSettings.timezone)}</span>
                  </div>
                </div>
                
                <p className={`text-lg leading-relaxed max-w-2xl mx-auto text-gray-600 ${designSettings.fontFamily}`} 
                   style={{ color: `${designSettings.textColor}cc`, fontWeight: designSettings.fontWeight }}>
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

              {/* Calendar & Time Selection */}
              <div className="p-8 md:p-12">
                <div className="grid md:grid-cols-5 gap-8">
                  {/* Calendar - Larger and More Prominent */}
                  <div className="md:col-span-3">
                    <h2 
                      className={`text-2xl font-bold mb-8 text-center ${designSettings.fontFamily}`}
                      style={{ 
                        color: designSettings.textColor || '#000000',
                        fontWeight: designSettings.fontWeight || 'bold'
                      }}
                    >
                      Choose Your Date
                    </h2>
                      
                    <div 
                      className="rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden bg-white/80 backdrop-blur-sm"
                      style={{ 
                        backgroundColor: `${designSettings.calendarBackgroundColor}f0`
                      }}
                    >
                      {/* Calendar Header */}
                      <div 
                        className={`flex items-center justify-between p-6 border-b border-gray-100/50 ${designSettings.fontFamily}`}
                        style={{ 
                          background: `linear-gradient(135deg, ${designSettings.primaryColor}08, ${designSettings.primaryColor}04)`
                        }}
                      >
                        <button
                          onClick={() => navigateMonth('prev')}
                          className="p-3 hover:bg-white/50 transition-all duration-200 rounded-xl group"
                          style={{ 
                            color: designSettings.calendarTextColor 
                          }}
                        >
                          <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                        <h3 
                          className="font-bold text-xl"
                          style={{ 
                            color: designSettings.calendarTextColor,
                            fontWeight: designSettings.fontWeight
                          }}
                        >
                          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h3>
                        <button
                          onClick={() => navigateMonth('next')}
                          className="p-3 hover:bg-white/50 transition-all duration-200 rounded-xl group"
                          style={{ 
                            color: designSettings.calendarTextColor 
                          }}
                        >
                          <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
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

                      {/* Calendar Grid - Enhanced Design */}
                      <div className="grid grid-cols-7 gap-1 p-4 mobile-calendar-grid">
                        {calendarDays.slice(0, 35).map((date, index) => {
                          const dayNum = date.getDate();
                          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                          const isSelected = dayNum === selectedDate && isCurrentMonth;
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const dateToCompare = new Date(date);
                          dateToCompare.setHours(0, 0, 0, 0);
                          const isPast = dateToCompare < today;
                          const isToday = dateToCompare.getTime() === today.getTime();

                          return (
                            <button
                              key={index}
                              onClick={() => {
                                if (isCurrentMonth && !isPast) {
                                  setSelectedDate(dayNum);
                                }
                              }}
                              disabled={isPast || !isCurrentMonth}
                              className={`relative text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center group ${designSettings.fontFamily} ${
                                !isCurrentMonth ? 'opacity-30' : ''
                              } ${
                                isSelected 
                                  ? 'text-white transform scale-105 shadow-lg' 
                                  : isToday 
                                    ? 'ring-2 ring-opacity-50' 
                                    : isPast 
                                      ? 'opacity-40' 
                                      : 'hover:bg-white/50 hover:scale-105'
                              }`}
                              style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '16px',
                                margin: '2px auto',
                                backgroundColor: isSelected 
                                  ? designSettings.primaryColor
                                  : 'transparent',
                                color: isSelected 
                                  ? 'white' 
                                  : designSettings.calendarTextColor,
                                fontWeight: designSettings.fontWeight,
                                ringColor: isToday ? `${designSettings.primaryColor}50` : undefined,
                                boxShadow: isSelected ? `0 8px 25px ${designSettings.primaryColor}40` : undefined
                              }}
                            >
                              {dayNum}
                              {isToday && !isSelected && (
                                <div 
                                  className="absolute bottom-1 w-1 h-1 rounded-full"
                                  style={{ backgroundColor: designSettings.primaryColor }}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                      </div>
                    </div>

                  {/* Time Slots - Modern Card Design */}
                  <div className="md:col-span-2">
                    <h3 
                      className={`text-2xl font-bold mb-8 text-center ${designSettings.fontFamily}`}
                      style={{ 
                        color: designSettings.textColor,
                        fontWeight: designSettings.fontWeight
                      }}
                    >
                      Select Your Time
                    </h3>

                    {/* Selected Date Display */}
                    <div className="mb-6 text-center">
                      <div 
                        className={`inline-flex items-center px-6 py-3 rounded-2xl ${designSettings.fontFamily} font-semibold`}
                        style={{ 
                          background: selectedDate 
                            ? `linear-gradient(135deg, ${designSettings.primaryColor}15, ${designSettings.primaryColor}08)`
                            : '#f3f4f6',
                          color: selectedDate ? designSettings.primaryColor : '#6b7280',
                          border: `2px solid ${selectedDate ? `${designSettings.primaryColor}30` : '#e5e7eb'}`
                        }}
                      >
                        <Calendar className="w-5 h-5 mr-2" />
                        {selectedDate 
                          ? `${monthNames[currentDate.getMonth()]} ${selectedDate}, ${currentDate.getFullYear()}`
                          : "Select a date first"
                        }
                      </div>
                    </div>

                    {/* Timezone Selector */}
                    <div className="mb-6">
                      <select
                        value={userTimezone}
                        onChange={(e) => setUserTimezone(e.target.value)}
                        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl ${designSettings.fontFamily} focus:ring-4 focus:ring-opacity-20 focus:border-transparent transition-all duration-200 bg-white/50`}
                        style={{
                          color: designSettings.calendarTextColor,
                          fontWeight: designSettings.fontWeight,
                          focusRingColor: `${designSettings.primaryColor}20`,
                          borderColor: `${designSettings.primaryColor}20`
                        }}
                      >
                        <option value="America/New_York">🇺🇸 Eastern Time (ET)</option>
                        <option value="America/Chicago">🇺🇸 Central Time (CT)</option>
                        <option value="America/Denver">🇺🇸 Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">🇺🇸 Pacific Time (PT)</option>
                        <option value="Europe/London">🇬🇧 London (GMT)</option>
                        <option value="Europe/Paris">🇫🇷 Paris (CET)</option>
                        <option value="Europe/Berlin">🇩🇪 Berlin (CET)</option>
                        <option value="Asia/Tokyo">🇯🇵 Tokyo (JST)</option>
                        <option value="Asia/Shanghai">🇨🇳 Shanghai (CST)</option>
                        <option value="Asia/Dubai">🇦🇪 Dubai (GST)</option>
                        <option value="Australia/Sydney">🇦🇺 Sydney (AEDT)</option>
                        <option value="UTC">🌍 UTC</option>
                      </select>
                    </div>
                      
                    {/* Time Slots Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3 mb-8 mobile-time-grid">
                      {timeSlots.map((time) => {
                        const isSelected = selectedTime === time;
                        const isDisabled = !selectedDate;
                        
                        return (
                          <button
                            key={time}
                            onClick={() => selectedDate && setSelectedTime(time)}
                            disabled={isDisabled}
                            className={`relative p-4 text-center border-2 transition-all duration-300 group ${designSettings.fontFamily} ${
                              isDisabled 
                                ? 'opacity-40 cursor-not-allowed'
                                : isSelected
                                  ? 'transform scale-105 shadow-2xl'
                                  : 'hover:scale-105 hover:shadow-lg hover:border-opacity-50'
                            }`}
                            style={{
                              borderRadius: '16px',
                              fontWeight: designSettings.fontWeight,
                              color: isDisabled 
                                ? '#9ca3af' 
                                : isSelected 
                                  ? '#ffffff'
                                  : designSettings.textColor,
                              backgroundColor: isDisabled 
                                ? '#f9fafb'
                                : isSelected 
                                  ? designSettings.primaryColor
                                  : 'rgba(255, 255, 255, 0.8)',
                              borderColor: isDisabled 
                                ? '#e5e7eb'
                                : isSelected 
                                  ? designSettings.primaryColor
                                  : `${designSettings.primaryColor}30`,
                              boxShadow: isSelected 
                                ? `0 15px 35px ${designSettings.primaryColor}40, 0 5px 15px ${designSettings.primaryColor}20`
                                : '0 2px 10px rgba(0,0,0,0.1)',
                            }}
                          >
                            <div className="flex flex-col items-center">
                              <Clock className={`w-4 h-4 mb-2 ${isSelected ? 'animate-pulse' : ''}`} />
                              <span className="font-semibold text-lg">{time}</span>
                            </div>
                            {isSelected && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <Check className="w-4 h-4" style={{ color: designSettings.primaryColor }} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                      
                    {/* Continue Button */}
                    {selectedDate && selectedTime && (
                      <div className="relative">
                        <button
                          onClick={() => setStep(2)}
                          className={`w-full px-8 py-4 text-white text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl group ${designSettings.fontFamily}`}
                          style={{
                            background: `linear-gradient(135deg, ${designSettings.primaryColor}, ${designSettings.primaryColor}dd)`,
                            borderRadius: '16px',
                            fontWeight: designSettings.fontWeight,
                            boxShadow: `0 10px 30px ${designSettings.primaryColor}50`
                          }}
                        >
                          <span className="flex items-center justify-center gap-2">
                            Continue to Details
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </button>
                        
                        {/* Animated background effect */}
                        <div 
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                          style={{
                            background: `linear-gradient(135deg, ${designSettings.primaryColor}20, ${designSettings.primaryColor}10)`,
                            transform: 'scale(1.1)',
                            filter: 'blur(10px)'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Details */}
          {step === 2 && (
            <div className="p-8 md:p-12 animate-fade-in">
              {/* Back Button */}
              <div className="mb-8 flex justify-center">
                <button
                  onClick={() => setStep(1)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 hover:scale-105 ${designSettings.fontFamily}`}
                  style={{ 
                    backgroundColor: `${designSettings.primaryColor}10`,
                    color: designSettings.primaryColor,
                    fontWeight: designSettings.fontWeight
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Date & Time
                </button>
              </div>

              {/* Booking Summary Card */}
              <div className="max-w-2xl mx-auto mb-12">
                <div 
                  className="p-6 rounded-2xl border-2 border-dashed"
                  style={{ 
                    borderColor: `${designSettings.primaryColor}30`,
                    backgroundColor: `${designSettings.primaryColor}05`
                  }}
                >
                  <div className="text-center">
                    <h3 
                      className={`text-xl font-bold mb-4 ${designSettings.fontFamily}`}
                      style={{ 
                        color: designSettings.textColor,
                        fontWeight: designSettings.fontWeight
                      }}
                    >
                      {designSettings.eventTitle}
                    </h3>
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                      <div className={`flex items-center gap-2 ${designSettings.fontFamily}`} style={{ color: designSettings.textColor }}>
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">
                          {monthNames[currentDate.getMonth()]} {selectedDate}, {currentDate.getFullYear()}
                        </span>
                      </div>
                      <div className={`flex items-center gap-2 ${designSettings.fontFamily}`} style={{ color: designSettings.textColor }}>
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${designSettings.fontFamily}`} style={{ color: designSettings.textColor }}>
                        <span className="font-medium">{designSettings.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
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

              {/* Modern Contact Form */}
              <div className="max-w-lg mx-auto">
                <h2 
                  className={`text-3xl font-bold mb-8 text-center ${designSettings.fontFamily}`}
                  style={{ 
                    color: designSettings.textColor,
                    fontWeight: designSettings.fontWeight
                  }}
                >
                  Your Information
                </h2>

                <div className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className={`flex items-center gap-2 text-sm font-semibold ${designSettings.fontFamily}`} style={{ 
                      color: designSettings.textColor,
                      fontWeight: designSettings.fontWeight
                    }}>
                      <User className="w-4 h-4" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-4 border-2 border-gray-200 focus:border-transparent focus:ring-4 focus:ring-opacity-20 transition-all duration-200 bg-white/50 ${designSettings.fontFamily}`}
                      style={{ 
                        borderRadius: '12px',
                        fontWeight: designSettings.fontWeight,
                        focusRingColor: `${designSettings.primaryColor}20`
                      }}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className={`flex items-center gap-2 text-sm font-semibold ${designSettings.fontFamily}`} style={{ 
                      color: designSettings.textColor,
                      fontWeight: designSettings.fontWeight
                    }}>
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-4 py-4 border-2 border-gray-200 focus:border-transparent focus:ring-4 focus:ring-opacity-20 transition-all duration-200 bg-white/50 ${designSettings.fontFamily}`}
                      style={{ 
                        borderRadius: '12px',
                        fontWeight: designSettings.fontWeight,
                        focusRingColor: `${designSettings.primaryColor}20`
                      }}
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  {/* Message Field */}
                  <div className="space-y-2">
                    <label className={`flex items-center gap-2 text-sm font-semibold ${designSettings.fontFamily}`} style={{ 
                      color: designSettings.textColor,
                      fontWeight: designSettings.fontWeight
                    }}>
                      <MessageSquare className="w-4 h-4" />
                      Additional Message (Optional)
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      rows={4}
                      className={`w-full px-4 py-4 border-2 border-gray-200 focus:border-transparent focus:ring-4 focus:ring-opacity-20 transition-all duration-200 resize-none bg-white/50 ${designSettings.fontFamily}`}
                      style={{ 
                        borderRadius: '12px',
                        fontWeight: designSettings.fontWeight,
                        focusRingColor: `${designSettings.primaryColor}20`
                      }}
                      placeholder="Anything you'd like to share before our meeting? (Optional)"
                    />
                  </div>

                  {/* Confirm Button */}
                  <div className="pt-6">
                    <button
                      onClick={handleBooking}
                      disabled={!formData.name || !formData.email}
                      className={`w-full px-8 py-4 text-white text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group ${designSettings.fontFamily}`}
                      style={{
                        background: !formData.name || !formData.email 
                          ? '#9ca3af' 
                          : `linear-gradient(135deg, ${designSettings.primaryColor}, ${designSettings.primaryColor}dd)`,
                        borderRadius: '16px',
                        fontWeight: designSettings.fontWeight,
                        boxShadow: !formData.name || !formData.email 
                          ? 'none' 
                          : `0 10px 30px ${designSettings.primaryColor}50`
                      }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        Confirm Booking
                        <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="p-12 text-center animate-scale-in">
              {/* Success Animation */}
              <div className="mb-8">
                <div 
                  className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold animate-bounce"
                  style={{
                    background: `linear-gradient(135deg, ${designSettings.primaryColor}, ${designSettings.primaryColor}dd)`,
                    borderRadius: '50%',
                    boxShadow: `0 20px 40px ${designSettings.primaryColor}40`
                  }}
                >
                  <Check className="w-12 h-12" />
                  <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: `${designSettings.primaryColor}30` }}></div>
                </div>
                
                <h2 
                  className={`text-4xl font-bold mb-6 ${designSettings.fontFamily}`}
                  style={{ 
                    color: designSettings.textColor,
                    fontWeight: designSettings.fontWeight
                  }}
                >
                  🎉 You're All Set!
                </h2>
                
                <p className={`text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed ${designSettings.fontFamily}`}>
                  Your meeting has been successfully scheduled. We're looking forward to connecting with you!
                </p>
              </div>

              {/* Meeting Details Card */}
              <div className="max-w-lg mx-auto mb-8">
                <div 
                  className="p-8 rounded-2xl border-2"
                  style={{ 
                    backgroundColor: `${designSettings.primaryColor}08`,
                    borderColor: `${designSettings.primaryColor}20`
                  }}
                >
                  <h3 className={`text-xl font-semibold mb-6 ${designSettings.fontFamily}`} style={{ color: designSettings.textColor }}>
                    Meeting Details
                  </h3>
                  <div className="space-y-4">
                    <div className={`flex items-center justify-between p-3 rounded-xl bg-white/50 ${designSettings.fontFamily}`}>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5" style={{ color: designSettings.primaryColor }} />
                        <span className="font-medium">Date</span>
                      </div>
                      <span className="font-semibold" style={{ color: designSettings.textColor }}>
                        {monthNames[currentDate.getMonth()]} {selectedDate}, {currentDate.getFullYear()}
                      </span>
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-xl bg-white/50 ${designSettings.fontFamily}`}>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5" style={{ color: designSettings.primaryColor }} />
                        <span className="font-medium">Time</span>
                      </div>
                      <span className="font-semibold" style={{ color: designSettings.textColor }}>
                        {selectedTime}
                      </span>
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-xl bg-white/50 ${designSettings.fontFamily}`}>
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5" style={{ color: designSettings.primaryColor }} />
                        <span className="font-medium">Duration</span>
                      </div>
                      <span className="font-semibold" style={{ color: designSettings.textColor }}>
                        {designSettings.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Confirmation */}
              <div 
                className={`max-w-md mx-auto p-4 rounded-xl border ${designSettings.fontFamily}`}
                style={{ 
                  backgroundColor: '#f0fdf4',
                  borderColor: '#bbf7d0',
                  color: '#16a34a'
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Confirmation email sent to {formData.email}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}