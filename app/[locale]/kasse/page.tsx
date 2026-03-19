import type { Metadata } from 'next'
import CheckoutContent from './CheckoutContent'

export const metadata: Metadata = {
  title: 'Kasse | NOVA INDUKT',
  description: 'Sichere Bezahlung und schnelle Lieferung Ihrer NOVA INDUKT Bestellung. Versandkostenfrei ab 500€.',
  keywords: ['Kasse', 'Bestellung', 'Bezahlung', 'Versand', 'NOVA INDUKT', 'Einkauf'],
  robots: {
    index: false,
    follow: false,
  },
}

export default function CheckoutPage() {
  return <CheckoutContent />
}
