import type { Metadata } from 'next'
import { FAQContent } from './FAQContent'

export const metadata: Metadata = {
  title: 'FAQ - Häufig gestellte Fragen | NOVA INDUKT',
  description: 'Finden Sie Antworten auf häufig gestellte Fragen zu Versand, Zahlung, Rückgabe, Garantie und Produkten von NOVA INDUKT.',
  keywords: ['FAQ', 'Hilfe', 'Fragen', 'Antworten', 'Support', 'NOVA INDUKT'],
}

export default function FAQPage() {
  return <FAQContent />
}
