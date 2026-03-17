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
  },
  en: {
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.about': 'About',
    'nav.technology': 'Technology',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.account': 'My Account',
    'nav.cart': 'Cart',
    'nav.wishlist': 'Wishlist',
    'nav.search': 'Search',
    
    'hero.title': 'The Future of Induction',
    'hero.subtitle': 'Premium kitchen accessories, curated for maximum performance',
    'hero.cta.primary': 'Discover now',
    'hero.cta.secondary': 'Our story',
    
    'trust.shipping': 'Free delivery over €500',
    'trust.returns': '30-day returns',
    'trust.warranty': '2-year warranty',
    'trust.support': 'Premium support',
    'trust.madeInGermany': 'Made in Germany',
    
    'categories.title': 'Our Categories',
    'categories.cooking': 'Cooking',
    'categories.preparation': 'Preparation',
    'categories.artDeVivre': 'Art de Vivre',
    'categories.accessories': 'Accessories',
    
    'products.bestsellers': 'Our Bestsellers',
    'products.bestsellers.subtitle': 'Hand-picked products for the modern kitchen',
    'products.view.all': 'View all products',
    'products.addToCart': 'Add to cart',
    'products.wishlist': 'Add to wishlist',
    'products.inStock': 'In stock',
    'products.limited': 'Only {count} left',
    'products.outOfStock': 'Out of stock',
    'products.new': 'New',
    'products.bestseller': 'Bestseller',
    'products.premium': 'Premium',
    
    'tech.title': 'Where Technology Meets Craft',
    'tech.subtitle': 'Discover innovations that revolutionize your cooking',
    'tech.smartheat': 'SmartHeat Technology',
    'tech.smartheat.desc': 'Precise temperature control for perfect results',
    'tech.ecopower': 'EcoPower System',
    'tech.ecopower.desc': 'Energy efficiency that pays off',
    'tech.safety': 'SafetyGuard',
    'tech.safety.desc': 'Maximum safety for you and your family',
    'tech.learn.more': 'Learn more',
    
    'blog.title': 'Perfect Induction',
    'blog.subtitle': 'Expert knowledge for your kitchen',
    'blog.read.more': 'Read more',
    
    'newsletter.title': 'Become an Induction Expert',
    'newsletter.text': 'Get exclusive tips, recipes and offers directly to your inbox.',
    'newsletter.placeholder': 'Your email address',
    'newsletter.button': 'Subscribe',
    'newsletter.disclaimer': 'By subscribing you agree to our privacy policy.',
    'newsletter.incentive': 'Free Guide: "Perfect Induction" (PDF)',
    
    'cart.title': 'Your Cart',
    'cart.empty': 'Your cart is empty',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.continue': 'Continue shopping',
    'cart.promo': 'Promo code',
    'cart.apply': 'Apply',
    
    'footer.about': 'About Nova Indukt',
    'footer.legal': 'Legal',
    'footer.help': 'Help',
    'footer.follow': 'Follow us',
    'footer.newsletter': 'Newsletter',
    'footer.description': 'Premium kitchen accessories for induction',
    'footer.copyright': '© {year} NOVA INDUKT. All rights reserved.',
    'footer.vat': 'All prices incl. VAT',
    
    'actions.explore': 'Explore',
    'actions.learnMore': 'Learn more',
    'actions.subscribe': 'Subscribe',
    'actions.buyNow': 'Buy now',
    'actions.addToCart': 'Add to cart',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.products': 'Produits',
    'nav.about': 'À propos',
    'nav.technology': 'Technologie',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.account': 'Mon compte',
    'nav.cart': 'Panier',
    'nav.wishlist': 'Liste de souhaits',
    'nav.search': 'Rechercher',
    
    'hero.title': "L'avenir de l'induction",
    'hero.subtitle': 'Accessoires de cuisine premium, sélectionnés pour une performance maximale',
    'hero.cta.primary': 'Découvrir maintenant',
    'hero.cta.secondary': 'Notre histoire',
    
    'trust.shipping': 'Livraison gratuite dès 500€',
    'trust.returns': 'Retours 30 jours',
    'trust.warranty': 'Garantie 2 ans',
    'trust.support': 'Support premium',
    'trust.madeInGermany': 'Made in Germany',
    
    'categories.title': 'Nos catégories',
    'categories.cooking': 'Cuisson',
    'categories.preparation': 'Préparation',
    'categories.artDeVivre': 'Art de Vivre',
    'categories.accessories': 'Accessoires',
    
    'products.bestsellers': 'Nos bestsellers',
    'products.bestsellers.subtitle': 'Produits sélectionnés pour la cuisine moderne',
    'products.view.all': 'Voir tous les produits',
    'products.addToCart': 'Ajouter au panier',
    'products.wishlist': 'Ajouter aux favoris',
    'products.inStock': 'En stock',
    'products.limited': 'Plus que {count} disponible(s)',
    'products.outOfStock': 'Rupture de stock',
    'products.new': 'Nouveau',
    'products.bestseller': 'Bestseller',
    'products.premium': 'Premium',
    
    'tech.title': 'La technologie au service de l\'artisanat',
    'tech.subtitle': 'Découvrez les innovations qui révolutionnent votre cuisine',
    'tech.smartheat': 'SmartHeat Technology',
    'tech.smartheat.desc': 'Contrôle précis de la température pour des résultats parfaits',
    'tech.ecopower': 'EcoPower System',
    'tech.ecopower.desc': "Efficacité énergétique qui s'amortit",
    'tech.safety': 'SafetyGuard',
    'tech.safety.desc': 'Sécurité maximale pour vous et votre famille',
    'tech.learn.more': 'En savoir plus',
    
    'blog.title': "L'induction parfaite",
    'blog.subtitle': 'Connaissances d\'experts pour votre cuisine',
    'blog.read.more': 'Lire la suite',
    
    'newsletter.title': 'Devenez expert en induction',
    'newsletter.text': 'Recevez des conseils exclusifs, recettes et offres directement dans votre boîte mail.',
    'newsletter.placeholder': 'Votre adresse e-mail',
    'newsletter.button': "S'inscrire",
    'newsletter.disclaimer': "En vous inscrivant, vous acceptez notre politique de confidentialité.",
    'newsletter.incentive': 'Guide gratuit : "Induction parfaite" (PDF)',
    
    'cart.title': 'Votre panier',
    'cart.empty': 'Votre panier est vide',
    'cart.subtotal': 'Sous-total',
    'cart.shipping': 'Livraison',
    'cart.total': 'Total',
    'cart.checkout': 'Commander',
    'cart.continue': 'Continuer vos achats',
    'cart.promo': 'Code promo',
    'cart.apply': 'Appliquer',
    
    'footer.about': 'À propos de Nova Indukt',
    'footer.legal': 'Mentions légales',
    'footer.help': 'Aide',
    'footer.follow': 'Suivez-nous',
    'footer.newsletter': 'Newsletter',
    'footer.description': 'Accessoires cuisine premium pour induction',
    'footer.copyright': '© {year} NOVA INDUKT. Tous droits réservés.',
    'footer.vat': 'Tous prix TTC',
    
    'actions.explore': 'Découvrir',
    'actions.learnMore': 'En savoir plus',
    'actions.subscribe': "S'abonner",
    'actions.buyNow': 'Acheter maintenant',
    'actions.addToCart': 'Ajouter au panier',
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
  if (typeof navigator === 'undefined') return 'de'
  
  const browserLang = navigator.language.toLowerCase()
  const supported: Locale[] = ['de', 'en', 'fr']
  
  if (browserLang.startsWith('de')) return 'de'
  if (browserLang.startsWith('en')) return 'en'
  if (browserLang.startsWith('fr')) return 'fr'
  
  return 'de'
}
