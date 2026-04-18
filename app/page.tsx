import { Suspense } from 'react'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Product, Category, blogPosts } from '@/lib/data/products'
import { HomeContent } from './HomeContent'

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
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      include: { images: true }
    }),
    prisma.category.findMany({
      where: { isActive: true }
    })
  ])

  const formattedProducts: Product[] = products.map(p => ({
    id: p.id,
    slug: p.slug,
    name: { de: p.nameDe },
    category: p.categoryId,
    price: Number(p.price),
    oldPrice: p.oldPrice ? Number(p.oldPrice) : undefined,
    images: p.images.sort((a, b) => a.sortOrder - b.sortOrder).map(img => img.url),
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
    name: { de: c.nameDe },
    image: c.image || '',
    count: 0
  }))

  return (
    <HomeContent 
      initialProducts={formattedProducts} 
      initialCategories={formattedCategories}
      initialBlogPosts={blogPosts}
    />
  )
}
