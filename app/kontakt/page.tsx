import type { Metadata } from 'next'
import { KontaktContent } from './KontaktContent'

export const metadata: Metadata = {
  title: 'Kontakt | NOVA INDUKT',
  description: 'Kontaktieren Sie NOVA INDUKT. Wir sind für Sie da! Kundenservice, Beratung, Bestellungen. Rufen Sie uns an, schreiben Sie uns oder besuchen Sie uns vor Ort.',
  keywords: ['Kontakt', 'Kundenservice', 'Hilfe', 'Beratung', 'NOVA INDUKT', 'Berlin'],
  openGraph: {
    title: 'Kontakt | NOVA INDUKT',
    description: 'Kontaktieren Sie NOVA INDUKT. Wir sind für Sie da!',
    type: 'website',
  },
}

export default function KontaktPage() {
  return <KontaktContent />
}
