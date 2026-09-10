import type { Metadata } from 'next'
import { FAQContent } from './FAQContent'
import { getFaqItems } from '@/lib/content/static'
import { safeJsonLd } from '@/lib/utils/json-ld'
import { SHOP_DOMAIN } from '@/lib/constants/shop'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'FAQ - Häufig gestellte Fragen',
  description:
    'Finden Sie Antworten auf häufig gestellte Fragen zu Versand, Zahlung, Rückgabe, Garantie und Produkten von NOVA INDUKT.',
  keywords: ['FAQ', 'Hilfe', 'Fragen', 'Antworten', 'Kundenservice', 'NOVA INDUKT'],
  alternates: {
    canonical: `${SHOP_DOMAIN}/faq`,
  },
  openGraph: {
    title: 'FAQ - Häufig gestellte Fragen | NOVA INDUKT',
    description:
      'Finden Sie Antworten auf häufig gestellte Fragen zu Versand, Zahlung, Rückgabe, Garantie und Produkten von NOVA INDUKT.',
    url: `${SHOP_DOMAIN}/faq`,
    images: [{ url: `${SHOP_DOMAIN}/og-image.png`, width: 1200, height: 630, alt: 'FAQ | NOVA INDUKT' }],
  },
}

export default async function FAQPage() {
  const dbItems = await getFaqItems()

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: dbItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqStructuredData) }}
      />
      <FAQContent
        items={dbItems.map((i) => ({
          id: i.id,
          question: i.question,
          answer: i.answer,
          category: i.category,
        }))}
      />
    </>
  )
}
