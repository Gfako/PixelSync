import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import LinkedInProvider from 'next-auth/providers/linkedin'
import CredentialsProvider from 'next-auth/providers/credentials'
import { validateUser, createUser } from './user-store'

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET environment variable is required')
}

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
            // Create new user
            const name = credentials.email.split('@')[0]
            const newUser = await createUser(credentials.email, credentials.password, name)
            
            return {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
              image: null
            }
          } catch (error: any) {
            throw new Error('User already exists')
          }
        } else {
          // Sign in existing user
          const user = await validateUser(credentials.email, credentials.password)
          
          if (!user) {
            throw new Error('Invalid email or password')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: null
          }
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-google-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-google-secret',
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || 'dummy-linkedin-id',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || 'dummy-linkedin-secret',
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  debug: process.env.NODE_ENV === 'development' // Only enable debug in development
}