'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, Clock, Users, Video, FileText, Edit3, Save, MapPin, ExternalLink } from 'lucide-react'

interface MeetingDetailModalProps {
  meeting: any
  isOpen: boolean
  onClose: () => void
  onUpdateNotes?: (meetingId: string, notes: string) => void
}

export default function MeetingDetailModal({
  meeting,
  isOpen,
  onClose,
  onUpdateNotes
}: MeetingDetailModalProps) {
  const [notes, setNotes] = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [isSavingNotes, setIsSavingNotes] = useState(false)

  useEffect(() => {
    if (meeting?.notes) {
      setNotes(meeting.notes)
    } else {
      setNotes('')
    }
  }, [meeting])

  if (!isOpen || !meeting) return null

  const startDate = new Date(meeting.start_time)
  const endDate = new Date(meeting.end_time)
  const now = new Date()

  const isUpcoming = startDate > now
  const isPast = endDate < now
  const isInProgress = startDate <= now && endDate > now

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDuration = () => {
    const durationMs = endDate.getTime() - startDate.getTime()
    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const handleSaveNotes = async () => {
    if (!onUpdateNotes) return

    setIsSavingNotes(true)
    try {
      await onUpdateNotes(meeting.id, notes)
      setIsEditingNotes(false)
    } catch (error) {
      console.error('Failed to save notes:', error)
    } finally {
      setIsSavingNotes(false)
    }
  }

  const getAttendees = () => {
    if (meeting.attendees?.length) {
      return meeting.attendees
    }
    if (meeting.meeting_participants?.length) {
      return meeting.meeting_participants.map((mp: any) => mp.participants?.email || mp.participants?.full_name).filter(Boolean)
    }
    return []
  }

  const mockTranscript = isPast ? `[00:02] Host: Good morning everyone, thanks for joining today's ${meeting.title}.

[00:15] John Smith: Thanks for setting this up. I have the quarterly reports ready to discuss.

[00:32] Host: Perfect. Let's start with the main agenda items. First, we need to review the progress on the current project milestones.

[01:45] Sarah Johnson: The development team has completed 85% of the planned features for this sprint. We're on track to meet our delivery deadline.

[02:10] Host: That's excellent progress. Are there any blockers we need to address?

[02:25] John Smith: We're waiting on final approval for the design changes from the client. This might impact our timeline slightly.

[03:00] Host: I'll follow up with the client today to expedite the approval process. Sarah, can you prepare a contingency plan?

[03:15] Sarah Johnson: Absolutely. I'll have that ready by end of day.

[04:30] Host: Great. Let's move on to budget discussion. We're currently 15% under budget which gives us some flexibility.

[05:45] John Smith: I suggest we allocate some of that extra budget to quality assurance testing.

[06:00] Host: Good idea. Let's schedule a follow-up meeting next week to finalize these decisions.

[06:30] Host: Thanks everyone for your time. I'll send out the meeting summary and action items by end of day.` : null

  const mockSummary = isPast ? {
    keyPoints: [
      "Project is 85% complete and on track for delivery deadline",
      "Waiting on client approval for design changes",
      "Currently 15% under budget",
      "Proposed additional QA testing allocation"
    ],
    actionItems: [
      "Host to follow up with client on design approval",
      "Sarah to prepare contingency plan by EOD",
      "Schedule follow-up meeting for next week",
      "Send meeting summary and action items"
    ],
    decisions: [
      "Allocate extra budget to quality assurance testing",
      "Proceed with current sprint timeline pending client approval"
    ]
  } : null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-pixel-text">{meeting.title}</h2>
            <p className="text-pixel-text-light mt-1">{meeting.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-pixel-text-light hover:text-pixel-text ml-4"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Meeting Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-pixel-text-light mr-3" />
                <div>
                  <p className="font-medium text-pixel-text">Date & Time</p>
                  <p className="text-sm text-pixel-text-light">{formatDateTime(startDate)}</p>
                  <p className="text-sm text-pixel-text-light">Duration: {getDuration()}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Video className="w-5 h-5 text-pixel-text-light mr-3" />
                <div>
                  <p className="font-medium text-pixel-text">Platform</p>
                  <p className="text-sm text-pixel-text-light capitalize">
                    {meeting.meeting_platform?.replace('_', ' ') || 'Not specified'}
                  </p>
                  {meeting.meeting_url && (
                    <a
                      href={meeting.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-pixel-primary hover:underline flex items-center mt-1"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Join Meeting
                    </a>
                  )}
                </div>
              </div>

              {meeting.location && (
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-pixel-text-light mr-3" />
                  <div>
                    <p className="font-medium text-pixel-text">Location</p>
                    <p className="text-sm text-pixel-text-light">{meeting.location}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <Users className="w-5 h-5 text-pixel-text-light mr-3 mt-1" />
                <div className="flex-1">
                  <p className="font-medium text-pixel-text">Attendees</p>
                  {getAttendees().length > 0 ? (
                    <ul className="text-sm text-pixel-text-light space-y-1 mt-1">
                      {getAttendees().map((attendee: string, index: number) => (
                        <li key={index}>{attendee}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-pixel-text-light">No attendees listed</p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-5 h-5 mr-3 flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full ${
                    isInProgress ? 'bg-green-500' :
                    isPast ? 'bg-gray-400' : 'bg-blue-500'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-pixel-text">Status</p>
                  <p className="text-sm text-pixel-text-light">
                    {isInProgress ? 'In Progress' : isPast ? 'Completed' : 'Scheduled'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-pixel-text flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Notes
              </h3>
              {!isEditingNotes && (
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="text-pixel-primary hover:text-pixel-primary/80 flex items-center text-sm"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <div className="space-y-3">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-32 p-3 border border-pixel-border rounded-md focus:outline-none focus:ring-2 focus:ring-pixel-primary"
                  placeholder="Add your notes here..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="px-4 py-2 bg-pixel-primary text-white rounded-md hover:bg-pixel-primary/90 disabled:opacity-50 flex items-center"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    {isSavingNotes ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setIsEditingNotes(false)}
                    className="px-4 py-2 text-pixel-text border border-pixel-border rounded-md hover:bg-pixel-card"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-pixel-card p-4 rounded-md border border-pixel-border">
                {notes ? (
                  <p className="text-pixel-text whitespace-pre-wrap">{notes}</p>
                ) : (
                  <p className="text-pixel-text-light italic">No notes added yet. Click Edit to add notes.</p>
                )}
              </div>
            )}
          </div>

          {/* Past Meeting Content */}
          {isPast && (
            <>
              {/* AI Summary */}
              {mockSummary && (
                <div>
                  <h3 className="text-lg font-semibold text-pixel-text mb-3">🤖 AI Summary</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 space-y-4">
                    <div>
                      <h4 className="font-medium text-pixel-text mb-2">Key Points</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-pixel-text-light">
                        {mockSummary.keyPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-pixel-text mb-2">Action Items</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-pixel-text-light">
                        {mockSummary.actionItems.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-pixel-text mb-2">Decisions Made</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-pixel-text-light">
                        {mockSummary.decisions.map((decision, index) => (
                          <li key={index}>{decision}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Transcript */}
              {mockTranscript && (
                <div>
                  <h3 className="text-lg font-semibold text-pixel-text mb-3">📝 Transcript</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-pixel-text whitespace-pre-wrap font-mono">
                      {mockTranscript}
                    </pre>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Upcoming Meeting Info */}
          {isUpcoming && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-lg font-semibold text-pixel-text mb-2">📅 Upcoming Meeting</h3>
              <p className="text-sm text-pixel-text-light mb-3">
                This meeting is scheduled for {formatDateTime(startDate)}.
                {meeting.meeting_url && ' You can join using the link above.'}
              </p>
              {isInProgress && (
                <div className="bg-green-100 border border-green-300 rounded-md p-3">
                  <p className="text-green-800 font-medium">🔴 Meeting is currently in progress!</p>
                  {meeting.meeting_url && (
                    <a
                      href={meeting.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-700 hover:underline flex items-center mt-2"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Join Now
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}