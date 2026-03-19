import { Suspense } from 'react'
import { HomeContent } from './HomeContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Premium Induktions-Kochgeschirr | NOVA INDUKT',
  description: 'Entdecken Sie erstklassiges Kochgeschirr und Accessoires für Induktion. Deutsche Qualität, Innovation und Präzision für Ihre Küche.',
  keywords: ['Induktion', 'Kochgeschirr', 'Pfannen', 'Töpfe', 'Premium', 'Deutschland', 'Küche', 'Induktionskochfeld'],
  openGraph: {
    title: 'Premium Induktions-Kochgeschirr | NOVA INDUKT',
    description: 'Entdecken Sie erstklassiges Kochgeschirr und Accessoires für Induktion.',
    type: 'website',
  },
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <HomeContent />
    </Suspense>
  )
}
