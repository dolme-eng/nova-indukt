import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

const TechnologieContent = dynamic(
  () => import('./TechnologieContent'),
  { ssr: false }
)

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Technologie',
  description: 'Entdecken Sie die innovative NOVA INDUKT Technologie. SmartHeat™, EcoPower, SafetyGuard Pro und mehr für das perfekte Kocherlebnis.',
  keywords: ['NOVA INDUKT Technologie', 'SmartHeat', 'Induktion', 'EcoPower', 'Kochfeld Technologie', 'Innovation', 'made in Germany'],
  alternates: {
    canonical: '/technologie',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Technologie | NOVA INDUKT',
    description: 'Entdecken Sie die innovative NOVA INDUKT Technologie. SmartHeat™, EcoPower, SafetyGuard Pro und mehr für das perfekte Kocherlebnis.',
    url: '/technologie',
  },
}

export default function TechnologiePage() {
  return <TechnologieContent />
}
