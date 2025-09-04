'use client'

import { useEffect } from 'react'
import { RefreshCw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-purple-900 to-pink-900 p-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-gray-700 p-8 shadow-2xl">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">💥</span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Application Error
                </h1>
                <p className="text-gray-300">
                  A critical error occurred. Please refresh the page to continue.
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={reset}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Application
                </button>
                
                <button 
                  onClick={() => window.location.href = '/'}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-200"
                >
                  <Home className="w-4 h-4" />
                  Go to Home
                </button>
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
      </body>
    </html>
  )
}