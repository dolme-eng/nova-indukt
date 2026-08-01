import type { Metadata } from 'next'
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { Product, Category } from '@/lib/data/products'
import { mapDbProductToUi } from '@/lib/data/products'
import SearchContent from './SearchContent'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Suchen`,
    description:
      'Finden Sie die besten NOVA INDUKT Produkte. Durchsuchen Sie unser Sortiment nach Induktionskochfelder, Zubehör und mehr.',
    keywords: [
      'Suche',
      'Produktsuche',
      'NOVA INDUKT',
      'Induktionskochfeld',
      'Küchengeräte',
      'Filter',
      'Kategorien',
    ],
    alternates: {
      canonical: '/suche',
    },
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default async function SuchePage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    category?: string
    priceMin?: string
    priceMax?: string
    sort?: string
  }>
}) {
  const params = await searchParams
  const q = params.q?.trim() || ''
  const category = params.category || ''
  const priceMin = params.priceMin ? parseFloat(params.priceMin) : undefined
  const priceMax = params.priceMax ? parseFloat(params.priceMax) : undefined
  const sort = params.sort || 'relevance'

  const where: Prisma.ProductWhereInput = {
    isActive: true,
  }

  if (q.length >= 2) {
    where.OR = [
      { nameDe: { contains: q, mode: 'insensitive' } },
      { descriptionDe: { contains: q, mode: 'insensitive' } },
      { category: { nameDe: { contains: q, mode: 'insensitive' } } },
    ]
  }

  if (category) {
    where.categoryId = category
  }

  if (priceMin !== undefined || priceMax !== undefined) {
    where.price = {}
    if (priceMin !== undefined) where.price.gte = priceMin
    if (priceMax !== undefined) where.price.lte = priceMax
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }
  if (sort === 'price-asc') orderBy = { price: 'asc' }
  else if (sort === 'price-desc') orderBy = { price: 'desc' }
  else if (sort === 'rating') orderBy = { rating: 'desc' }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: true },
      orderBy,
      take: 200,
    }),
    prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
    }),
  ])

  const formattedProducts: Product[] = products.map(mapDbProductToUi)

  const formattedCategories: Category[] = categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: { de: c.nameDe },
    image: c.image || '',
    count: c._count.products,
  }))

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#4ECCA3]/30 border-t-[#4ECCA3]" />
            <p className="text-gray-600">Laden...</p>
          </div>
        </div>
      }
    >
      <SearchContent initialProducts={formattedProducts} initialCategories={formattedCategories} />
    </Suspense>
  )
}
