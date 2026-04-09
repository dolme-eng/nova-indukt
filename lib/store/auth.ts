'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isHydrated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  setHydrated: () => void
}

// Demo authentication - for production, connect to real backend API
// Backend endpoints needed:
// POST /api/auth/login
// POST /api/auth/register
// POST /api/auth/logout

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,

      login: async (email: string, password: string) => {
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 800))
          
          // Demo mode: accept demo@nova.de / demo123 or any email with password >= 6 chars
          if ((email === 'demo@nova.de' && password === 'demo123') || 
              (email.includes('@') && password.length >= 6)) {
            set({
              user: {
                id: 'demo-user-' + Date.now(),
                name: email.split('@')[0],
                email: email
              },
              isAuthenticated: true
            })
            return true
          }
          
          return false
        } catch (error) {
          console.error('Login error:', error)
          return false
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Demo mode: auto-login after registration
          if (email.includes('@') && password.length >= 6 && name.length >= 2) {
            set({
              user: {
                id: 'user-' + Date.now(),
                name: name,
                email: email
              },
              isAuthenticated: true
            })
            return true
          }
          
          return false
        } catch (error) {
          console.error('Registration error:', error)
          return false
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      setHydrated: () => {
        set({ isHydrated: true })
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
