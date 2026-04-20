import { ProductsContent } from './ProductsContent'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Product, Category } from '@/lib/data/products'

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
      }
    }
  }

  if (search) {
    return {
      title: `Suche: "${search}" | NOVA INDUKT`,
      description: `Suchergebnisse für "${search}" im NOVA INDUKT Shop. Finden Sie das perfekte Induktions-Kochgeschirr.`,
    }
  }

  return {
    title: 'Unsere Produkte | Premium Induktions-Kochgeschirr',
    description: 'Entdecken Sie unser Premium-Sortiment an Induktions-Kochgeschirr, Pfannen, Töpfen und Küchenzubehör. Deutsche Qualität für Ihre Küche.',
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string; suche?: string; minPrice?: string; maxPrice?: string; sort?: string }>
}) {
  const params = await searchParams
  const categorySlug = params.kategorie
  const search = params.suche
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined
  const sort = params.sort || 'newest'

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { 
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
      },
      include: { 
        images: true,
        category: true 
      },
      orderBy: sort === 'price-asc' 
        ? { price: 'asc' } 
        : sort === 'price-desc' 
        ? { price: 'desc' }
        : sort === 'name'
        ? { nameDe: 'asc' }
        : { createdAt: 'desc' }
    }),
    prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } }
        }
      },
      orderBy: { sortOrder: 'asc' }
    })
  ])

  // Transformer les données pour correspondre à l'interface attendue par ProductsContent
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
    }
  }))

  const formattedCategories: Category[] = categories.map(c => ({
    id: c.id,
    slug: c.slug,
    name: { de: c.nameDe },
    image: c.image || '',
    count: c._count.products
  }))

  return <ProductsContent 
    initialProducts={formattedProducts} 
    initialCategories={formattedCategories}
    activeCategory={categorySlug}
    initialSearch={search}
    initialPriceRange={[minPrice || 0, maxPrice || 2500]}
    initialSort={sort}
  />
}
