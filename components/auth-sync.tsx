'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useAuth } from '@/lib/store/auth'
import { mergeGuestCartOnLogin } from '@/app/actions/cart'

export function AuthSync() {
  const { data: session, status } = useSession()
  const { setUser, setHydrated, user } = useAuth()
  const syncedSessionRef = useRef<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const sessionKey = `${session.user.id}-${session.user.email}-${session.user.role}`
      if (syncedSessionRef.current !== sessionKey) {
        syncedSessionRef.current = sessionKey
        setUser({
          id: session.user.id as string,
          name: session.user.name as string,
          email: session.user.email as string,
          role: session.user.role as string,
        })
        mergeGuestCartOnLogin()
      }
    } else if (status === 'unauthenticated') {
      if (user !== null) {
        setUser(null)
      }
    }

    if (status !== 'loading') {
      setHydrated()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status])

  return null
}
