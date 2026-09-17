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
    siteName: 'NOVA INDUKT',
    type: 'website',
    locale: 'de_DE',
    images: [{ url: `${SHOP_DOMAIN}/og-image.png`, width: 1200, height: 630, alt: 'Über uns | NOVA INDUKT' }],
  },
}

export default function UberUnsPage() {
  return <AboutContent />
}
