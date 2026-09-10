import type { Metadata } from 'next'
import { SHOP_DOMAIN } from '@/lib/constants/shop'

export const metadata: Metadata = {
  title: 'Bestellung aufgegeben',
  description: 'Vielen Dank für Ihre Bestellung bei NOVA INDUKT.',
  alternates: {
    canonical: `${SHOP_DOMAIN}/danke`,
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function DankeLayout({ children }: { children: React.ReactNode }) {
  return children
}
