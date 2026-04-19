import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/data/products'
import { prisma } from '@/lib/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nova-indukt.de'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Fetch products and categories from Prisma (Production source)
  const [dbProducts, dbCategories] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, select: { slug: true } }),
    prisma.category.findMany({ where: { isActive: true }, select: { slug: true } })
  ])

  // Static routes
  const staticRoutes = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/produkte`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/kontakt`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/ueber-uns`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/lieferung`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/datenschutz`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/agb`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/impressum`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/anmelden`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/karriere`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
  ]

  // Product routes from DB
  const productRoutes = dbProducts.map((product) => ({
    url: `${BASE_URL}/produkt/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Category routes from DB
  const categoryRoutes = dbCategories.map((category) => ({
    url: `${BASE_URL}/kategorie/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Blog post routes (still using static data for now, or could be moved to DB too)
  const blogRoutes = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    ...staticRoutes,
    ...productRoutes,
    ...categoryRoutes,
    ...blogRoutes,
  ]
}
