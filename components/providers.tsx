"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import { CsrfProvider } from "./csrf-provider"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider refetchInterval={5 * 60}>
      <CsrfProvider>
        {children}
      </CsrfProvider>
    </SessionProvider>
  )
}
