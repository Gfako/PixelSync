'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import MeetingTemplateCard from '@/components/MeetingTemplateCard';
import Pagination from '@/components/Pagination';
import SchedulingPageEditor from '@/components/SchedulingPageEditor';
import { supabase } from '@/lib/supabase';
import { useAuthSimple } from '@/hooks/useAuthSimple';

const tabs = [
  { id: 'create-new', label: 'Create New', active: false },
  { id: 'scheduling-page', label: 'Scheduling Page', active: true },
  { id: 'availability', label: 'Availability', active: false },
  { id: 'templates', label: 'Templates', active: false },
];

// localStorage key for templates
const TEMPLATES_STORAGE_KEY = 'pixelsync_meeting_templates';

// Load templates from localStorage
const loadTemplatesFromStorage = (): any[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading templates from localStorage:', error);
    return [];
  }
};

// Save templates to localStorage
const saveTemplatesToStorage = (templates: any[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Error saving templates to localStorage:', error);
  }
};

export default function Scheduling() {
  const { user, isAuthenticated } = useAuthSimple();
  const [activeTab, setActiveTab] = useState('scheduling-page');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [meetingTemplates, setMeetingTemplates] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load templates from database or localStorage
  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated && user) {
        // Try to load from Supabase first
        const { data, error } = await supabase
          .from('meeting_templates')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error loading templates from Supabase:', error);
          // Fallback to localStorage
          const localTemplates = loadTemplatesFromStorage();
          setMeetingTemplates(localTemplates);
        } else {
          // Transform Supabase data to match our format
          const formattedTemplates = data.map(template => ({
            id: template.id,
            title: template.title,
            description: template.description,
            duration: template.duration,
            image: template.cover_photo || '/api/placeholder/300/200',
            settings: template.settings,
            createdAt: template.created_at,
            updatedAt: template.updated_at
          }));
          setMeetingTemplates(formattedTemplates);
        }
      } else {
        // User not authenticated, use localStorage
        const localTemplates = loadTemplatesFromStorage();
        setMeetingTemplates(localTemplates);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      // Fallback to localStorage
      const localTemplates = loadTemplatesFromStorage();
      setMeetingTemplates(localTemplates);
    } finally {
      setIsLoading(false);
    }
  };

  // Load templates on component mount and when auth changes
  useEffect(() => {
    setIsClient(true);
    if (isClient) {
      loadTemplates();
    }
  }, [isAuthenticated, user, isClient]);

  // Save templates to localStorage as backup whenever templates change
  useEffect(() => {
    if (isClient && meetingTemplates.length >= 0) {
      saveTemplatesToStorage(meetingTemplates);
    }
  }, [meetingTemplates, isClient]);
  const templatesPerPage = 8;
  const totalPages = Math.ceil(meetingTemplates.length / templatesPerPage);

  // Get current page templates
  const indexOfLastTemplate = currentPage * templatesPerPage;
  const indexOfFirstTemplate = indexOfLastTemplate - templatesPerPage;
  const currentTemplates = meetingTemplates.slice(indexOfFirstTemplate, indexOfLastTemplate);

  const handleEdit = (templateId: string) => {
    setEditingTemplateId(templateId);
    setIsEditorOpen(true);
  };

  const handleCopyLink = (templateId: string) => {
    console.log('Copy link for template:', templateId);
    // TODO: Copy scheduling link to clipboard
    // Example: https://pixelsync.io/schedule/template-id
  };

  const handleCreateNew = () => {
    console.log('Create new template');
    setEditingTemplateId(null); // Clear any existing template ID to create new
    setIsEditorOpen(true);
  };

  const handleSaveTemplate = async (settings: any) => {
    try {
      const templateData = {
        title: settings.eventTitle,
        description: settings.description,
        duration: settings.duration,
        cover_photo: settings.coverPhoto,
        settings: settings,
        is_active: true
      };

      if (isAuthenticated && user) {
        // Save to Supabase
        if (editingTemplateId) {
          // Update existing template
          const { data, error } = await supabase
            .from('meeting_templates')
            .update(templateData)
            .eq('id', editingTemplateId)
            .eq('user_id', user.id)
            .select()
            .single();

          if (error) {
            console.error('Error updating template:', error);
            throw error;
          }

          // Update local state
          setMeetingTemplates(prev => 
            prev.map(template => 
              template.id === editingTemplateId ? {
                id: data.id,
                title: data.title,
                description: data.description,
                duration: data.duration,
                image: data.cover_photo || '/api/placeholder/300/200',
                settings: data.settings,
                createdAt: data.created_at,
                updatedAt: data.updated_at
              } : template
            )
          );
        } else {
          // Create new template
          const { data, error } = await supabase
            .from('meeting_templates')
            .insert([{
              ...templateData,
              user_id: user.id
            }])
            .select()
            .single();

          if (error) {
            console.error('Error creating template:', error);
            throw error;
          }

          const newTemplate = {
            id: data.id,
            title: data.title,
            description: data.description,
            duration: data.duration,
            image: data.cover_photo || '/api/placeholder/300/200',
            settings: data.settings,
            createdAt: data.created_at,
            updatedAt: data.updated_at
          };

          // Add to local state
          setMeetingTemplates(prev => [newTemplate, ...prev]);
        }
      } else {
        // Fallback to localStorage-only storage
        const templateId = editingTemplateId || generateUniqueId();
        const newTemplate = {
          id: templateId,
          title: settings.eventTitle,
          description: settings.description,
          duration: settings.duration,
          image: settings.coverPhoto || '/api/placeholder/300/200',
          settings: settings,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (editingTemplateId) {
          setMeetingTemplates(prev => 
            prev.map(template => 
              template.id === editingTemplateId ? { ...template, ...newTemplate, updatedAt: new Date().toISOString() } : template
            )
          );
        } else {
          setMeetingTemplates(prev => [...prev, newTemplate]);
        }
      }

      // Close the editor
      setIsEditorOpen(false);
      setEditingTemplateId(null);
      
      console.log('Template saved successfully');
    } catch (error) {
      console.error('Error saving template:', error);
      // Could show error toast here
    }
  };

  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-pixel-text mb-6">Scheduling</h1>
          
          {/* Tabs */}
          <div className="flex space-x-1 mb-6">
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
        {activeTab === 'scheduling-page' && (
          <div className="space-y-6">
            {meetingTemplates.length > 0 ? (
              <>
                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {currentTemplates.map((template) => (
                    <MeetingTemplateCard
                      key={template.id}
                      title={template.title}
                      description={template.description}
                      duration={template.duration}
                      image={template.image}
                      onEdit={() => handleEdit(template.id)}
                      onCopyLink={() => handleCopyLink(template.id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-pixel-surface border-2 border-pixel-border flex items-center justify-center mx-auto mb-4 shadow-retro">
                      <Calendar className="w-8 h-8 text-pixel-text-light" />
                    </div>
                    <h2 className="text-xl font-bold text-pixel-text mb-2">No Scheduling Pages Yet</h2>
                    <p className="text-pixel-text-light mb-4">
                      Create your first scheduling page to start accepting meeting bookings from clients and colleagues.
                    </p>
                  </div>
                  <button 
                    onClick={handleCreateNew}
                    className="pixel-button bg-pixel-primary text-white px-6 py-3"
                  >
                    Create Your First Page
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Other tab content placeholders */}
        {activeTab === 'create-new' && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-16 h-16 bg-pixel-primary border-2 border-pixel-primary flex items-center justify-center mx-auto mb-4 shadow-retro">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-pixel-text mb-2">Create New Template</h2>
                <p className="text-pixel-text-light">Set up a new meeting scheduling template with custom settings.</p>
              </div>
              <button 
                onClick={handleCreateNew}
                className="pixel-button bg-pixel-primary text-white px-6 py-3"
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="text-center py-16 text-pixel-text-light">
            <h2 className="text-xl font-bold text-pixel-text mb-2">Availability Settings</h2>
            <p>Configure your available hours and calendar preferences.</p>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="text-center py-16 text-pixel-text-light">
            <h2 className="text-xl font-bold text-pixel-text mb-2">Template Management</h2>
            <p>Manage and organize all your meeting templates.</p>
          </div>
        )}

        {/* Scheduling Page Editor Modal */}
        <SchedulingPageEditor
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingTemplateId(null);
          }}
          templateId={editingTemplateId || undefined}
          onSave={handleSaveTemplate}
        />
      </div>
    </div>
  );
}