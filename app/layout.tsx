import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk, Sora, JetBrains_Mono } from "next/font/google"
import { Geist } from 'next/font/google'
import { PromotionBanner } from '@/components/promotion-banner'
import "./globals.css"
import { Toaster } from "sonner"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { PageTransition } from "@/components/page-transition"
import { CustomCursor } from "@/components/custom-cursor"
import { SmoothScrollProvider } from "@/components/smooth-scroll"
import { PageLoader } from "@/components/page-loader"
import { PreloadResources } from "./preload-resources"
import { Providers } from "@/components/providers"
import { AuthSync } from "@/components/auth-sync"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "NOVA INDUKT | Premium Induktions-Kochgeschirr aus Deutschland",
    template: "%s | NOVA INDUKT"
  },
  description: "Entdecken Sie erstklassiges Kochgeschirr und Zubehör für Induktion. Deutsche Qualität, Innovation und Präzision für Ihre Küche. Premium Pfannen, Töpfe und mehr.",
  keywords: ["Induktion", "Kochgeschirr", "Pfannen", "Töpfe", "Premium", "Deutschland", "Küche", "Induktionskochfeld", "Edelstahl", "Antihaft", "SmartHeat"],
  authors: [{ name: "NOVA INDUKT" }],
  creator: "NOVA INDUKT",
  publisher: "NOVA INDUKT",
  metadataBase: new URL("https://nova-indukt.de"),
  alternates: {
    canonical: "/",
    languages: {
      'de-DE': '/',
    },
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://nova-indukt.de",
    siteName: "NOVA INDUKT",
    title: "NOVA INDUKT | Premium Induktions-Kochgeschirr",
    description: "Erstklassiges Kochgeschirr und Zubehör für Induktion. Deutsche Qualität, Innovation und Präzision.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NOVA INDUKT - Premium Induktions-Kochgeschirr",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@novaindukt",
    creator: "@novaindukt",
    title: "NOVA INDUKT | Premium Induktions-Kochgeschirr",
    description: "Erstklassiges Kochgeschirr und Zubehör für Induktion. Deutsche Qualität.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
}

export const viewport: Viewport = {
  themeColor: "#4ECCA3",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${spaceGrotesk.variable} ${sora.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-gray-50 text-gray-900">
        {/* Kritische Ressourcen vorladen */}
        <PreloadResources />
        
        {/* Globaler Loader mit verlängerter Animation */}
        <PageLoader />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "NOVA INDUKT",
          "url": "https://nova-indukt.de",
          "logo": "https://nova-indukt.de/logo0.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+49-89-123-456-78",
            "contactType": "customer service",
            "areaServed": "DE",
            "availableLanguage": "German"
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Industriestraße 42",
            "addressLocality": "München",
            "postalCode": "80339",
            "addressCountry": "DE"
          }
        })}} />
        <a href="#main-content" className="skip-link">
          Zum Hauptinhalt springen
        </a>
        <Providers>
          <AuthSync />
          <PromotionBanner />
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
        </Providers>
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "16px",
            },
          }}
          richColors
          closeButton
        />
        <CookieConsent />
        <CustomCursor />
      </body>
    </html>
  )
}

