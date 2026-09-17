'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useAuth } from '@/lib/store/auth'
import { useCartStore } from '@/lib/store/cart'
import { mergeGuestCartOnLogin } from '@/app/actions/cart'
import { logError } from '@/lib/logger'

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
        // guest(cookie) → DB, then DB → store (server truth wins).
        // Errors are logged; local cart is kept as fallback.
        mergeGuestCartOnLogin()
          .catch((err) => logError('Failed to merge guest cart:', err))
          .finally(() => {
            useCartStore.getState().syncFromServer()
          })
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
