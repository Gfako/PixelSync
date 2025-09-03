'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import MeetingTemplateCard from '@/components/MeetingTemplateCard';
import Pagination from '@/components/Pagination';
import SchedulingPageEditor from '@/components/SchedulingPageEditor';

const tabs = [
  { id: 'create-new', label: 'Create New', active: false },
  { id: 'scheduling-page', label: 'Scheduling Page', active: true },
  { id: 'availability', label: 'Availability', active: false },
  { id: 'templates', label: 'Templates', active: false },
];

// Sample meeting templates
const meetingTemplates = [
  {
    id: '1',
    title: 'Pink Style - 30 Minute Meeting',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At ipsum vitae euismod placerat.',
    duration: 'Dona aliquam',
    image: '/api/placeholder/300/200',
  },
  {
    id: '2',
    title: 'Funky Orange - 45 Minute Meeting',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At ipsum vitae euismod placerat.',
    duration: 'Dona aliquam',
    image: '/api/placeholder/300/200',
  },
  {
    id: '3',
    title: 'Professional Style - 30 Minute Meeting',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At ipsum vitae euismod placerat.',
    duration: 'Dona aliquam',
    image: '/api/placeholder/300/200',
  },
  {
    id: '4',
    title: 'Placeholder',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At ipsum vitae euismod placerat.',
    duration: 'Dona aliquam',
    image: '/api/placeholder/300/200',
  },
  {
    id: '5',
    title: 'Placeholder',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At ipsum vitae euismod placerat.',
    duration: 'Dona aliquam',
    image: '/api/placeholder/300/200',
  },
  {
    id: '6',
    title: 'Placeholder',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At ipsum vitae euismod placerat.',
    duration: 'Dona aliquam',
    image: '/api/placeholder/300/200',
  },
  {
    id: '7',
    title: 'Placeholder',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At ipsum vitae euismod placerat.',
    duration: 'Dona aliquam',
    image: '/api/placeholder/300/200',
  },
  {
    id: '8',
    title: 'Placeholder',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At ipsum vitae euismod placerat.',
    duration: 'Dona aliquam',
    image: '/api/placeholder/300/200',
  },
];

export default function Scheduling() {
  const [activeTab, setActiveTab] = useState('scheduling-page');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
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
    // TODO: Navigate to create new template page
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
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
        />
      </div>
    </div>
  );
}