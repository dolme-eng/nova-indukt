import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk, Sora, JetBrains_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import './globals.css'
import { Toaster } from 'sonner'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CookieConsent } from '@/components/cookie-consent'
import { PageTransition } from '@/components/page-transition'
import { CustomCursor } from '@/components/custom-cursor'
import { SmoothScrollProvider } from '@/components/smooth-scroll'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-satoshi',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Premium Induktions-Kochgeschirr | NOVA INDUKT',
  description: 'Entdecken Sie erstklassiges Kochgeschirr und Accessoires für Induktion. Deutsche Qualität, Innovation und Präzision für Ihre Küche.',
  keywords: ['Induktion', 'Kochgeschirr', 'Pfannen', 'Töpfe', 'Premium', 'Deutschland', 'Küche'],
  authors: [{ name: 'NOVA INDUKT' }],
  creator: 'NOVA INDUKT',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f4f1' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1917' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const messages = await getMessages()

  return (
    <html lang="de" className={`${inter.variable} ${spaceGrotesk.variable} ${sora.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <NextIntlClientProvider locale="de" messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

