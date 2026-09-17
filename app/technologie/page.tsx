import type { Metadata } from 'next'
import TechnologieContent from './TechnologieContent'
import { SHOP_DOMAIN } from '@/lib/constants/shop'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Technologie',
  description: 'Entdecken Sie die innovative NOVA INDUKT Technologie. SmartHeat™, EcoPower, SafetyGuard Pro und mehr für das perfekte Kocherlebnis.',
  keywords: ['NOVA INDUKT Technologie', 'SmartHeat', 'Induktion', 'EcoPower', 'Kochfeld Technologie', 'Innovation', 'made in Germany'],
  alternates: {
    canonical: `${SHOP_DOMAIN}/technologie`,
  },
  openGraph: {
    title: 'Technologie | NOVA INDUKT',
    description: 'Entdecken Sie die innovative NOVA INDUKT Technologie. SmartHeat™, EcoPower, SafetyGuard Pro und mehr für das perfekte Kocherlebnis.',
    url: `${SHOP_DOMAIN}/technologie`,
    siteName: 'NOVA INDUKT',
    type: 'website',
    locale: 'de_DE',
    images: [{ url: `${SHOP_DOMAIN}/og-image.png`, width: 1200, height: 630, alt: 'Technologie | NOVA INDUKT' }],
  },
}

export default function TechnologiePage() {
  return <TechnologieContent />
}
