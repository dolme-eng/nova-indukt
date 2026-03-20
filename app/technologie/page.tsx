import type { Metadata } from 'next'
import TechnologieContent from './TechnologieContent'

export const metadata: Metadata = {
  title: 'Technologie | NOVA INDUKT',
  description: 'Entdecken Sie die innovative NOVA INDUKT Technologie. SmartHeat™, EcoPower, SafetyGuard Pro und mehr für das perfekte Kocherlebnis.',
  keywords: ['NOVA INDUKT Technologie', 'SmartHeat', 'Induktion', 'EcoPower', 'Kochfeld Technologie', 'Innovation', 'made in Germany'],
  robots: {
    index: true,
    follow: true,
  },
}

export default function TechnologiePage() {
  return <TechnologieContent />
}
