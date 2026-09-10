import type { Metadata } from 'next'
import AboutContent from './AboutContent'
import { SHOP_DOMAIN } from '@/lib/constants/shop'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Über uns',
  description: 'Lernen Sie NOVA INDUKT kennen - Ihr Spezialist für Premium Induktions-Kochgeschirr aus Deutschland',
  alternates: {
    canonical: `${SHOP_DOMAIN}/uber-uns`,
  },
  openGraph: {
    title: 'Über uns | NOVA INDUKT',
    description: 'Lernen Sie NOVA INDUKT kennen - Ihr Spezialist für Premium Induktions-Kochgeschirr aus Deutschland',
    url: `${SHOP_DOMAIN}/uber-uns`,
  },
}

export default function UberUnsPage() {
  return <AboutContent />
}
