import { stockImagePair } from './product-media'

function stockPair(category: string, seed: number): string[] {
  const [a, b] = stockImagePair(category, seed)
  return [a, b]
}

export interface Product {
  id: string
  slug: string
  name: { de: string }
  category: string
  /** Brutto-Endpreis für Endkunden (Standard), sofern `priceIncludesVat !== false`. */
  price: number
  oldPrice?: number
  images: string[]
  rating: number
  reviewCount: number
  stock: number
  badges?: ('premium' | 'bestseller' | 'new')[]
  description: { de: string }
  shortDescription: { de: string }
  specs: {
    material: string
    dimensions: string
    weight: string
    dishwasher: boolean
    induction: boolean
  }
  /** GTIN-13 / EAN – nur echte Lieferanten-Codes. */
  ean?: string
  /** Markenname laut Lieferant. */
  brand?: string
  /** Lieferanten-Artikelnummer / Hersteller-SKU. */
  supplierSku?: string
  /** `true` (Standard): `price` ist inkl. MwSt. */
  priceIncludesVat?: boolean
  /** z. B. 19 für DE */
  vatRatePercent?: number
  /** Freitext: Lieferzeit etc. */
  deliveryNote?: string
}

export interface Category {
  id: string
  slug: string
  name: { de: string }
  image: string
  count: number
}

export interface BlogPost {
  id: string
  slug: string
  title: { de: string }
  excerpt: { de: string }
  image: string
  date: string
  readTime: string
  category: string
  author: string
}

export const blogPosts: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'pfanne-kaufratgeber',
    title: { de: 'Der ultimative Induktions-Pfannen-Kaufratgeber' },
    excerpt: { de: 'Worauf Sie beim Kauf von Pfannen für Ihr Induktionskochfeld unbedingt achten sollten.' },
    image: '/images/blog/Die richtige Pfanne für Induktion Der ultimative Kaufratgeber 2026.jpg',
    date: '2024-03-15',
    readTime: '8 min',
    category: 'Ratgeber',
    author: 'Nova Team'
  },
  {
    id: 'post-2',
    slug: 'induktion-vs-gas',
    title: { de: 'Induktion vs. Gas: Was ist wirklich besser?' },
    excerpt: { de: 'Ein detaillierter Vergleich der beiden beliebtesten Kochtechnologien in der modernen Küche.' },
    image: '/images/blog/Induktion vs. Gas Der große Energiekostenvergleich 2026.jpg',
    date: '2024-03-10',
    readTime: '12 min',
    category: 'Technik',
    author: 'Dr. Koch'
  },
  {
    id: 'post-3',
    slug: 'kochfeld-pflege',
    title: { de: 'So bleibt Ihr Induktionskochfeld jahrelang wie neu' },
    excerpt: { de: 'Pflegetipps und Tricks für die tägliche Reinigung und den Werterhalt Ihrer Geräte.' },
    image: '/images/blog/Edelstahlpfannen richtig reinigen & pflegen – ohne Kratzer und Flecken.jpg',
    date: '2024-03-05',
    readTime: '5 min',
    category: 'Pflege',
    author: 'Nova Team'
  }
]
