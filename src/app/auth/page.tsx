'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthSimple } from '@/hooks/useAuthSimple'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { user, signIn, signUp, loading: authLoading } = useAuthSimple()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      router.push('/')
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!email || !password) {
      setError('Please fill in all required fields')
      setIsLoading(false)
      return
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      if (isSignUp) {
        const { user: newUser, error: signUpError } = await signUp(email, password, fullName)
        if (signUpError) {
          setError(signUpError)
        } else if (newUser) {
          // Sign up successful - user will be redirected by useEffect
          console.log('Sign up successful')
        }
      } else {
        const { user: signedInUser, error: signInError } = await signIn(email, password)
        if (signInError) {
          setError(signInError)
        } else if (signedInUser) {
          // Sign in successful - user will be redirected by useEffect
          console.log('Sign in successful')
        }
      }
    } catch (error: any) {
      setError('An unexpected error occurred')
      console.error('Auth error:', error)
    }

    setIsLoading(false)
  }

  // Show loading spinner while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--background)'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-foreground mx-auto mb-4" style={{borderColor: 'var(--foreground)'}}></div>
          <div className="text-xl brutalist-text">LOADING...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'var(--background)'}}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 brutalist-card flex items-center justify-center" style={{background: 'var(--primary)', color: 'var(--primary-foreground)'}}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold brutalist-text mb-2">WELCOME TO PIXELSYNC</h1>
          <p className="brutalist-text text-lg opacity-80">BRUTAL MEETING SCHEDULER</p>
        </div>
        
        {/* Auth Card */}
        <div className="brutalist-card p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold brutalist-text mb-2">
                {isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
              </h2>
              <p className="brutalist-text opacity-80">
                {isSignUp ? 'JOIN PIXELSYNC TO START SCHEDULING' : 'WELCOME BACK! PLEASE SIGN IN TO CONTINUE'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium brutalist-text mb-2">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="name"
                    className="w-full brutalist-input"
                    placeholder="ENTER YOUR FULL NAME"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium brutalist-text mb-2">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full brutalist-input"
                  placeholder="ENTER YOUR EMAIL"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium brutalist-text mb-2">
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  className="w-full brutalist-input"
                  placeholder="ENTER YOUR PASSWORD"
                />
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium brutalist-text mb-2">
                    CONFIRM PASSWORD
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="w-full brutalist-input"
                    placeholder="CONFIRM YOUR PASSWORD"
                  />
                </div>
              )}

              {error && (
                <div className="brutalist-card p-3" style={{background: 'var(--destructive)', borderColor: 'var(--border)'}}>
                  <p className="text-sm font-bold" style={{color: 'var(--background)'}}>{error.toUpperCase()}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full brutalist-button flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-4 mr-3" style={{borderColor: 'var(--primary-foreground)'}}></div>
                    {isSignUp ? 'CREATING ACCOUNT...' : 'SIGNING IN...'}
                  </div>
                ) : (
                  <>{isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}</>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError('')
                    setPassword('')
                    setConfirmPassword('')
                    setFullName('')
                  }}
                  className="brutalist-text text-sm font-bold underline opacity-80 hover:opacity-100"
                >
                  {isSignUp ? 'ALREADY HAVE AN ACCOUNT? SIGN IN' : 'NEED AN ACCOUNT? SIGN UP'}
                </button>
              </div>
            </form>

            {/* Features Preview */}
            <div className="pt-6" style={{borderTop: '4px solid var(--border)'}}>
              <p className="text-center text-sm brutalist-text mb-4 font-bold">WHAT YOU'LL GET WITH PIXELSYNC:</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center brutalist-card p-3">
                  <div className="text-2xl mb-1">🗓️</div>
                  <p className="text-xs brutalist-text font-bold">CALENDAR SYNC</p>
                </div>
                <div className="text-center brutalist-card p-3">
                  <div className="text-2xl mb-1">🤖</div>
                  <p className="text-xs brutalist-text font-bold">AI SUMMARIES</p>
                </div>
                <div className="text-center brutalist-card p-3">
                  <div className="text-2xl mb-1">📹</div>
                  <p className="text-xs brutalist-text font-bold">AUTO RECORDING</p>
                </div>
                <div className="text-center brutalist-card p-3">
                  <div className="text-2xl mb-1">🔒</div>
                  <p className="text-xs brutalist-text font-bold">SECURE & PRIVATE</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="brutalist-text text-sm flex items-center justify-center opacity-80">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            SECURE AUTHENTICATION POWERED BY SUPABASE
          </p>
        </div>
      </div>
    </div>
  )
}