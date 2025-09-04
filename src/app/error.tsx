'use client'

import { useEffect } from 'react'
import { RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-gray-700 p-8 shadow-2xl">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-300">
              An error occurred while loading this page. Please try refreshing or return to the home page.
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
              href="/"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-200"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>
          
          {error.message && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm font-mono">
                {error.message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}