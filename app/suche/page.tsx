import type { Metadata } from 'next'
import { Suspense } from 'react'
import SearchContent from './SearchContent'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Suchen | NOVA INDUKT`,
    description: 'Finden Sie die besten NOVA INDUKT Produkte. Durchsuchen Sie unser Sortiment nach Induktionskochfelder, Zubehör und mehr.',
    keywords: ['Suche', 'Produktsuche', 'NOVA INDUKT', 'Induktionskochfeld', 'Küchengeräte', 'Filter', 'Kategorien'],
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default function SuchePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#4ECCA3]/30 border-t-[#4ECCA3] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
