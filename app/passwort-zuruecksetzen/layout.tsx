import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Passwort zurücksetzen',
  description: 'Erstellen Sie ein neues NOVA INDUKT Passwort.',
  alternates: {
    canonical: '/passwort-zuruecksetzen',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function PasswortZuruecksetzenLayout({ children }: { children: React.ReactNode }) {
  return children
}
