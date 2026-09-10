import type { Metadata } from 'next'
import WishlistContent from './WishlistContent'
import { SHOP_DOMAIN } from '@/lib/constants/shop'

export const metadata: Metadata = {
  title: 'Wunschliste',
  description: 'Ihre persönliche Wunschliste bei NOVA INDUKT. Speichern Sie Ihre Lieblingsprodukte und kaufen Sie sie später.',
  keywords: ['Wunschliste', 'Merkliste', 'Favoriten', 'NOVA INDUKT', 'Induktionskochfeld'],
  alternates: {
    canonical: `${SHOP_DOMAIN}/wunschliste`,
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Wunschliste | NOVA INDUKT',
    description: 'Ihre persönliche Wunschliste bei NOVA INDUKT. Speichern Sie Ihre Lieblingsprodukte und kaufen Sie sie später.',
    url: `${SHOP_DOMAIN}/wunschliste`,
  },
}

export default function WishlistPage() {
  return <WishlistContent />
}
