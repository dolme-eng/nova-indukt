import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY inventory dump (read-only) — deleted right after use.
// Local Neon is unreachable from this machine; Vercel can reach it.
export const dynamic = 'force-dynamic'

const KEY = '7c40e9b15a2d83f6410e5b7c9d24a8f03e15b8d47c2a96f0b35e8174d0c2a69f3'

export async function POST(req: Request) {
  if (req.headers.get('x-audit-key') !== KEY) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  try {
    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(`
      SELECT p.id, p.slug, p."nameDe", p.brand, p."supplierSku", p.ean, p.price, p."oldPrice",
             p."costPrice", p."isActive", p.rating, p."reviewCount", p.material, p.dimensions,
             c.slug AS category,
             (SELECT COUNT(*)::int FROM "ProductImage" pi WHERE pi."productId" = p.id) AS img_rows,
             (SELECT COUNT(DISTINCT pi.url)::int FROM "ProductImage" pi WHERE pi."productId" = p.id) AS img_uniq,
             (SELECT COUNT(*)::int FROM "ProductImage" pi WHERE pi."productId" = p.id AND pi."isMain") AS img_mains,
             (SELECT COUNT(*)::int FROM "ProductImage" pi WHERE pi."productId" = p.id AND pi.url LIKE 'https%') AS img_cloud,
             (SELECT COUNT(*)::int FROM "ProductImage" pi WHERE pi."productId" = p.id AND pi.url LIKE '/images/%') AS img_local,
             (SELECT COUNT(*)::int FROM "OrderItem" oi WHERE oi."productId" = p.id) AS orders,
             (SELECT COUNT(*)::int FROM "Review" r WHERE r."productId" = p.id) AS reviews
      FROM "Product" p
      LEFT JOIN "Category" c ON c.id = p."categoryId"
      ORDER BY p.brand NULLS LAST, p.slug
    `)

    // image URLs per product, kept separate to keep the main payload small
    const imgs = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(`
      SELECT p.slug, pi.url, pi."sortOrder", pi."isMain"
      FROM "ProductImage" pi JOIN "Product" p ON p.id = pi."productId"
      ORDER BY p.slug, pi."sortOrder", pi.id
    `)

    const byProduct = new Map<string, { url: string; sortOrder: number; isMain: boolean }[]>()
    for (const i of imgs as Record<string, unknown>[]) {
      const arr = byProduct.get(String(i.slug)) ?? []
      arr.push({ url: String(i.url), sortOrder: Number(i.sortOrder), isMain: Boolean(i.isMain) })
      byProduct.set(String(i.slug), arr)
    }

    const inventory = (rows as Record<string, unknown>[]).map((r) => ({
      slug: r.slug,
      nameDe: r.nameDe,
      brand: r.brand,
      category: r.category,
      supplierSku: r.supplierSku,
      ean: r.ean,
      price: Number(r.price),
      oldPrice: r.oldPrice != null ? Number(r.oldPrice) : null,
      costPrice: r.costPrice != null ? Number(r.costPrice) : null,
      isActive: r.isActive,
      rating: r.rating != null ? Number(r.rating) : null,
      reviews: Number(r.reviews),
      orders: Number(r.orders),
      imgRows: Number(r.img_rows),
      imgUniq: Number(r.img_uniq),
      imgMains: Number(r.img_mains),
      imgCloud: Number(r.img_cloud),
      imgLocal: Number(r.img_local),
      images: byProduct.get(String(r.slug)) ?? [],
    }))

    const active = inventory.filter((p) => p.isActive)
    const summary = {
      total: inventory.length,
      active: active.length,
      inactive: inventory.length - active.length,
      noEan: inventory.filter((p) => !p.ean).length,
      zeroImages: active.filter((p) => p.imgUniq === 0).length,
      oneImage: active.filter((p) => p.imgUniq === 1).length,
      twoImages: active.filter((p) => p.imgUniq === 2).length,
      threePlus: active.filter((p) => p.imgUniq >= 3).length,
      noCostPrice: active.filter((p) => p.costPrice == null).length,
      withOrders: active.filter((p) => p.orders > 0).length,
      totalImageRows: inventory.reduce((s, p) => s + p.imgRows, 0),
      brands: [...new Set(active.map((p) => p.brand).filter(Boolean))].sort() as string[],
    }

    return NextResponse.json({ summary, inventory })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'unknown' }, { status: 500 })
  }
}