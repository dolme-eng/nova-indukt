import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
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

export const metadata: Metadata = {
  title: {
    default: "NOVA INDUKT | Premium Induktions-Kochgeschirr",
    template: "%s | NOVA INDUKT"
  },
  description: "Entdecken Sie erstklassiges Kochgeschirr und Zubehör für Induktion. Deutsche Qualität, Innovation und Präzision für Ihre Küche.",
  keywords: ["Induktion", "Kochgeschirr", "Pfannen", "Töpfe", "Premium", "Deutschland", "Küche", "Induktionskochfeld"],
  authors: [{ name: "NOVA INDUKT" }],
  creator: "NOVA INDUKT",
  metadataBase: new URL("https://nova-indukt.de"),
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "NOVA INDUKT",
    title: "NOVA INDUKT | Premium Induktions-Kochgeschirr",
    description: "Erstklassiges Kochgeschirr und Zubehör für Induktion. Deutsche Qualität.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

export const viewport: Viewport = {
  themeColor: "#4ECCA3",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-gray-50 text-gray-900">
        {/* Précharger les ressources critiques */}
        <PreloadResources />
        
        {/* Loader global avec animation prolongée */}
        <PageLoader />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "NOVA INDUKT",
          "url": "https://nova-indukt.de",
          "logo": "https://nova-indukt.de/logo0.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+49-30-123-456-789",
            "contactType": "customer service",
            "areaServed": "DE",
            "availableLanguage": "German"
          }
        })}} />
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

