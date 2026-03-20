import type { Metadata } from 'next'
import { RegisterContent } from './RegisterContent'

export const metadata: Metadata = {
  title: 'Registrieren | NOVA INDUKT',
  description: 'Erstellen Sie Ihr NOVA INDUKT Kundenkonto. Genießen Sie Vorteile wie schnelleres Bestellen, Bestellverfolgung und persönliche Wunschliste.',
  keywords: ['Registrieren', 'Konto erstellen', 'Kundenkonto', 'NOVA INDUKT', 'Mitglied werden'],
  robots: {
    index: false,
    follow: false,
  },
}

export default function RegisterPage() {
  return <RegisterContent />
}
