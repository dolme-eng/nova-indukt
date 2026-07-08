import { Prisma } from '@prisma/client'

/**
 * Types Prisma pour les mappings
 */
export type DbProduct = Prisma.ProductGetPayload<{ include: { images: true } }>
export type DbCategory = Prisma.CategoryGetPayload<{}>
/** DbCategory enrichie avec le compteur de produits (via _count dans la query). */
export type DbCategoryWithCount = DbCategory & { _count?: { products: number } }

/**
 * Mappe un produit de la base de données vers l'interface UI.
 */
export function mapDbProductToUi(p: DbProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: { de: p.nameDe },
    category: p.categoryId,
    price: Number(p.price),
    oldPrice: p.oldPrice ? Number(p.oldPrice) : undefined,
    images: [...p.images]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => img.url),
    rating: p.rating,
    reviewCount: p.reviewCount,
    stock: p.stock,
    initialStock: p.initialStock,
    badges: p.badges as ('premium' | 'bestseller' | 'new')[] | undefined,
    description: { de: p.descriptionDe || '' },
    shortDescription: { de: p.shortDescription || '' },
    specs: {
      material: p.material || '',
      dimensions: p.dimensions || '',
      weight: p.weightKg?.toString() || '',
      dishwasher: p.dishwasherSafe || false,
      induction: p.inductionSafe || false,
    },
    brand: p.brand || undefined,
    ean: p.ean || undefined,
  }
}

/**
 * Mappe une catégorie de la base de données vers l'interface UI.
 */
export function mapDbCategoryToUi(c: DbCategoryWithCount): Category {
  return {
    id: c.id,
    slug: c.slug,
    name: { de: c.nameDe },
    image: c.image || '',
    count: c._count?.products ?? 0,
  }
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
  initialStock?: number
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
  /** GTIN-13 / EAN. */
  ean?: string
  /** Markenname. */
  brand?: string
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

/** Shape utilisé par HomeContent et blog-preview pour les articles venant de Prisma. */
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
