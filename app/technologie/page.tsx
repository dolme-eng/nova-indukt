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
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Technologie | NOVA INDUKT',
    description: 'Entdecken Sie die innovative NOVA INDUKT Technologie. SmartHeat™, EcoPower, SafetyGuard Pro und mehr für das perfekte Kocherlebnis.',
    url: `${SHOP_DOMAIN}/technologie`,
  },
}

export default function TechnologiePage() {
  return <TechnologieContent />
}
