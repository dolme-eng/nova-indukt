import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { SHOP_DOMAIN } from '@/lib/constants/shop'

const BASE_URL = SHOP_DOMAIN

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes (always included).
  // No lastModified: these pages have no DB timestamp — emitting "now" on
  // every build would fake freshness and kill sitemap caching.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/produkte`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/kontakt`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/uber-uns`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/technologie`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/faq`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/lieferung`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/widerruf`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/rueckgabe`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/datenschutz`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/agb`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/impressum`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/karriere`, changeFrequency: 'monthly', priority: 0.4 },
    // /informationen-zur-zahlung is noindex (post-order utility with bank details)
  ]

  // Skip DB queries at build time if DATABASE_URL is not set
  if (!process.env.DATABASE_URL) {
    return staticRoutes
  }

  try {
    // take:5000 bounds memory on Neon serverless (sitemap caps at 50k URLs anyway)
    const [dbProducts, dbCategories, dbBlogPosts] = await Promise.all([
      prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true }, take: 5000 }),
      prisma.category.findMany({ where: { isActive: true }, select: { slug: true, createdAt: true }, take: 5000 }),
      prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, publishedAt: true, createdAt: true, updatedAt: true }, take: 5000 }),
    ])

    const productRoutes: MetadataRoute.Sitemap = dbProducts.map((product) => ({
      url: `${BASE_URL}/produkt/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // /kategorie/* only redirects to /produkte?kategorie= — list the final URL
    // instead of a redirect chain.
    const categoryRoutes: MetadataRoute.Sitemap = dbCategories.map((category) => ({
      url: `${BASE_URL}/produkte?kategorie=${category.slug}`,
      lastModified: category.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    const blogRoutes: MetadataRoute.Sitemap = dbBlogPosts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt || post.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...blogRoutes]
  } catch (error) {
    // DB unavailable at build time — return static routes only (logged, not silent)
    console.error('[sitemap] DB unavailable, serving static routes only:', error)
    return staticRoutes
  }
}
