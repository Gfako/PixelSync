import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import LinkedInProvider from 'next-auth/providers/linkedin'
import CredentialsProvider from 'next-auth/providers/credentials'
import { SupabaseAdapter } from '@next-auth/supabase-adapter'
import { supabase, createServiceClient } from './supabase'
import { ApiError } from './database.types'

// Custom error class for authentication
export class AuthError extends Error {
  code: number
  
  constructor(message: string, code: number = 500) {
    super(message)
    this.name = 'AuthError'
    this.code = code
  }
}

// Helper function to create API error response
export const createApiError = (error: string, message: string, code: number = 500): ApiError => ({
  error,
  message,
  code,
  timestamp: new Date().toISOString()
})

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        mode: { label: 'Mode', type: 'text' } // 'signin' or 'signup'
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const mode = credentials.mode || 'signin'

        if (mode === 'signup') {
          try {
            // Create new user in Supabase Auth using service client
            const serviceClient = createServiceClient()
            const { data, error } = await serviceClient.auth.admin.createUser({
              email: credentials.email,
              password: credentials.password,
              email_confirm: true
            })

            if (error || !data.user) {
              console.error('Supabase signup error:', error)
              if (error?.message?.includes('already registered')) {
                throw new Error('User already exists')
              }
              throw new Error(error?.message || 'Failed to create user')
            }

            // Create user profile
            const name = credentials.email.split('@')[0]
            const { error: profileError } = await serviceClient
              .from('user_profiles')
              .insert({
                user_id: data.user.id,
                email: credentials.email,
                full_name: name,
                timezone: 'UTC',
                preferred_meeting_platform: 'google_meet',
                business_hours: {},
                buffer_time_minutes: 15,
                max_meeting_duration_hours: 4,
                allow_recording: true,
                auto_transcribe: false,
                is_active: true
              })

            if (profileError) {
              console.error('Error creating user profile:', profileError)
            }
            
            return {
              id: data.user.id,
              email: data.user.email!,
              name: name,
              image: null
            }
          } catch (error: any) {
            console.error('Signup error:', error)
            throw new Error(error.message || 'Failed to create account')
          }
        } else {
          // Sign in existing user
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: credentials.email,
              password: credentials.password,
            })

            if (error || !data.user) {
              console.error('Supabase signin error:', error)
              throw new Error(error?.message || 'Invalid email or password')
            }

            return {
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata.full_name || data.user.email!.split('@')[0],
              image: data.user.user_metadata.avatar_url || null
            }
          } catch (error: any) {
            console.error('Signin error:', error)
            throw new Error('Invalid email or password')
          }
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-google-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-google-secret',
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events'
        }
      }
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || 'dummy-linkedin-id',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || 'dummy-linkedin-secret',
      authorization: {
        params: {
          scope: 'r_liteprofile r_emailaddress'
        }
      }
    })
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_KEY!
  }),
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Store OAuth tokens for calendar access
      if (account && user) {
        const serviceClient = createServiceClient()
        
        try {
          // Store OAuth provider information
          const { error: oauthError } = await serviceClient
            .from('oauth_providers')
            .upsert({
              user_id: user.id,
              provider: account.provider,
              provider_user_id: account.providerAccountId,
              provider_email: user.email,
              access_token: account.access_token || '',
              refresh_token: account.refresh_token || null,
              expires_at: account.expires_at ? new Date(account.expires_at * 1000).toISOString() : null
            }, {
              onConflict: 'user_id,provider'
            })

          if (oauthError) {
            console.error('Failed to store OAuth provider:', oauthError)
          }

          // For Google, also store calendar integration
          if (account.provider === 'google' && account.access_token) {
            const { error: calendarError } = await serviceClient
              .from('calendar_integrations')
              .upsert({
                user_id: user.id,
                provider: 'google',
                provider_calendar_id: 'primary',
                access_token: account.access_token,
                refresh_token: account.refresh_token || null,
                expires_at: account.expires_at ? new Date(account.expires_at * 1000).toISOString() : null,
                is_primary: true
              }, {
                onConflict: 'user_id,provider,provider_calendar_id'
              })

            if (calendarError) {
              console.error('Failed to store calendar integration:', calendarError)
            }
          }
        } catch (error) {
          console.error('Error in JWT callback:', error)
        }
      }

      return token
    },
    async session({ session, token }) {
      // Add user ID to session
      if (token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async signIn({ user, account, profile }) {
      try {
        // Verify user profile exists
        if (user.id && user.email && user.name) {
          const serviceClient = createServiceClient()
          
          // Check if user profile exists, create if not
          const { data: existingProfile } = await serviceClient
            .from('user_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()

          if (!existingProfile) {
            const { error: profileError } = await serviceClient
              .from('user_profiles')
              .insert({
                user_id: user.id,
                full_name: user.name,
                email: user.email,
                avatar_url: user.image || null
              })

            if (profileError) {
              console.error('Failed to create user profile:', profileError)
              return false
            }
          }
        }
        
        return true
      } catch (error) {
        console.error('Sign in error:', error)
        return false
      }
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error'
  },
  events: {
    async createUser({ user }) {
      // Additional user creation logic can go here
      console.log('New user created:', user.email)
    },
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', user.email, 'Provider:', account?.provider)
    }
  }
}