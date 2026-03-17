import { notFound } from 'next/navigation'
import { products } from '@/lib/data/products'
import { ProductContent } from './ProductContent'

// Generate static params for all products
export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default function ProductPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // Find product by slug
  const product = products.find(p => p.slug === params.slug)
  
  if (!product) {
    notFound()
  }

  return <ProductContent product={product} />
}
