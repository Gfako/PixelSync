'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'

export default function SignInPage() {
  const { signIn: useAuthSignIn, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSigningIn, setIsSigningIn] = useState<'google' | 'linkedin' | 'credentials' | null>(null)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [credentialsError, setCredentialsError] = useState('')
  
  const error = searchParams.get('error')
  const success = searchParams.get('success')

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleGoogleSignIn = async () => {
    setIsSigningIn('google')
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      setIsSigningIn(null)
    }
  }

  const handleLinkedInSignIn = async () => {
    setIsSigningIn('linkedin')
    try {
      await signIn('linkedin', { callbackUrl: '/' })
    } catch (error) {
      setIsSigningIn(null)
    }
  }

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setCredentialsError('')
    setIsSigningIn('credentials')

    if (isSignUp && password !== confirmPassword) {
      setCredentialsError('Passwords do not match')
      setIsSigningIn(null)
      return
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        mode: isSignUp ? 'signup' : 'signin',
        redirect: false
      })

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          if (isSignUp) {
            setCredentialsError('User already exists with this email')
          } else {
            setCredentialsError('Invalid email or password')
          }
        } else {
          setCredentialsError('Authentication failed. Please try again.')
        }
      } else if (result?.ok) {
        router.push('/')
      }
    } catch (error) {
      setCredentialsError('An error occurred during sign in')
    }
    setIsSigningIn(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to PixelSync</h1>
          <p className="text-gray-300 text-lg">Smart meeting scheduler with AI-powered insights</p>
        </div>
        
        {/* Sign In Card */}
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-gray-700 p-8 shadow-2xl">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                Sign in or create account
              </h2>
              <p className="text-gray-400">
                Choose your preferred method to continue
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-red-300 text-sm">
                    {error === 'calendar_access_denied' && 'Calendar access was denied. You can still use PixelSync without calendar integration.'}
                    {error === 'invalid_callback' && 'Authentication failed. Please try again.'}
                    {error === 'calendar_integration_failed' && 'Calendar integration failed, but you can connect it later in settings.'}
                    {!['calendar_access_denied', 'invalid_callback', 'calendar_integration_failed'].includes(error) && 'Authentication failed. Please try again.'}
                  </span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-300 text-sm">
                    {success === 'google_calendar_connected' && 'Google Calendar successfully connected!'}
                    {success === 'outlook_calendar_connected' && 'Outlook Calendar successfully connected!'}
                  </span>
                </div>
              </div>
            )}

            {/* Email/Password Form */}
            {showEmailForm ? (
              <form onSubmit={handleCredentialsSignIn} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>

                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirm your password"
                    />
                  </div>
                )}

                {credentialsError && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                    <p className="text-red-300 text-sm">{credentialsError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSigningIn === 'credentials'}
                  className="w-full flex items-center justify-center px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSigningIn === 'credentials' ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      {isSignUp ? 'Creating Account...' : 'Signing In...'}
                    </div>
                  ) : (
                    <>{isSignUp ? 'Create Account' : 'Sign In'}</>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      setCredentialsError('')
                      setPassword('')
                      setConfirmPassword('')
                    }}
                    className="text-blue-400 hover:text-blue-300 text-sm underline"
                  >
                    {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmailForm(false)
                      setCredentialsError('')
                      setEmail('')
                      setPassword('')
                      setConfirmPassword('')
                    }}
                    className="text-gray-400 hover:text-gray-300 text-sm"
                  >
                    ← Back to other options
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Email/Password Button */}
                <button
                  onClick={() => setShowEmailForm(true)}
                  disabled={isSigningIn !== null}
                  className="w-full flex items-center justify-center px-6 py-4 border border-gray-600 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  Continue with Email
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-black/20 text-gray-400">Or continue with</span>
                  </div>
                </div>

                {/* Social Sign In Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isSigningIn !== null}
                    className="w-full flex items-center justify-center px-6 py-4 border border-gray-600 rounded-xl bg-white text-gray-900 hover:bg-gray-100 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSigningIn === 'google' ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-3"></div>
                        Connecting...
                      </div>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleLinkedInSignIn}
                    disabled={isSigningIn !== null}
                    className="w-full flex items-center justify-center px-6 py-4 border border-gray-600 rounded-xl bg-[#0077b5] text-white hover:bg-[#005885] transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSigningIn === 'linkedin' ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Connecting...
                      </div>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-3 fill-current" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        Continue with LinkedIn
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black/20 text-gray-400">New to PixelSync?</span>
              </div>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl mb-1">🗓️</div>
                <p className="text-xs text-gray-400">Calendar Sync</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🤖</div>
                <p className="text-xs text-gray-400">AI Summaries</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">📹</div>
                <p className="text-xs text-gray-400">Auto Recording</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🔒</div>
                <p className="text-xs text-gray-400">Secure & Private</p>
              </div>
            </div>

            {/* Terms */}
            <div className="text-center pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">
                By continuing, you agree to our{' '}
                <a href="/terms" className="text-blue-400 hover:text-blue-300 underline">Terms of Service</a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure authentication powered by NextAuth.js
          </p>
        </div>
      </div>
    </div>
  )
}