import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import '../globals.css'
import { Toaster } from 'sonner'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CookieConsent } from '@/components/cookie-consent'
import { PageTransition } from '@/components/page-transition'
import { CustomCursor } from '@/components/custom-cursor'
import { SmoothScrollProvider } from '@/components/smooth-scroll'
import { locales } from '@/i18n'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params
  const t = await getTranslations({locale, namespace: 'metadata'})
  
  return {
    title: {
      default: t('title'),
      template: '%s | NOVA INDUKT'
    },
    description: t('description'),
    keywords: ['Induktion', 'Kochgeschirr', 'Pfannen', 'Töpfe', 'Premium', 'Deutschland', 'Küche'],
    authors: [{ name: 'NOVA INDUKT' }],
    creator: 'NOVA INDUKT',
    metadataBase: new URL('https://nova-indukt.de'),
    alternates: {
      canonical: '/de',
    },
    icons: {
      icon: '/fav.ico',
      shortcut: '/fav.ico',
      apple: '/fav.ico',
    },
    openGraph: {
      type: 'website',
      locale: 'de_DE',
      siteName: 'NOVA INDUKT',
    },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f4f1' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1917' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export function generateStaticParams() {
  return locales.map((locale) => ({locale}))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{locale: string}>
}) {
  const { locale } = await params
  
  // Get messages for the current locale
  const messages = await getMessages()

  return (
    <>
      <a href="#main-content" className="skip-link">
        Zum Hauptinhalt springen
      </a>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main-content" className="flex-1" role="main" aria-label="Hauptinhalt">
          <SmoothScrollProvider>
            <PageTransition>
              {children}
            </PageTransition>
          </SmoothScrollProvider>
        </main>
        <Footer />
      </div>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '16px',
          },
        }}
        richColors
        closeButton
      />
      <CookieConsent />
      <CustomCursor />
    </>
  )
}
