import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import { mapDbProductToUi } from '@/lib/data/products'
import { ProductContent } from './ProductContent'
import { SHOP_DOMAIN } from '@/lib/constants/shop'
import { safeJsonLd } from '@/lib/utils/json-ld'

export const revalidate = 120

export async function generateStaticParams() {
  // try/catch: a cold/unreachable Neon at build time must not fail the build
  // (pages then render on demand via ISR)
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true },
      take: 5000,
    })
    return products.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

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
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const decodedSlug = decodeURIComponent(resolvedParams.slug)

  const product = await getProductBySlug(decodedSlug)

  if (!product) return {}

  const title = (product.metaTitle || `${product.nameDe} | Premium Induktions-Kochgeschirr`)
    .replace(/\s*\|\s*NOVA\s*INDUKT\s*$/i, '')
  const description =
    product.metaDescription ||
    product.shortDescription ||
    `Kaufen Sie ${product.nameDe} bei NOVA INDUKT. Erstklassige Qualität für Induktionsherde.`
  const mainImage = product.images.find((img) => img.isMain)?.url || product.images[0]?.url

  return {
    title,
    description,
    keywords: product.metaTitle?.split(',') || [product.nameDe, 'Induktion', 'Kochgeschirr'],
    alternates: {
      canonical: `${SHOP_DOMAIN}/produkt/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SHOP_DOMAIN}/produkt/${product.slug}`,
      siteName: 'NOVA INDUKT',
      type: 'website',
      locale: 'de_DE',
      images: mainImage ? [{ url: mainImage, alt: product.nameDe, width: 800, height: 600 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: mainImage ? [mainImage] : [],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const decodedSlug = decodeURIComponent(resolvedParams.slug)

  const product = await getProductBySlug(decodedSlug)

  if (!product || !product.isActive) {
    notFound()
  }

  // Format product for client component
  const formattedProduct = mapDbProductToUi(product)

  // Fetch related products from same category
  const relatedDb = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: { images: true },
    take: 4,
  })

  const relatedProducts = relatedDb.map(mapDbProductToUi)

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Startseite', item: SHOP_DOMAIN },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Produkte',
          item: `${SHOP_DOMAIN}/produkte`,
        },
        ...(product.category
          ? [
              {
                '@type': 'ListItem',
                position: 3,
                name: product.category.nameDe,
                item: `${SHOP_DOMAIN}/produkte?kategorie=${product.category.slug}`,
              },
            ]
          : []),
        {
          '@type': 'ListItem',
          position: product.category ? 4 : 3,
          name: product.nameDe,
          item: `${SHOP_DOMAIN}/produkt/${product.slug}`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.nameDe,
      image: product.images.map((img) => img.url),
      description: product.descriptionDe || product.shortDescription,
      sku: product.id,
      // gtin13 omitted when null — schema.org rejects explicit null
      ...(product.ean ? { gtin13: product.ean } : {}),
      mpn: product.supplierSku || product.id,
      itemCondition: 'https://schema.org/NewCondition',
      brand: {
        '@type': 'Brand',
        name: product.brand || 'NOVA INDUKT',
      },
      seller: {
        '@type': 'Organization',
        name: 'NOVA INDUKT',
        url: SHOP_DOMAIN,
      },
      offers: {
        '@type': 'Offer',
        url: `${SHOP_DOMAIN}/produkt/${product.slug}`,
        priceCurrency: 'EUR',
        price: Number(product.price).toFixed(2),
        priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          .toISOString()
          .split('T')[0],
        availability: product.isActive ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
      },
      ...(product.reviewCount > 0
        ? {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: product.rating,
              reviewCount: product.reviewCount,
              bestRating: 5,
              worstRating: 1,
            },
          }
        : {}),
    },
  ]

  return (
    <>
      {structuredData.map((sd, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(sd) }}
        />
      ))}
      <ProductContent product={formattedProduct} relatedProducts={relatedProducts} />
    </>
  )
}
