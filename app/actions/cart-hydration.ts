'use server'

import { prisma } from '@/lib/prisma'
import { logError } from '@/lib/logger'

export interface HydratedProduct {
  id: string
  nameDe: string
  slug: string
  price: number
  imageUrl: string
}

export async function getProductsForHydration(ids: string[]): Promise<HydratedProduct[]> {
  if (ids.length === 0) return []

  try {
    const products = await prisma.product.findMany({
      where: { id: { in: ids }, isActive: true },
      include: {
        images: {
          where: { isMain: true },
          take: 1,
        },
      },
    })

    return products.map((p) => ({
      id: p.id,
      nameDe: p.nameDe,
      slug: p.slug,
      price: Number(p.price),
      imageUrl: p.images[0]?.url || '',
    }))
  } catch (error) {
    logError('Error hydrating cart products:', error)
    return []
  }
}
