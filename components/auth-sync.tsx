"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useAuth } from "@/lib/store/auth"
import { mergeGuestCartOnLogin } from "@/app/actions/cart"

export function AuthSync() {
  const { data: session, status } = useSession()
  const { setUser, setHydrated } = useAuth()
  
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id as string,
        name: session.user.name as string,
        email: session.user.email as string,
        role: session.user.role as string
      })
      
      // Merge guest cart on login
      mergeGuestCartOnLogin()
    } else if (status === "unauthenticated") {
      setUser(null)
    }
    
    if (status !== "loading") {
      setHydrated()
    }
  }, [session, status, setUser, setHydrated])
  
  return null
}
