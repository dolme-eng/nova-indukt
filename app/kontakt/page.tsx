import type { Metadata } from 'next'
import { KontaktContent } from './KontaktContent'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Kontaktieren Sie NOVA INDUKT. Wir sind für Sie da! Kundenservice, Beratung, Bestellungen. Rufen Sie uns an, schreiben Sie uns oder besuchen Sie uns vor Ort.',
  keywords: ['Kontakt', 'Kundenservice', 'Hilfe', 'Beratung', 'NOVA INDUKT', 'Berlin'],
  alternates: {
    canonical: '/kontakt',
  },
  openGraph: {
    title: 'Kontakt | NOVA INDUKT',
    description: 'Kontaktieren Sie NOVA INDUKT. Wir sind für Sie da!',
    url: 'https://nova-indukt.de/kontakt',
    siteName: 'NOVA INDUKT',
    images: [{ url: 'https://nova-indukt.de/og-image.png', width: 1200, height: 630, alt: 'NOVA INDUKT' }],
    type: 'website',
  },
}

export default function KontaktPage() {
  return <KontaktContent />
}
