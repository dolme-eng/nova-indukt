'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type Locale = 'de'

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string | Record<string, string>
}

const translations = {
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.products': 'Produkte',
    'nav.about': 'Über uns',
    'nav.technology': 'Technologie',
    'nav.blog': 'Blog',
    'nav.contact': 'Kontakt',
    'nav.account': 'Mein Konto',
    'nav.cart': 'Warenkorb',
    'nav.wishlist': 'Wunschliste',
    'nav.search': 'Suchen',
    
    // Hero
    'hero.title': 'Die Zukunft der Induktion',
    'hero.subtitle': 'Premium-Küchenzubehör, kuratiert für maximale Performance',
    'hero.cta.primary': 'Jetzt entdecken',
    'hero.cta.secondary': 'Unsere Geschichte',
    
    // Trust bar
    'trust.shipping': 'Kostenlose Lieferung ab 500€',
    'trust.returns': '30 Tage Rückgabe',
    'trust.warranty': '2 Jahre Garantie',
    'trust.support': 'Premium Support',
    'trust.madeInGermany': 'Made in Germany',
    
    // Categories
    'categories.title': 'Unsere Kategorien',
    'categories.cooking': 'Kochen',
    'categories.preparation': 'Vorbereitung',
    'categories.artDeVivre': 'Art de Vivre',
    'categories.accessories': 'Zubehör',
    
    // Products
    'products.bestsellers': 'Unsere Bestseller',
    'products.bestsellers.subtitle': 'Handverlesene Produkte für die moderne Küche',
    'products.view.all': 'Alle Produkte ansehen',
    'products.addToCart': 'In den Warenkorb',
    'products.wishlist': 'Zur Wunschliste',
    'products.inStock': 'Auf Lager',
    'products.limited': 'Nur noch {count} verfügbar',
    'products.outOfStock': 'Nicht verfügbar',
    'products.new': 'Neu',
    'products.bestseller': 'Bestseller',
    'products.premium': 'Premium',
    
    // Technology
    'tech.title': 'Technologie trifft Handwerk',
    'tech.subtitle': 'Entdecke Innovationen, die dein Kochen revolutionieren',
    'tech.smartheat': 'SmartHeat Technology',
    'tech.smartheat.desc': 'Präzise Temperaturkontrolle für perfekte Ergebnisse',
    'tech.ecopower': 'EcoPower System',
    'tech.ecopower.desc': 'Energieeffizienz, die sich bezahlt macht',
    'tech.safety': 'SafetyGuard',
    'tech.safety.desc': 'Maximale Sicherheit für dich und deine Familie',
    'tech.learn.more': 'Mehr erfahren',
    
    // Blog
    'blog.title': 'Die perfekte Induktion',
    'blog.subtitle': 'Expertenwissen für deine Küche',
    'blog.read.more': 'Weiterlesen',
    
    // Newsletter
    'newsletter.title': 'Werde Induktions-Experte',
    'newsletter.text': 'Erhalte exklusive Tipps, Rezepte und Angebote direkt in dein Postfach.',
    'newsletter.placeholder': 'Deine E-Mail-Adresse',
    'newsletter.button': 'Anmelden',
    'newsletter.disclaimer': 'Mit der Anmeldung stimmst du unserer Datenschutzerklärung zu.',
    'newsletter.incentive': 'Gratis Guide: "Induktion perfektionieren" (PDF)',
    
    // Cart
    'cart.title': 'Dein Warenkorb',
    'cart.empty': 'Dein Warenkorb ist leer',
    'cart.subtotal': 'Zwischensumme',
    'cart.shipping': 'Versand',
    'cart.total': 'Gesamtsumme',
    'cart.checkout': 'Zur Kasse',
    'cart.continue': 'Weiter einkaufen',
    'cart.promo': 'Gutscheincode',
    'cart.apply': 'Anwenden',
    
    // Footer
    'footer.about': 'Über Nova Indukt',
    'footer.legal': 'Rechtliches',
    'footer.help': 'Hilfe',
    'footer.follow': 'Folge uns',
    'footer.newsletter': 'Newsletter',
    'footer.description': 'Premium-Küchenzubehör für Induktion',
    'footer.copyright': '© {year} NOVA INDUKT. Alle Rechte vorbehalten.',
    'footer.vat': 'Alle Preise inkl. MwSt.',
    
    // Actions
    'actions.explore': 'Entdecken',
    'actions.learnMore': 'Mehr erfahren',
    'actions.subscribe': 'Abonnieren',
    'actions.buyNow': 'Jetzt kaufen',
    'actions.addToCart': 'In den Warenkorb',
  }
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

interface LocaleProviderProps {
  children: ReactNode
  initialLocale?: Locale
}

export function LocaleProvider({ children, initialLocale = 'de' }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale
    }
  }, [])

  const t = useCallback((key: string): string | Record<string, string> => {
    return translations[locale][key as keyof typeof translations.de] || key
  }, [locale])

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}

export function detectBrowserLocale(): Locale {
  // Application uniquement en allemand - toujours retourner 'de'
  return 'de'
}
