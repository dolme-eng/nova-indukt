import { notFound } from 'next/navigation'
import { products } from '@/lib/data/products'
import { ProductContent } from './ProductContent'

// Generate static params for all products
export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = await params
  // Find product by slug safely handling URI encoding
  const decodedSlug = decodeURIComponent(resolvedParams.slug)
  const product = products.find(p => p.slug === resolvedParams.slug || p.slug === decodedSlug)
  
  if (!product) {
    notFound()
  }

  return <ProductContent product={product} />
}
