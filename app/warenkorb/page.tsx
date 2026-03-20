import type { Metadata } from 'next'
import { CartContent } from './CartContent'

export const metadata: Metadata = {
  title: 'Warenkorb | NOVA INDUKT',
  description: 'Überprüfen Sie Ihre ausgewählten Produkte im Warenkorb. Sichere Bezahlung, kostenloser Versand ab 500€.',
  keywords: ['Warenkorb', 'Einkauf', 'Bestellung', 'Kasse', 'NOVA INDUKT'],
  robots: {
    index: false,
    follow: false,
  },
}

export default function CartPage() {
  return <CartContent />
}
