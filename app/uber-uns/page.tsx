import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

const AboutContent = dynamic(
  () => import('./AboutContent'),
  { ssr: false }
)

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Über uns',
  description: 'Lernen Sie NOVA INDUKT kennen - Ihr Spezialist für Premium Induktions-Kochgeschirr aus Deutschland',
  alternates: {
    canonical: '/uber-uns',
  },
  openGraph: {
    title: 'Über uns | NOVA INDUKT',
    description: 'Lernen Sie NOVA INDUKT kennen - Ihr Spezialist für Premium Induktions-Kochgeschirr aus Deutschland',
    url: '/uber-uns',
  },
}

export default function UberUnsPage() {
  return <AboutContent />
}
