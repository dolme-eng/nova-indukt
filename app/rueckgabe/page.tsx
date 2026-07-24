import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getStaticPageContent } from '@/lib/content/static'

export const metadata: Metadata = {
  title: 'Rückgabe & Widerruf',
  description: 'Informationen zur Rückgabe und zum Widerrufsrecht bei NOVA INDUKT. 30 Tage Rückgaberecht für alle Produkte.',
  keywords: ['Rückgabe', 'Widerruf', 'Rückgaberecht', 'NOVA INDUKT', 'Retoure'],
  alternates: {
    canonical: '/rueckgabe',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default async function RueckgabePage() {
  const db = await getStaticPageContent('rueckgabe')
  if (db) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{db.title}</h1>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{db.content}</div>
          </div>
        </div>
      </div>
    )
  }
  redirect('/faq')
}
