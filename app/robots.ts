import { MetadataRoute } from 'next'
import { SHOP_DOMAIN } from '@/lib/constants/shop'

const BASE_URL = SHOP_DOMAIN

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/mein-konto/',
          '/admin/',
          '/warenkorb/',
          '/kasse/',
          '/suche/',
          '/bestellung-verfolgen/',
          '/_next/',
          '/studio/',
          '/private/',
          '/*.json$',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
