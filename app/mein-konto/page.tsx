import type { Metadata } from 'next'
import AccountPageClient from './AccountPageClient'

export const metadata: Metadata = {
  title: 'Mein Konto | NOVA INDUKT',
  description: 'Verwalten Sie Ihr NOVA INDUKT Kundenkonto. Bestellungen, Wunschliste, Adressen und Kontoeinstellungen.',
  keywords: ['Kundenkonto', 'Mein Konto', 'Bestellungen', 'Wunschliste', 'NOVA INDUKT'],
  robots: {
    index: false,
    follow: false,
  },
}

export default function AccountPage() {
  return <AccountPageClient />
}
