'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  role?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isHydrated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  setHydrated: () => void
  setUser: (user: User | null) => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,

      login: async (email: string, password: string) => {
        try {
          const result = await signIn('credentials', {
            email,
            password,
            redirect: false
          })
          
          if (result?.error) {
            return false
          }
          
          return true
        } catch (error) {
          console.error('Login error:', error)
          return false
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
          })
          
          const data = await response.json()
          
          if (!data.success) {
            return false
          }
          
          // Auto login after registration
          const result = await signIn('credentials', {
            email,
            password,
            redirect: false
          })
          
          return !result?.error
        } catch (error) {
          console.error('Registration error:', error)
          return false
        }
      },

      logout: async () => {
        await signOut({ redirect: false })
        set({ user: null, isAuthenticated: false })
      },

      setHydrated: () => {
        set({ isHydrated: true })
      },

      setUser: (user: User | null) => {
        set({ 
          user, 
          isAuthenticated: !!user 
        })
      }
    }),
    {
      name: 'nova-auth',
      onRehydrateStorage: (state) => {
        return () => state?.setHydrated()
      }
    }
  )
)

// Hook to sync NextAuth session with Zustand store
export function useAuthSync() {
  const { data: session, status } = useSession()
  const { setUser, setHydrated } = useAuth()
  
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser({
        id: session.user.id as string,
        name: session.user.name as string,
        email: session.user.email as string,
        role: session.user.role as string
      })
    } else if (status === 'unauthenticated') {
      setUser(null)
    }
    
    if (status !== 'loading') {
      setHydrated()
    }
  }, [session, status, setUser, setHydrated])
}

