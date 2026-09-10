import type { Metadata } from 'next'
import AccountPageClient from './AccountPageClient'
import { SHOP_DOMAIN } from '@/lib/constants/shop'

export const metadata: Metadata = {
  title: 'Mein Konto',
  description: 'Verwalten Sie Ihr NOVA INDUKT Kundenkonto. Bestellungen, Wunschliste, Adressen und Kontoeinstellungen.',
  keywords: ['Kundenkonto', 'Mein Konto', 'Bestellungen', 'Wunschliste', 'NOVA INDUKT'],
  alternates: {
    canonical: `${SHOP_DOMAIN}/mein-konto`,
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function AccountPage() {
  return <AccountPageClient />
}
