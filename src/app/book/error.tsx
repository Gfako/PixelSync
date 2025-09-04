'use client'

import { useEffect } from 'react'
import { RefreshCw, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function BookingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Booking page error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xl">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Page Error
            </h1>
            <p className="text-gray-600">
              There was an issue loading this booking page. Please try refreshing or contact the meeting host.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            
            <Link 
              href="/scheduling"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
            >
              <Calendar className="w-4 h-4" />
              Back to Scheduling
            </Link>
          </div>
          
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <p className="text-red-600 text-sm font-mono">
                {error.message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}