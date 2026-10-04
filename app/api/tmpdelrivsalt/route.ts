import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY audit route (delete non-existent Rivsalt Topfregal products) — deleted right after use.
// Static statements only, no user input. Guarded by secret header.
export const dynamic = 'force-dynamic'

const KEY = 'f2b8d41c7e5a3096bd7c14e28a0f635d7e4b29a8c60d3f7152e9c4b8a06d37f1e'

// Rivsalt's real range (authorised retailer saltwater-shop.com, brand filter RIVSALT):
// salt graters + stands, salt cellars, salt/pepper sets, spice mixes. No cookware, no dish drainers.
const SLUGS = ['rivsalt-topfregal-klein', 'rivsalt-topfregal-gross', 'rivsalt-topfregal-5-stufen']
const slugList = SLUGS.map((s) => `'${s}'`).join(',')

const FIX_STATEMENTS: { label: string; sql: string }[] = [
  {
    label: 'delete images',
    sql: `DELETE FROM "ProductImage" WHERE "productId" IN (SELECT id FROM "Product" WHERE slug IN (${slugList}))`,
  },
  {
    label: 'delete reviews (FK Review->Product is ON DELETE RESTRICT)',
    sql: `DELETE FROM "Review" WHERE "productId" IN (SELECT id FROM "Product" WHERE slug IN (${slugList}))`,
  },
  {
    label: 'delete products',
    sql: `DELETE FROM "Product" WHERE slug IN (${slugList})`,
  },
]

export async function POST(req: Request) {
  if (req.headers.get('x-audit-key') !== KEY) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  try {
    const backup = await prisma.$queryRawUnsafe(
      `SELECT p.slug, p.id, p."nameDe", p.brand, p.price, p."oldPrice", p."isActive", p."supplierSku",
              (SELECT COUNT(*)::int FROM "ProductImage" pi WHERE pi."productId" = p.id) AS images,
              (SELECT COUNT(*)::int FROM "OrderItem" oi WHERE oi."productId" = p.id) AS orderItems,
              (SELECT COUNT(*)::int FROM "CartItem" ci WHERE ci."productId" = p.id) AS cartItems,
              (SELECT COUNT(*)::int FROM "WishlistItem" wi WHERE wi."productId" = p.id) AS wishlistItems,
              (SELECT COUNT(*)::int FROM "Review" r WHERE r."productId" = p.id) AS reviews
       FROM "Product" p WHERE p.slug IN (${slugList}) ORDER BY p.slug`,
    )
    const steps: { label: string; rowCount: number }[] = []
    for (const st of FIX_STATEMENTS) {
      const rowCount = await prisma.$executeRawUnsafe(st.sql)
      steps.push({ label: st.label, rowCount })
    }
    const remaining = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*)::int AS n FROM "Product" WHERE slug IN (${slugList})`,
    )
    const anyRivsalt = await prisma.$queryRawUnsafe(
      `SELECT slug, "nameDe" FROM "Product" WHERE brand ILIKE '%rivsalt%' ORDER BY slug`,
    )
    const total = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS n FROM "Product"`)
    return NextResponse.json({ backup, steps, remaining, anyRivsaltLeft: anyRivsalt, totalProducts: total })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'unknown' }, { status: 500 })
  }
}