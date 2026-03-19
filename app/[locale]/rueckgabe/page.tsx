import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Rückgabe & Widerruf | NOVA INDUKT',
  description: 'Informationen zur Rückgabe und zum Widerrufsrecht bei NOVA INDUKT. 30 Tage Rückgaberecht für alle Produkte.',
  keywords: ['Rückgabe', 'Widerruf', 'Rückgaberecht', 'NOVA INDUKT', 'Retoure'],
  robots: {
    index: false,
    follow: true,
  },
}

export default function RueckgabePage() {
  redirect('/faq')
}
