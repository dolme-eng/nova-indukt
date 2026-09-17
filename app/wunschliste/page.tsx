import type { Metadata } from 'next'
import WishlistContent from './WishlistContent'

export const metadata: Metadata = {
  title: 'Wunschliste',
  description: 'Ihre persönliche Wunschliste bei NOVA INDUKT. Speichern Sie Ihre Lieblingsprodukte und kaufen Sie sie später.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function WishlistPage() {
  return <WishlistContent />
}
