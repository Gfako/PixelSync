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
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'var(--background)'}}>
      <div className="max-w-md w-full text-center">
        <div className="brutalist-card">
          <div className="mb-6">
            <div className="w-16 h-16 brutalist-card flex items-center justify-center mx-auto mb-4" style={{background: 'var(--destructive)', color: 'var(--destructive-foreground)'}}>
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold brutalist-text mb-2">
              SOMETHING WENT WRONG
            </h1>
            <p className="brutalist-text opacity-80">
              AN ERROR OCCURRED WHILE LOADING THIS PAGE. PLEASE TRY REFRESHING OR RETURN TO THE HOME PAGE.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full brutalist-button flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              TRY AGAIN
            </button>
            
            <Link 
              href="/"
              className="w-full brutalist-button-secondary flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              GO HOME
            </Link>
          </div>
          
          {error.message && (
            <div className="mt-6 brutalist-card" style={{background: 'var(--destructive)', borderColor: 'var(--border)'}}>
              <p className="text-sm font-mono" style={{color: 'var(--destructive-foreground)'}}>
                {error.message.toUpperCase()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}