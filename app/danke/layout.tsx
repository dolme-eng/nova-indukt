import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bestellung aufgegeben | NOVA INDUKT',
  description: 'Vielen Dank für Ihre Bestellung bei NOVA INDUKT.',
  alternates: {
    canonical: '/danke',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function DankeLayout({ children }: { children: React.ReactNode }) {
  return children
}
