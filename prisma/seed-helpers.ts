/**
 * Shared helper for all product seed files.
 * Provides the `imgs()` function and common product upsert logic.
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Build image array for a product folder.
 */
export function imgs(folder: string, files: string[]) {
  const base = `/images/products/${folder}`
  return files.map((file, i) => ({
    url: `${base}/${file}`,
    alt: folder,
    sortOrder: i,
    isMain: i === 0,
  }))
}

/**
 * Seed interface for a single product.
 */
export interface SeedProduct {
  slug: string
  supplierSku: string
  sortOrder?: number
  nameDe: string
  shortDescription: string
  descriptionDe: string
  price: number
  oldPrice?: number
  brand: string
  material: string
  dimensions: string
  weightKg?: number
  dishwasherSafe: boolean
  inductionSafe: boolean
  vatRatePercent: number
  priceIncludesVat: boolean
  badges: string[]
  rating: number
  reviewCount: number
  metaTitle: string
  metaDescription: string
  categorySlug: string
  folder: string
  imageFiles: string[]
}

/**
 * Upsert a single product with its images.
 */
export async function upsertProduct(
  p: SeedProduct,
  categoryMap: Map<string, string>
) {
  const categoryId = categoryMap.get(p.categorySlug)
  if (!categoryId) {
    console.warn(`  ⚠ Category "${p.categorySlug}" not found for "${p.nameDe}", skipping.`)
    return
  }

  const data = {
    slug: p.slug,
    supplierSku: p.supplierSku,
    sortOrder: p.sortOrder ?? 0,
    nameDe: p.nameDe,
    shortDescription: p.shortDescription,
    descriptionDe: p.descriptionDe,
    price: p.price,
    oldPrice: p.oldPrice,
    brand: p.brand,
    material: p.material,
    dimensions: p.dimensions,
    weightKg: p.weightKg,
    dishwasherSafe: p.dishwasherSafe,
    inductionSafe: p.inductionSafe,
    vatRatePercent: p.vatRatePercent,
    priceIncludesVat: p.priceIncludesVat,
    badges: p.badges,
    rating: p.rating,
    reviewCount: p.reviewCount,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    categoryId,
    isActive: true,
  }

  const existing = await prisma.product.findUnique({ where: { slug: p.slug } })

  if (existing) {
    await prisma.product.update({ where: { id: existing.id }, data })
    await prisma.productImage.deleteMany({ where: { productId: existing.id } })
    await prisma.productImage.createMany({
      data: imgs(p.folder, p.imageFiles).map((img) => ({ ...img, productId: existing.id })),
    })
  } else {
    const created = await prisma.product.create({ data })
    await prisma.productImage.createMany({
      data: imgs(p.folder, p.imageFiles).map((img) => ({ ...img, productId: created.id })),
    })
  }
}

/**
 * Run a batch of products through the upsert logic.
 */
export async function seedProducts(products: SeedProduct[]) {
  const categories = await prisma.category.findMany()
  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]))

  for (const p of products) {
    await upsertProduct(p, categoryMap)
  }
}

export { prisma }
