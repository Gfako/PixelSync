'use client'

import { useAuth, useCalendarIntegrations } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AppHeader from '@/components/ui/AppHeader'

export default function DashboardPage() {
  const { session, userProfile, isAuthenticated, isLoading, signOut } = useAuth()
  const { integrations, hasGoogleCalendar, hasOutlookCalendar, connectGoogle, connectOutlook } = useCalendarIntegrations()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        <AppHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="bg-black/20 backdrop-blur-lg rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Your Profile</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white">{userProfile?.email || session?.user?.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Name</p>
                <p className="text-white">{userProfile?.full_name || session?.user?.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Timezone</p>
                <p className="text-white">{userProfile?.timezone || 'UTC'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Meeting Platform</p>
                <p className="text-white capitalize">{userProfile?.preferred_meeting_platform?.replace('_', ' ') || 'Google Meet'}</p>
              </div>
            </div>
          </div>

          {/* Calendar Integrations */}
          <div className="bg-black/20 backdrop-blur-lg rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Calendar Integrations</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${hasGoogleCalendar ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  <span className="text-white">Google Calendar</span>
                </div>
                {!hasGoogleCalendar && (
                  <button
                    onClick={connectGoogle}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${hasOutlookCalendar ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  <span className="text-white">Outlook Calendar</span>
                </div>
                {!hasOutlookCalendar && (
                  <button
                    onClick={connectOutlook}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Connect your calendars to check availability and sync meetings automatically.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="bg-black/20 backdrop-blur-lg rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors text-left">
                <div className="font-semibold">Schedule New Meeting</div>
                <div className="text-sm text-green-200">Create and send invites</div>
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors text-left">
                <div className="font-semibold">View Upcoming Meetings</div>
                <div className="text-sm text-blue-200">Check your schedule</div>
              </button>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors text-left">
                <div className="font-semibold">Recording Library</div>
                <div className="text-sm text-purple-200">Access past recordings</div>
              </button>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="mt-8 bg-black/20 backdrop-blur-lg rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">PixelSync Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🗓️</div>
              <h3 className="font-semibold text-white">Calendar Sync</h3>
              <p className="text-gray-400 text-sm">Google, Outlook integration</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">📹</div>
              <h3 className="font-semibold text-white">Multi-Platform</h3>
              <p className="text-gray-400 text-sm">Google Meet, Zoom, Teams</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🎥</div>
              <h3 className="font-semibold text-white">Auto Recording</h3>
              <p className="text-gray-400 text-sm">Cloud storage & playback</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="font-semibold text-white">AI Summaries</h3>
              <p className="text-gray-400 text-sm">Transcription & insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}