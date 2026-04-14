import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nova-indukt.de'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/mein-konto/',
        '/admin/',
        '/warenkorb/',
        '/kasse/',
        '/_next/',
        '/studio/',
        '/private/',
        '/*.json$',
        '/*.xml$',
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
