import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Lieferung & Versand | NOVA INDUKT',
  description: 'Informationen zur Lieferung und zum Versand von NOVA INDUKT Produkten. Schneller Versand innerhalb Deutschlands.',
  keywords: ['Lieferung', 'Versand', 'Lieferzeit', 'NOVA INDUKT', 'Versandkosten'],
  robots: {
    index: false,
    follow: true,
  },
}

export default function LieferungPage() {
  redirect('/faq')
}
