import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bestellung verfolgen | NOVA INDUKT',
  description: 'Verfolgen Sie den Status Ihrer NOVA INDUKT Bestellung.',
  alternates: {
    canonical: '/bestellung-verfolgen',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function BestellungVerfolgenLayout({ children }: { children: React.ReactNode }) {
  return children
}
