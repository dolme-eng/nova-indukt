import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Passwort vergessen | NOVA INDUKT',
  description: 'Setzen Sie Ihr NOVA INDUKT Passwort zurück.',
  alternates: {
    canonical: '/passwort-vergessen',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function PasswortVergessenLayout({ children }: { children: React.ReactNode }) {
  return children
}
