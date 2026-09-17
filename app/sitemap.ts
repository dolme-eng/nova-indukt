import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { SHOP_DOMAIN } from '@/lib/constants/shop'

const BASE_URL = SHOP_DOMAIN

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes (always included)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/produkte`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/kontakt`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/uber-uns`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/technologie`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/lieferung`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/widerruf`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/rueckgabe`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/datenschutz`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/agb`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/impressum`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/karriere`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
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
