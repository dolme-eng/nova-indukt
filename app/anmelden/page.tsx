import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LoginContent } from './LoginContent'

export const metadata: Metadata = {
  title: 'Anmelden',
  description: 'Melden Sie sich bei Ihrem NOVA INDUKT Kundenkonto an. Greifen Sie auf Ihre Bestellungen, Wunschliste und Kontoeinstellungen zu.',
  keywords: ['Anmelden', 'Login', 'Kundenkonto', 'NOVA INDUKT', 'Authentifizierung'],
  alternates: {
    canonical: '/anmelden',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4ECCA3]/30 border-t-[#4ECCA3]" /></div>}>
      <LoginContent />
    </Suspense>
  )
}
