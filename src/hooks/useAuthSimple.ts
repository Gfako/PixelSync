import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { signIn, signUp, signOut, getCurrentUser, transformUser, type AuthUser } from '@/lib/auth-simple'
import type { User } from '@supabase/supabase-js'

export function useAuthSimple() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        setUser(transformUser(session?.user ?? null))
      } catch (error) {
        console.error('Error initializing auth:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        setUser(transformUser(session?.user ?? null))
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true)
    const result = await signIn(email, password)
    setLoading(false)
    return result
  }

  const handleSignUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true)
    const result = await signUp(email, password, fullName)
    setLoading(false)
    return result
  }

  const handleSignOut = async () => {
    setLoading(true)
    const result = await signOut()
    setLoading(false)
    return result
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut
  }
}