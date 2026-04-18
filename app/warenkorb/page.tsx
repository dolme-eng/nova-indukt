import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Product } from '@/lib/data/products'
import { CartContent } from './CartContent'

export const metadata: Metadata = {
  title: 'Warenkorb | NOVA INDUKT',
  description: 'Überprüfen Sie Ihre ausgewählten Produkte im Warenkorb. Sichere Bezahlung, kostenloser Versand ab 500€.',
  keywords: ['Warenkorb', 'Einkauf', 'Bestellung', 'Kasse', 'NOVA INDUKT'],
  robots: {
    index: false,
    follow: false,
  },
}

export default async function CartPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { images: true },
    take: 10 // Limiter pour les recommandations initiales
  })

  const formattedProducts: Product[] = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: { de: p.nameDe },
    category: p.categoryId,
    price: Number(p.price),
    oldPrice: p.oldPrice ? Number(p.oldPrice) : undefined,
    images: p.images.sort((a, b) => a.sortOrder - b.sortOrder).map((img) => img.url),
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

  return <CartContent recommendedProducts={formattedProducts} />
}
