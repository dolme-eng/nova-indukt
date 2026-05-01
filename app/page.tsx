import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Product, Category, blogPosts } from '@/lib/data/products'
import { categoriesConfig } from '@/lib/data/categories'
import { logError } from '@/lib/logger'
import { getActivePromotions } from '@/lib/promotions'
import { HomeContent } from './HomeContent'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Premium Induktions-Kochgeschirr | NOVA INDUKT',
  description: 'Entdecken Sie erstklassiges Kochgeschirr und Accessoires für Induktion. Deutsche Qualität, Innovation und Präzision für Ihre Küche.',
  keywords: ['Induktion', 'Kochgeschirr', 'Pfannen', 'Töpfe', 'Premium', 'Deutschland', 'Küche', 'Induktionskochfeld'],
  openGraph: {
    title: 'Premium Induktions-Kochgeschirr | NOVA INDUKT',
    description: 'Entdecken Sie erstklassiges Kochgeschirr und Accessoires für Induktion.',
    type: 'website',
  },
}

export default async function Page() {
  let products: any[] = []
  // Raw categories shape differs between DB and static config; we normalize later.
  let categories: any[] = []
  let activePromotions: Awaited<ReturnType<typeof getActivePromotions>> = []

  try {
    const [dbProducts, dbCategories, dbPromotions] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        include: { images: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        include: { _count: { select: { products: true } } }
      }).then(cats => cats.filter(c => c._count.products > 0)),
      getActivePromotions(),
    ])
    products = dbProducts
    categories = dbCategories
    activePromotions = dbPromotions
  } catch (err) {
    logError('Database connection failed, using static fallback', err)
    // Fallback: utilise les catégories statiques
    categories = categoriesConfig.map(c => ({
      id: c.id,
      slug: c.slug,
      nameDe: c.nameDe,
      image: c.image,
      _count: { products: 0 }
    }))
    products = []
  }

  const formattedProducts: Product[] = products
    .filter((p) => Array.isArray(p.images) && p.images.length > 0)
    .map(p => ({
    id: p.id,
    slug: p.slug,
    name: { de: p.nameDe },
    category: p.categoryId,
    price: Number(p.price),
    oldPrice: p.oldPrice ? Number(p.oldPrice) : undefined,
    images: (p.images as Array<{ sortOrder: number; url: string }>)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => img.url),
    rating: p.rating,
    reviewCount: p.reviewCount,
    stock: p.stock,
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
    supplierSku: p.supplierSku || undefined
  }))

  const formattedCategories: Category[] = categories.map(c => ({
    id: c.id,
    slug: c.slug,
    name: { de: c.nameDe },
    image: c.image || '',
    count: (c as any)._count?.products || 0
  }))

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://nova-indukt.de",
    "name": "NOVA INDUKT",
    "description": "Premium Induktions-Kochgeschirr aus Deutschland",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://nova-indukt.de/suche?suche={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeContent 
        initialProducts={formattedProducts} 
        initialCategories={formattedCategories}
        initialBlogPosts={blogPosts}
        activePromotions={activePromotions}
      />
    </>
  )
}
