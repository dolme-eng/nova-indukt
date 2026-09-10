import type { Metadata } from 'next'
import { SHOP_DOMAIN } from '@/lib/constants/shop'

export const metadata: Metadata = {
  title: 'Passwort vergessen',
  description: 'Setzen Sie Ihr NOVA INDUKT Passwort zurück.',
  alternates: {
    canonical: `${SHOP_DOMAIN}/passwort-vergessen`,
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function PasswortVergessenLayout({ children }: { children: React.ReactNode }) {
  return children
}
