import type { Metadata } from 'next'
import { LoginContent } from './LoginContent'

export const metadata: Metadata = {
  title: 'Anmelden | NOVA INDUKT',
  description: 'Melden Sie sich bei Ihrem NOVA INDUKT Kundenkonto an. Greifen Sie auf Ihre Bestellungen, Wunschliste und Kontoeinstellungen zu.',
  keywords: ['Anmelden', 'Login', 'Kundenkonto', 'NOVA INDUKT', 'Authentifizierung'],
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return <LoginContent />
}
