import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY audit route (delete 8 non-existent products + fix Ceraclen copy) — deleted right after use.
export const dynamic = 'force-dynamic'

const KEY = '4f81c2a70b93d5e61c8a02f47d3b95e0827c1a6f4e930db25a7c83f16e207bd'

// Brand research:
//  Lukata / Stal / Interkitchen  -> no trace of any such brand on the web
//  Kratzschutz                   -> a keyword ("scratch protection"), not a brand; real market = KITCHENRAKU, POFIBO, Wallario
//  Sallys                        -> real brand but enamelled domestic cast iron, no induction mat in its range
//  AMT Gastroguss                -> real brand, but the 28 cm 528 pan is cast aluminium and NOT induction-capable
//  Bugatti                       -> small appliances; no 8-piece raclette set exists
const DELETE = [
  'lukata-silikon-induktionskochfeld-schutzmatte',
  'stal-ersatzgriff-universal',
  'interkitchen-induktions-adapterplatte-20cm',
  'sallys-induktionsmatte-oval',
  'kratzschutzmatte-induktion-28cm',
  'kratzschutzmatte-induktion-32cm',
  'amt-gastroguss-i428-28cm',
  'bugatti-raclette-8-teilig',
]
const delList = DELETE.map((s) => `'${s}'`).join(',')

const FIXES: { label: string; sql: string }[] = [
  {
    label: 'delete images of the 8 non-existent products',
    sql: `DELETE FROM "ProductImage" WHERE "productId" IN (SELECT id FROM "Product" WHERE slug IN (${delList}))`,
  },
  {
    label: 'delete reviews (FK Review->Product is ON DELETE RESTRICT)',
    sql: `DELETE FROM "Review" WHERE "productId" IN (SELECT id FROM "Product" WHERE slug IN (${delList}))`,
  },
  {
    label: 'delete the 8 products',
    sql: `DELETE FROM "Product" WHERE slug IN (${delList})`,
  },
  // Ceraclen is a real product (Reckitt Benckiser). Fix wrong dosage, false claim and price.
  {
    label: 'ceraclen: real 200 ml dosage (was 250 ml) + drop the "Platz 1 Testsieger" claim + price 3.95',
    sql: `UPDATE "Product" SET "nameDe" = 'Ceraclen 3 in 1 Reiniger & Pfleger 200 ml', price = 3.95, dimensions = '200 ml', "metaTitle" = 'Ceraclen 3 in 1 Reiniger & Pfleger 200ml | NOVA INDUKT', "metaDescription" = 'Ceraclen 3-in-1 Glaskeramikreiniger, 200 ml. Reinigt, poliert und schützt mit natürlichen Polierperlen. Für Glaskeramik und Induktion.' WHERE slug = 'ceraclen-3in1-reiniger-pfleger'`,
  },
]

export async function POST(req: Request) {
  if (req.headers.get('x-audit-key') !== KEY) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  try {
    const backup = await prisma.$queryRawUnsafe(
      `SELECT p.slug, p.id, p."nameDe", p.brand, p.price, p."isActive", p."supplierSku", p.dimensions,
              (SELECT COUNT(*)::int FROM "ProductImage" pi WHERE pi."productId" = p.id) AS images,
              (SELECT COUNT(*)::int FROM "OrderItem" oi WHERE oi."productId" = p.id) AS orderItems,
              (SELECT COUNT(*)::int FROM "CartItem" ci WHERE ci."productId" = p.id) AS cartItems,
              (SELECT COUNT(*)::int FROM "WishlistItem" wi WHERE wi."productId" = p.id) AS wishlistItems,
              (SELECT COUNT(*)::int FROM "Review" r WHERE r."productId" = p.id) AS reviews
       FROM "Product" p WHERE p.slug IN (${delList},'ceraclen-3in1-reiniger-pfleger') ORDER BY p.slug`,
    )
    const steps: { label: string; rowCount: number }[] = []
    for (const f of FIXES) {
      const rowCount = await prisma.$executeRawUnsafe(f.sql)
      steps.push({ label: f.label, rowCount })
    }
    const remaining = await prisma.$queryRawUnsafe(
      `SELECT slug, "nameDe", price, dimensions FROM "Product" WHERE slug IN (${delList},'ceraclen-3in1-reiniger-pfleger') ORDER BY slug`,
    )
    const total = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS n FROM "Product"`)
    return NextResponse.json({ backup, steps, remaining, totalProducts: total })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'unknown' }, { status: 500 })
  }
}