'use client'

import { useAuth } from '@/hooks/useAuth'

export default function AppHeader() {
  const { session, userProfile, signOut } = useAuth()

  const user = userProfile || session?.user
  if (!user) return null

  const handleSignOut = async () => {
    await signOut()
  }

  const getUserInitials = (user: any) => {
    const name = user.full_name || user.name || user.email || 'U'
    return name[0].toUpperCase()
  }

  const getUserDisplayName = (user: any) => {
    return user.full_name || user.name || user.email?.split('@')[0] || 'User'
  }

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Welcome to PixelSync</h1>
        <p className="text-gray-300">Hello, {getUserDisplayName(user)}!</p>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* User Info */}
        <div className="flex items-center space-x-3 bg-white/10 rounded-lg px-3 py-2">
          {/* Avatar */}
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            {user.avatar_url || user.image ? (
              <img
                src={user.avatar_url || user.image}
                alt={getUserDisplayName(user)}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = `<span class="text-white font-semibold text-sm">${getUserInitials(user)}</span>`
                  }
                }}
              />
            ) : (
              <span className="text-white font-semibold text-sm">
                {getUserInitials(user)}
              </span>
            )}
          </div>
          
          {/* Name */}
          <div className="text-left">
            <p className="text-white font-medium text-sm truncate max-w-32">
              {getUserDisplayName(user)}
            </p>
            <p className="text-gray-300 text-xs truncate max-w-32">
              {user.email}
            </p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}