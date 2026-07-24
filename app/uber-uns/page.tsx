import type { Metadata } from 'next'
import AboutContent from './AboutContent'

export const metadata: Metadata = {
  title: 'Über uns | NOVA INDUKT',
  description: 'Lernen Sie NOVA INDUKT kennen - Ihr Spezialist für Premium Induktions-Kochgeschirr aus Deutschland',
  alternates: {
    canonical: '/uber-uns',
  },
}

export default function UberUnsPage() {
  return <AboutContent />
}
