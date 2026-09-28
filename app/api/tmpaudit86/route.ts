import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY audit route (batch #86-94) — deleted right after use.
// Static statements only, no user input. Guarded by secret header.
export const dynamic = 'force-dynamic'

const KEY = 'b8d3f61a04c92e75f1a6b3d90c28e5741b9a2d63f0c7e85a41b2d9f60c3a7e'

const SLUGS = [
  'staub-cocotte-ronde-20cm',
  'demeyere-atlantis-7-stielkasserolle-20cm',
  'zwilling-plus-stielkasserolle-18cm',
  'silit-silargan-modesto-stielkasserolle-16cm',
  'zwilling-pro-s-chefmesser-20cm',
  'zwilling-pro-s-chefmesser-26cm',
  'zwilling-pro-s-utility-messer-16cm',
  'zwilling-pro-s-schaerfmesser-18cm',
  'miyabi-5000mcd-gyuto-20cm',
]

const slugList = SLUGS.map((s) => `'${s}'`).join(',')

const FIX_STATEMENTS: { label: string; sql: string }[] = [
  // ---- generic URL dedupe across the batch (keeps oldest row) ----
  {
    label: 'dedupe by url (all products)',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" IN (SELECT id FROM "Product" WHERE slug IN (${slugList})) AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },
  // ---- identical technical-drawing images (blueprints) ----
  {
    label: 'p86 delete blueprints',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'staub-cocotte-ronde-20cm') AND (url LIKE '%Cocotte 20 cm/2.jpg' OR url LIKE '%Cocotte 20 cm/3.jpg')`,
  },
  {
    label: 'p87/p88 delete blueprints',
    sql: `DELETE FROM "ProductImage" WHERE "productId" IN (SELECT id FROM "Product" WHERE slug IN ('demeyere-atlantis-7-stielkasserolle-20cm','zwilling-plus-stielkasserolle-18cm')) AND (url LIKE '%Stielkasserolle 20 cm/2.jpg' OR url LIKE '%Stielkasserolle 20 cm/3.jpg' OR url LIKE '%Stielkasserolle 18 cm/2.jpg' OR url LIKE '%Stielkasserolle 18 cm/3.jpg')`,
  },
  {
    label: 'p89 delete all locals (l1 near-duplicate of hero + 2 blueprints)',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'silit-silargan-modesto-stielkasserolle-16cm') AND url NOT LIKE 'https%'`,
  },
  // ---- p93: cloud hero is a chef's knife, not a sharpening knife ----
  {
    label: 'p93 delete wrong-type cloud hero',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'zwilling-pro-s-schaerfmesser-18cm') AND url LIKE 'https%'`,
  },
  // ---- hero pinning for products that keep several images ----
  {
    label: 'pin hero p86/p87/p88 (cloud)',
    sql: `UPDATE "ProductImage" SET "sortOrder" = -1 WHERE "productId" IN (SELECT id FROM "Product" WHERE slug IN ('staub-cocotte-ronde-20cm','demeyere-atlantis-7-stielkasserolle-20cm','zwilling-plus-stielkasserolle-18cm')) AND url LIKE 'https%'`,
  },
  {
    label: 'pin hero p90/p91/p92 (local 1.jpg)',
    sql: `UPDATE "ProductImage" SET "sortOrder" = -1 WHERE "productId" IN (SELECT id FROM "Product" WHERE slug IN ('zwilling-pro-s-chefmesser-20cm','zwilling-pro-s-chefmesser-26cm','zwilling-pro-s-utility-messer-16cm')) AND url LIKE '%/1.jpg'`,
  },
  // ---- resequence sortOrder 0..n ----
  {
    label: 'resequence sortOrder',
    sql: `WITH ranked AS (SELECT id, ROW_NUMBER() OVER (PARTITION BY "productId" ORDER BY "sortOrder" ASC, id ASC) - 1 AS rn FROM "ProductImage" WHERE "productId" IN (SELECT id FROM "Product" WHERE slug IN (${slugList}))) UPDATE "ProductImage" SET "sortOrder" = ranked.rn FROM ranked WHERE "ProductImage".id = ranked.id`,
  },
  // ---- exactly one isMain per product (only fixes products currently missing one) ----
  {
    label: 'ensure one isMain where missing',
    sql: `WITH missing AS (SELECT p.id AS pid FROM "Product" p WHERE p.slug IN (${slugList}) AND NOT EXISTS (SELECT 1 FROM "ProductImage" pi WHERE pi."productId" = p.id AND pi."isMain" = true)), firsts AS (SELECT DISTINCT ON (pi."productId") pi.id FROM "ProductImage" pi JOIN missing m ON m.pid = pi."productId" ORDER BY pi."productId", pi."sortOrder" ASC, pi.id ASC) UPDATE "ProductImage" SET "isMain" = true FROM firsts WHERE "ProductImage".id = firsts.id`,
  },
]

export async function POST(req: Request) {
  if (req.headers.get('x-audit-key') !== KEY) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  try {
    const backup = await prisma.$queryRawUnsafe(
      `SELECT p.slug, p."nameDe", p.brand, pi.id, pi.url, pi.alt, pi."sortOrder", pi."isMain" FROM "ProductImage" pi JOIN "Product" p ON p.id = pi."productId" WHERE p.slug IN (${slugList}) ORDER BY p.slug, pi."sortOrder" ASC, pi.id ASC`,
    )
    const steps: { label: string; rowCount: number }[] = []
    for (const st of FIX_STATEMENTS) {
      const rowCount = await prisma.$executeRawUnsafe(st.sql)
      steps.push({ label: st.label, rowCount })
    }
    const verification = await prisma.$queryRawUnsafe(
      `SELECT p.slug, COUNT(*)::int AS rows, COUNT(DISTINCT pi.url)::int AS uniq, SUM(CASE WHEN pi."isMain" THEN 1 ELSE 0 END)::int AS mains FROM "ProductImage" pi JOIN "Product" p ON p.id = pi."productId" WHERE p.slug IN (${slugList}) GROUP BY p.slug ORDER BY p.slug`,
    )
    return NextResponse.json({ backup, steps, verification })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'unknown' },
      { status: 500 },
    )
  }
}
