import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getStaticPageContent } from '@/lib/content/static'

export const metadata: Metadata = {
  title: 'Lieferung & Versand',
  description: 'Informationen zur Lieferung und zum Versand von NOVA INDUKT Produkten. Schneller Versand innerhalb Deutschlands.',
  keywords: ['Lieferung', 'Versand', 'Lieferzeit', 'NOVA INDUKT', 'Versandkosten'],
  alternates: {
    canonical: '/lieferung',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default async function LieferungPage() {
  const db = await getStaticPageContent('lieferung')
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
