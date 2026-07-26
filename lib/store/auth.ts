'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { signIn, signOut } from 'next-auth/react'

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
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>
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
            redirect: false,
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
            body: JSON.stringify({ name, email, password }),
          })

          const data = await response.json()

          if (!data.success) {
            return { success: false, error: data.error || 'Registrierung fehlgeschlagen' }
          }

          // Do NOT auto-login after registration.
          // User must verify their email first, then log in manually.
          return { success: true }
        } catch (error) {
          console.error('Registration error:', error)
          return { success: false, error: 'Registrierung fehlgeschlagen' }
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
          isAuthenticated: !!user,
        })
      },
    }),
    {
      name: 'nova-auth',
      onRehydrateStorage: (state) => {
        return () => state?.setHydrated()
      },
    }
  )
)
