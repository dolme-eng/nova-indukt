import type { Metadata } from 'next'
import { FAQContent } from './FAQContent'
import { getFaqItems } from '@/lib/content/static'

export const metadata: Metadata = {
  title: 'FAQ - Häufig gestellte Fragen',
  description: 'Finden Sie Antworten auf häufig gestellte Fragen zu Versand, Zahlung, Rückgabe, Garantie und Produkten von NOVA INDUKT.',
  keywords: ['FAQ', 'Hilfe', 'Fragen', 'Antworten', 'Kundenservice', 'NOVA INDUKT'],
  alternates: {
    canonical: '/faq',
  },
}

export default async function FAQPage() {
  const dbItems = await getFaqItems()
  return <FAQContent items={dbItems.map(i => ({ id: i.id, question: i.question, answer: i.answer, category: i.category }))} />
}
