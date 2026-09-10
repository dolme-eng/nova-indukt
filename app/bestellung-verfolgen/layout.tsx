import type { Metadata } from 'next'
import { SHOP_DOMAIN } from '@/lib/constants/shop'

export const metadata: Metadata = {
  title: 'Bestellung verfolgen',
  description: 'Verfolgen Sie den Status Ihrer NOVA INDUKT Bestellung.',
  alternates: {
    canonical: `${SHOP_DOMAIN}/bestellung-verfolgen`,
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function BestellungVerfolgenLayout({ children }: { children: React.ReactNode }) {
  return children
}
