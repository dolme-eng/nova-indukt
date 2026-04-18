import type { Metadata } from 'next'
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Product, Category } from '@/lib/data/products'
import SearchContent from './SearchContent'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Suchen | NOVA INDUKT`,
    description: 'Finden Sie die besten NOVA INDUKT Produkte. Durchsuchen Sie unser Sortiment nach Induktionskochfelder, Zubehör und mehr.',
    keywords: ['Suche', 'Produktsuche', 'NOVA INDUKT', 'Induktionskochfeld', 'Küchengeräte', 'Filter', 'Kategorien'],
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default async function SuchePage() {
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
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#4ECCA3]/30 border-t-[#4ECCA3] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    }>
      <SearchContent initialProducts={formattedProducts} initialCategories={formattedCategories} />
    </Suspense>
  )
}
