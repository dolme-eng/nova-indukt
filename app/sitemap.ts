import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nova-indukt.de'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes (always included)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/produkte`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/kontakt`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/uber-uns`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/lieferung`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/datenschutz`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/agb`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/impressum`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/anmelden`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/karriere`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  // Skip DB queries at build time if DATABASE_URL is not set
  if (!process.env.DATABASE_URL) {
    return staticRoutes
  }

  try {
    const [dbProducts, dbCategories, dbBlogPosts] = await Promise.all([
      prisma.product.findMany({ where: { isActive: true }, select: { slug: true } }),
      prisma.category.findMany({ where: { isActive: true }, select: { slug: true } }),
      prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, publishedAt: true, createdAt: true } }),
    ])

    const productRoutes: MetadataRoute.Sitemap = dbProducts.map((product) => ({
      url: `${BASE_URL}/produkt/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    const categoryRoutes: MetadataRoute.Sitemap = dbCategories.map((category) => ({
      url: `${BASE_URL}/kategorie/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    const blogRoutes: MetadataRoute.Sitemap = dbBlogPosts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.publishedAt || post.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...blogRoutes]
  } catch {
    // DB unavailable at build time — return static routes only
    return staticRoutes
  }
}
