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
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

// Mock users database (in real app, this would be backend)
const mockUsers: { email: string; password: string; user: User }[] = [
  {
    email: 'demo@nova.de',
    password: 'demo123',
    user: { id: '1', name: 'Max Mustermann', email: 'demo@nova.de' }
  }
]

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const found = mockUsers.find(u => u.email === email && u.password === password)
        
        if (found) {
          set({ user: found.user, isAuthenticated: true })
          return true
        }
        
        return false
      },

      register: async (name: string, email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Check if email already exists
        if (mockUsers.find(u => u.email === email)) {
          return false
        }
        
        // Create new user
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email
        }
        
        mockUsers.push({ email, password, user: newUser })
        set({ user: newUser, isAuthenticated: true })
        
        return true
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      }
    }),
    {
      name: 'nova-auth',
      skipHydration: true
    }
  )
)
