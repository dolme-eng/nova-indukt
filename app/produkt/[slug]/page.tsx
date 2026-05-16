import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import { Product, mapDbProductToUi } from '@/lib/data/products'
import { ProductContent } from './ProductContent'

export const revalidate = 120

const getProductBySlug = cache(async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
      category: true,
    },
  })
})

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params
  const decodedSlug = decodeURIComponent(resolvedParams.slug)
  
  const product = await getProductBySlug(decodedSlug)
  
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
  
  const product = await getProductBySlug(decodedSlug)
  
  if (!product || !product.isActive) {
    notFound()
  }

  // Formatter le produit pour le client
  const formattedProduct = mapDbProductToUi(product)

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

  const relatedProducts = relatedDb.map(mapDbProductToUi)

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
    ...(product.reviewCount > 0 ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewCount
      }
    } : {})
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
