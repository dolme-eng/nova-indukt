import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Product } from '@/lib/data/products'
import { ProductContent } from './ProductContent'

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params
  const decodedSlug = decodeURIComponent(resolvedParams.slug)
  
  const product = await prisma.product.findUnique({
    where: { slug: decodedSlug },
    include: { images: true }
  })
  
  if (!product) return {}

  const title = `${product.nameDe} | Premium Induktions-Kochgeschirr`
  const description = product.metaDescription || product.shortDescription || `Kaufen Sie ${product.nameDe} bei NOVA INDUKT. Erstklassige Qualität für Induktionsherde.`
  const mainImage = product.images.find(img => img.isMain)?.url || product.images[0]?.url

  return {
    title,
    description,
    keywords: product.metaTitle?.split(',') || [product.nameDe, 'Induktion', 'Kochgeschirr'],
    alternates: {
      canonical: `/produkt/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      images: mainImage ? [{ url: mainImage, alt: product.nameDe }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: mainImage ? [mainImage] : [],
    }
  }
}

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

  // Fetch related products from same category
  const relatedDb = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true
    },
    include: { images: true },
    take: 4
  })

  const relatedProducts: Product[] = relatedDb.map(p => ({
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
  }))

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.nameDe,
    "image": product.images.map(img => img.url),
    "description": product.descriptionDe || product.shortDescription,
    "sku": product.supplierSku,
    "gtin13": product.ean,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "NOVA INDUKT"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://nova-indukt.de/produkt/${product.slug}`,
      "priceCurrency": "EUR",
      "price": Number(product.price).toFixed(2),
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || 5,
      "reviewCount": product.reviewCount || 1
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ProductContent product={formattedProduct} relatedProducts={relatedProducts} />
    </>
  )
}
