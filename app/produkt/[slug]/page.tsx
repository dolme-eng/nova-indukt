import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Product } from '@/lib/data/products'
import { ProductContent } from './ProductContent'

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = await params
  const decodedSlug = decodeURIComponent(resolvedParams.slug)
  
  const product = await prisma.product.findUnique({
    where: { slug: decodedSlug },
    include: { 
      images: true,
      category: true
    }
  })
  
  if (!product || !product.isActive) {
    notFound()
  }

  // Formatter le produit pour le client
  const formattedProduct: Product = {
    id: product.id,
    slug: product.slug,
    name: { de: product.nameDe },
    category: product.categoryId,
    price: Number(product.price),
    oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
    images: product.images.sort((a, b) => a.sortOrder - b.sortOrder).map(img => img.url),
    rating: product.rating,
    reviewCount: product.reviewCount,
    stock: product.stock,
    badges: product.badges as ('premium' | 'bestseller' | 'new')[] | undefined,
    description: { de: product.descriptionDe || '' },
    shortDescription: { de: product.shortDescription || '' },
    specs: {
      material: product.material || '',
      dimensions: product.dimensions || '',
      weight: product.weightKg?.toString() || '',
      dishwasher: product.dishwasherSafe || false,
      induction: product.inductionSafe || false,
    },
    brand: product.brand || undefined,
    ean: product.ean || undefined,
    supplierSku: product.supplierSku || undefined
  }

  return <ProductContent product={formattedProduct} />
}
