import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import {
  Product,
  Category,
  mapDbProductToUi,
  mapDbCategoryToUi,
  DbProduct,
  DbCategoryWithCount,
} from '@/lib/data/products'
import { categoriesConfig } from '@/lib/data/categories'
import { logError } from '@/lib/logger'
import { getActivePromotions } from '@/lib/promotions'
import { SHOP_DOMAIN } from '@/lib/constants/shop'
import { HomeContent } from './HomeContent'

// Revalidate every 5 minutes — use revalidatePath('/') in admin actions for on-demand invalidation
export const revalidate = 300

export const metadata: Metadata = {
  title: 'Premium Induktions-Kochgeschirr',
  description:
    'Entdecken Sie erstklassiges Kochgeschirr und Accessoires für Induktion. Deutsche Qualität, Innovation und Präzision für Ihre Küche.',
  keywords: ['Induktion', 'Kochgeschirr', 'Pfannen', 'Töpfe', 'Premium', 'Deutschland', 'Küche', 'Induktionskochfeld'],
  openGraph: {
    title: 'Premium Induktions-Kochgeschirr | NOVA INDUKT',
    description: 'Entdecken Sie erstklassiges Kochgeschirr und Accessoires für Induktion.',
    url: 'https://nova-indukt.de',
    siteName: 'NOVA INDUKT',
    images: [{ url: 'https://nova-indukt.de/og-image.png', width: 1200, height: 630, alt: 'NOVA INDUKT' }],
    type: 'website',
  },
}

type HomeBlogPost = {
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

export default async function Page() {
  let products: DbProduct[] = []
  let categories: DbCategoryWithCount[] = []
  let activePromotions: Awaited<ReturnType<typeof getActivePromotions>> = []
  let blogPosts: HomeBlogPost[] = []

  try {
    const [dbProducts, dbCategories, dbPromotions, dbBlogPosts] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        include: { images: true },
        take: 50,
      }),
      prisma.category
        .findMany({
          where: { isActive: true },
          include: { _count: { select: { products: true } } },
        })
        .then((cats) => cats.filter((c) => c._count.products > 0)),
      getActivePromotions(),
      // Latest 3 published blog posts for the home page section
      prisma.blogPost.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: 'desc' },
        take: 3,
        select: {
          id: true,
          slug: true,
          titleDe: true,
          excerptDe: true,
          image: true,
          publishedAt: true,
          createdAt: true,
          readTime: true,
          category: true,
          author: true,
        },
      }),
    ])

    products = dbProducts
    categories = dbCategories
    activePromotions = dbPromotions
    blogPosts = dbBlogPosts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: { de: p.titleDe },
      excerpt: { de: p.excerptDe || '' },
      image: p.image || '',
      date: (p.publishedAt || p.createdAt).toISOString(),
      readTime: p.readTime || '',
      category: p.category || '',
      author: p.author,
    }))
  } catch (err) {
    logError('Database connection failed, using static fallback', err)
    categories = categoriesConfig.map((c) => ({
      id: c.id,
      slug: c.slug,
      nameDe: c.nameDe,
      image: c.image,
      _count: { products: 0 },
    })) as unknown as DbCategoryWithCount[]
    products = []
  }

  // Badge priority sort: bestseller > premium > has discount > rest
  const badgeScore = (p: DbProduct): number => {
    const badges = (p.badges ?? []) as string[]
    if (badges.includes('bestseller')) return 3
    if (badges.includes('premium')) return 2
    if (p.oldPrice && Number(p.oldPrice) > Number(p.price)) return 1
    return 0
  }

  const formattedProducts: Product[] = products
    .filter((p) => Array.isArray(p.images) && p.images.length > 0)
    .sort((a, b) => badgeScore(b) - badgeScore(a))
    .map(mapDbProductToUi)

  const formattedCategories: Category[] = categories.map(mapDbCategoryToUi)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: SHOP_DOMAIN,
    name: 'NOVA INDUKT',
    description: 'Premium Induktions-Kochgeschirr aus Deutschland',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SHOP_DOMAIN}/suche?suche={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
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
        activePromotions={activePromotions.map((p) => ({ ...p, discountValue: Number(p.discountValue) }))}
      />
    </>
  )
}
