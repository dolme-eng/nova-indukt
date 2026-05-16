import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { 
  Product, 
  Category, 
  blogPosts, 
  mapDbProductToUi, 
  mapDbCategoryToUi,
  DbProduct,
  DbCategory
} from '@/lib/data/products'
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
  let products: DbProduct[] = []
  let categories: DbCategory[] = []
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
    })) as unknown as DbCategory[]
    products = []
  }

  const formattedProducts: Product[] = products
    .filter((p) => Array.isArray(p.images) && p.images.length > 0)
    .map(mapDbProductToUi)

  const formattedCategories: Category[] = categories.map(mapDbCategoryToUi)

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
        activePromotions={activePromotions.map(p => ({ ...p, discountValue: Number(p.discountValue) }))}
      />
    </>
  )
}
