import { MetadataRoute } from 'next'
import { SHOP_DOMAIN } from '@/lib/constants/shop'

const BASE_URL = SHOP_DOMAIN

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Both slash and non-slash forms: `/admin/` alone does NOT match `/admin`.
        // No `host` field: it is deprecated and expects a bare hostname.
        disallow: [
          '/api/',
          '/mein-konto',
          '/mein-konto/',
          '/admin',
          '/admin/',
          '/warenkorb',
          '/warenkorb/',
          '/kasse',
          '/kasse/',
          '/suche',
          '/suche/',
          '/bestellung-verfolgen',
          '/bestellung-verfolgen/',
          '/wunschliste',
          '/wunschliste/',
          '/anmelden',
          '/anmelden/',
          '/registrieren',
          '/registrieren/',
          '/passwort-vergessen',
          '/passwort-vergessen/',
          '/passwort-zuruecksetzen',
          '/passwort-zuruecksetzen/',
          '/danke',
          '/danke/',
          '/kategorie',
          '/kategorie/',
          '/informations-de-paiement',
          '/informations-de-paiement/',
          '/informationen-zur-zahlung',
          '/informationen-zur-zahlung/',
          '/wartung',
          '/wartung/',
          '/_next/',
          '/studio/',
          '/private/',
          '/*.json$',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
