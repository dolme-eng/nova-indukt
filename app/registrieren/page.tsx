import type { Metadata } from 'next'
import { RegisterContent } from './RegisterContent'
import { SHOP_DOMAIN } from '@/lib/constants/shop'

export const metadata: Metadata = {
  title: 'Registrieren',
  description: 'Erstellen Sie Ihr NOVA INDUKT Kundenkonto. Genießen Sie Vorteile wie schnelleres Bestellen, Bestellverfolgung und persönliche Wunschliste.',
  keywords: ['Registrieren', 'Konto erstellen', 'Kundenkonto', 'NOVA INDUKT', 'Mitglied werden'],
  alternates: {
    canonical: `${SHOP_DOMAIN}/registrieren`,
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function RegisterPage() {
  return <RegisterContent />
}
