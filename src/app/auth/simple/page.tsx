'use client'

import { useState } from 'react'

export default function SimpleAuthPage() {
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [formError, setFormError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (isSignUp && password !== confirmPassword) {
      setFormError('Passwords do not match')
      return
    }

    if (!email || !password) {
      setFormError('Please fill in all fields')
      return
    }

    // Mock authentication - just show success message
    console.log('Form submitted:', { email, password, isSignUp })
    alert(isSignUp ? 'Account created successfully!' : 'Signed in successfully!')
    
    // Reset form
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setFormError('')
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

            {/* Email/Password Form */}
            {showEmailForm ? (
              <form onSubmit={handleSubmit} className="space-y-4">
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

                {formError && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                    <p className="text-red-300 text-sm">{formError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      setFormError('')
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
                      setFormError('')
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
                  className="w-full flex items-center justify-center px-6 py-4 border border-gray-600 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
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
                    onClick={() => alert('Google sign-in would work here!')}
                    className="w-full flex items-center justify-center px-6 py-4 border border-gray-600 rounded-xl bg-white text-gray-900 hover:bg-gray-100 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <button
                    onClick={() => alert('LinkedIn sign-in would work here!')}
                    className="w-full flex items-center justify-center px-6 py-4 border border-gray-600 rounded-xl bg-[#0077b5] text-white hover:bg-[#005885] transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-3 fill-current" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Continue with LinkedIn
                  </button>

                  <button
                    onClick={() => alert('GitHub sign-in would work here!')}
                    className="w-full flex items-center justify-center px-6 py-4 border border-gray-600 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-3 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Continue with GitHub
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
            Simple authentication UI (no backend required)
          </p>
        </div>
      </div>
    </div>
  )
}