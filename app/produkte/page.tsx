import { ProductsContent } from './ProductsContent'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Product, Category, mapDbProductToUi, mapDbCategoryToUi } from '@/lib/data/products'

export const revalidate = 120

const ITEMS_PER_PAGE = 12

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string; suche?: string }>
}): Promise<Metadata> {
  const params = await searchParams
  const categorySlug = params.kategorie
  const search = params.suche

  if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    })
    if (category) {
      return {
        title: `${category.nameDe} | Premium Induktions-Kochgeschirr`,
        description: `Entdecken Sie unsere Auswahl an ${category.nameDe}. Premium-Qualität von NOVA INDUKT für höchste Ansprüche.`,
        alternates: {
          canonical: `/produkte?kategorie=${categorySlug}`,
        },
      }
    }
  }

  if (search) {
    return {
      title: `Suche: "${search}"`,
      description: `Suchergebnisse für "${search}" im NOVA INDUKT Shop. Finden Sie das perfekte Induktions-Kochgeschirr.`,
      alternates: {
        canonical: '/suche',
      },
    }
  }

  return {
    title: 'Unsere Produkte | Premium Induktions-Kochgeschirr',
    description: 'Entdecken Sie unser Premium-Sortiment an Induktions-Kochgeschirr, Pfannen, Töpfen und Küchenzubehör. Deutsche Qualität für Ihre Küche.',
    alternates: {
      canonical: '/produkte',
    },
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string; suche?: string; minPrice?: string; maxPrice?: string; sort?: string; page?: string }>
}) {
  const params = await searchParams
  const categorySlug = params.kategorie
  const search = params.suche
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined
  const sort = params.sort || 'newest'
  const rawPage = Number.parseInt(params.page || '1', 10)
  const page = Number.isFinite(rawPage) ? Math.max(rawPage, 1) : 1

  const where: any = {
    isActive: true,
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    ...(search ? {
      OR: [
        { nameDe: { contains: search, mode: 'insensitive' } },
        { descriptionDe: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } }
      ]
    } : {}),
    ...(minPrice || maxPrice ? {
      price: {
        ...(minPrice ? { gte: minPrice } : {}),
        ...(maxPrice ? { lte: maxPrice } : {}),
      }
    } : {}),
  }

  const orderBy: any = sort === 'price-asc'
    ? { price: 'asc' }
    : sort === 'price-desc'
    ? { price: 'desc' }
    : sort === 'name'
    ? { nameDe: 'asc' }
    : { createdAt: 'desc' }

  const skip = (page - 1) * ITEMS_PER_PAGE

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: true,
        category: true
      },
      orderBy,
      skip,
      take: ITEMS_PER_PAGE
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' }
    }).then(cats => cats.filter(c => c._count.products > 0))
  ])

  const formattedProducts: Product[] = products.map(mapDbProductToUi)
  const formattedCategories: Category[] = categories.map(mapDbCategoryToUi)
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  return <ProductsContent
    initialProducts={formattedProducts}
    initialCategories={formattedCategories}
    activeCategory={categorySlug}
    initialSearch={search}
    initialPriceRange={[minPrice || 0, maxPrice || 2500]}
    initialSort={sort}
    currentPage={page}
    totalPages={totalPages}
    totalProducts={total}
  />
}
