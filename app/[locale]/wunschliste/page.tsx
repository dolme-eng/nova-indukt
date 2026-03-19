import type { Metadata } from 'next'
import WishlistContent from './WishlistContent'

export const metadata: Metadata = {
  title: 'Wunschliste | NOVA INDUKT',
  description: 'Ihre persönliche Wunschliste bei NOVA INDUKT. Speichern Sie Ihre Lieblingsprodukte und kaufen Sie sie später.',
  keywords: ['Wunschliste', 'Merkliste', 'Favoriten', 'NOVA INDUKT', 'Induktionskochfeld'],
  robots: {
    index: false,
    follow: false,
  },
}

export default function WishlistPage() {
  return <WishlistContent />
}
