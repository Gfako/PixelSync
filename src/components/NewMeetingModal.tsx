'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, Clock, Users, Video } from 'lucide-react'

interface NewMeetingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (meetingData: any) => void
  isLoading?: boolean
  initialDate?: string
}

export default function NewMeetingModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialDate
}: NewMeetingModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    duration: '60', // Default to 60 minutes
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    meeting_platform: 'google_meet',
    attendees: '',
    recording_enabled: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Update start_time when initialDate changes
  useEffect(() => {
    if (initialDate && isOpen) {
      // Set the date part with a default time of 9:00 AM
      const dateObj = new Date(initialDate);
      dateObj.setHours(9, 0, 0, 0);
      const formattedDateTime = dateObj.toISOString().slice(0, 16);
      setFormData(prev => ({ ...prev, start_time: formattedDateTime }));
    }
  }, [initialDate, isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        description: '',
        start_time: '',
        duration: '60',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        meeting_platform: 'google_meet',
        attendees: '',
        recording_enabled: false
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.start_time) {
      newErrors.start_time = 'Start time is required'
    }

    if (!formData.duration || parseInt(formData.duration) <= 0) {
      newErrors.duration = 'Duration must be greater than 0'
    }

    if (formData.start_time) {
      const start = new Date(formData.start_time)

      if (start < new Date()) {
        newErrors.start_time = 'Start time cannot be in the past'
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      const attendeesList = formData.attendees
        .split(',')
        .map(email => email.trim())
        .filter(email => email && email.includes('@'))

      // Calculate end time from start time and duration
      const startTime = new Date(formData.start_time)
      const endTime = new Date(startTime.getTime() + parseInt(formData.duration) * 60000) // duration in minutes

      onSubmit({
        ...formData,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        attendees: attendeesList
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-pixel-text">Create New Meeting</h2>
          <button
            onClick={onClose}
            className="text-pixel-text-light hover:text-pixel-text"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-pixel-text mb-2">
              Meeting Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pixel-primary ${
                errors.title ? 'border-red-500' : 'border-pixel-border'
              }`}
              placeholder="Enter meeting title"
              disabled={isLoading}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-pixel-text mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-pixel-border rounded-md focus:outline-none focus:ring-2 focus:ring-pixel-primary"
              placeholder="Optional meeting description"
              disabled={isLoading}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_time" className="block text-sm font-medium text-pixel-text mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Start Time *
              </label>
              <input
                type="datetime-local"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pixel-primary ${
                  errors.start_time ? 'border-red-500' : 'border-pixel-border'
                }`}
                disabled={isLoading}
              />
              {errors.start_time && <p className="text-red-500 text-sm mt-1">{errors.start_time}</p>}
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-pixel-text mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Duration *
              </label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pixel-primary ${
                  errors.duration ? 'border-red-500' : 'border-pixel-border'
                }`}
                disabled={isLoading}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
                <option value="180">3 hours</option>
                <option value="240">4 hours</option>
              </select>
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
            </div>
          </div>

          {/* Meeting Platform */}
          <div>
            <label htmlFor="meeting_platform" className="block text-sm font-medium text-pixel-text mb-2">
              <Video className="w-4 h-4 inline mr-1" />
              Meeting Platform
            </label>
            <select
              id="meeting_platform"
              name="meeting_platform"
              value={formData.meeting_platform}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-pixel-border rounded-md focus:outline-none focus:ring-2 focus:ring-pixel-primary"
              disabled={isLoading}
            >
              <option value="google_meet">Google Meet</option>
              <option value="zoom">Zoom</option>
              <option value="teams">Microsoft Teams</option>
            </select>
          </div>

          {/* Attendees */}
          <div>
            <label htmlFor="attendees" className="block text-sm font-medium text-pixel-text mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Attendees
            </label>
            <input
              type="text"
              id="attendees"
              name="attendees"
              value={formData.attendees}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-pixel-border rounded-md focus:outline-none focus:ring-2 focus:ring-pixel-primary"
              placeholder="Enter email addresses separated by commas"
              disabled={isLoading}
            />
            <p className="text-xs text-pixel-text-light mt-1">
              Separate multiple email addresses with commas
            </p>
          </div>

          {/* Timezone */}
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-pixel-text mb-2">
              Timezone
            </label>
            <input
              type="text"
              id="timezone"
              name="timezone"
              value={formData.timezone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-pixel-border rounded-md focus:outline-none focus:ring-2 focus:ring-pixel-primary"
              disabled={isLoading}
            />
          </div>

          {/* Recording Option */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="recording_enabled"
              name="recording_enabled"
              checked={formData.recording_enabled}
              onChange={handleInputChange}
              className="mr-2"
              disabled={isLoading}
            />
            <label htmlFor="recording_enabled" className="text-sm text-pixel-text">
              Enable recording (if supported by platform)
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-pixel-text border border-pixel-border rounded-md hover:bg-pixel-card"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pixel-primary text-white rounded-md hover:bg-pixel-primary/90 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Meeting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}