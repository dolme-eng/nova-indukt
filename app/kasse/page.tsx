import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { SHOP_DOMAIN } from '@/lib/constants/shop'

const CheckoutContent = dynamic(() => import('./CheckoutContent'), {
  loading: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4ECCA3]/30 border-t-[#4ECCA3]" />
    </div>
  ),
})

export const metadata: Metadata = {
  title: 'Kasse',
  description: 'Sichere Bezahlung und schnelle Lieferung Ihrer NOVA INDUKT Bestellung. Versandkostenfrei ab 500€.',
  keywords: ['Kasse', 'Bestellung', 'Bezahlung', 'Versand', 'NOVA INDUKT', 'Einkauf'],
  alternates: {
    canonical: `${SHOP_DOMAIN}/kasse`,
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function CheckoutPage() {
  return <CheckoutContent />
}
