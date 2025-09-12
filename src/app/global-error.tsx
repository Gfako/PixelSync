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
      <body style={{background: 'var(--background)', color: 'var(--foreground)', fontFamily: 'var(--font-sans)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
        <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'var(--background)'}}>
          <div className="max-w-md w-full text-center">
            <div style={{background: 'var(--card)', border: '4px solid var(--border)', borderRadius: '0px', boxShadow: 'var(--shadow-lg)', padding: '2rem'}}>
              <div className="mb-6">
                <div style={{width: '4rem', height: '4rem', background: 'var(--destructive)', border: '4px solid var(--border)', borderRadius: '0px', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--destructive-foreground)'}}>
                  <span style={{fontSize: '1.5rem'}}>💥</span>
                </div>
                <h1 style={{fontSize: '1.5rem', fontWeight: '800', color: 'var(--foreground)', marginBottom: '0.5rem'}}>
                  APPLICATION ERROR
                </h1>
                <p style={{color: 'var(--foreground)', opacity: '0.8'}}>
                  A CRITICAL ERROR OCCURRED. PLEASE REFRESH THE PAGE TO CONTINUE.
                </p>
              </div>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                <button
                  onClick={reset}
                  style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--destructive)', color: 'var(--destructive-foreground)', border: '4px solid var(--border)', padding: '1rem 2rem', fontFamily: 'var(--font-sans)', fontWeight: '800', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', boxShadow: 'var(--shadow-lg)', cursor: 'pointer', borderRadius: '0px'}}
                >
                  <RefreshCw style={{width: '1rem', height: '1rem'}} />
                  RESET APPLICATION
                </button>
                
                <button 
                  onClick={() => window.location.href = '/'}
                  style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--card)', color: 'var(--foreground)', border: '4px solid var(--border)', padding: '1rem 2rem', fontFamily: 'var(--font-sans)', fontWeight: '700', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', boxShadow: 'var(--shadow-lg)', cursor: 'pointer', borderRadius: '0px'}}
                >
                  <Home style={{width: '1rem', height: '1rem'}} />
                  GO TO HOME
                </button>
              </div>
              
              {error.message && (
                <div style={{marginTop: '1.5rem', padding: '1rem', background: 'var(--destructive)', border: '4px solid var(--border)', borderRadius: '0px'}}>
                  <p style={{color: 'var(--destructive-foreground)', fontSize: '0.875rem', fontFamily: 'monospace'}}>
                    {error.message.toUpperCase()}
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