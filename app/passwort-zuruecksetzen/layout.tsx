import type { Metadata } from 'next'
import { SHOP_DOMAIN } from '@/lib/constants/shop'

export const metadata: Metadata = {
  title: 'Passwort zurücksetzen',
  description: 'Erstellen Sie ein neues NOVA INDUKT Passwort.',
  alternates: {
    canonical: `${SHOP_DOMAIN}/passwort-zuruecksetzen`,
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function PasswortZuruecksetzenLayout({ children }: { children: React.ReactNode }) {
  return children
}
