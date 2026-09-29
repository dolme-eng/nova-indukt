import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY audit route (batch #131-139) — deleted right after use.
// Static statements only, no user input. Guarded by secret header.
export const dynamic = 'force-dynamic'

const KEY = '3b8e1d94c07a52f6b8e1d94c07a52f6b8e1d94c07a52f6b8e1d94c07a52f6b8'

const SLUGS = [
  'de-buyer-mineral-b-crepe-pfanne-24cm',
  'fissler-vitavit-edition-45l',
  'tfa-air-control-digital',
  'de-buyer-mineral-b-crepe-pfanne-28cm',
  'fissler-vitavit-edition-65l',
  'matfer-copper-steel-crepe-pfanne-24cm',
  'tfa-pipet-kuhlschrank',
  'wmf-perfect-plus-45l',
  'tefal-preference-crepe-pfanne-25cm',
]

const slugList = SLUGS.map((s) => `'${s}'`).join(',')

const FIX_STATEMENTS: { label: string; sql: string }[] = [
  // ---- generic URL dedupe across the batch (keeps oldest row) ----
  {
    label: 'dedupe by url (all products)',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" IN (SELECT id FROM "Product" WHERE slug IN (${slugList})) AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },
  // ---- p132: 1.jpg is a 1300x90 advertising banner, 2/3/4 are blueprints ----
  {
    label: 'p132 delete banner + blueprints',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-vitavit-edition-45l') AND url NOT LIKE 'https%'`,
  },
  // ---- p135: 1.jpg is an "All American" cooker (wrong brand), 2/3/4 are blueprints ----
  {
    label: 'p135 delete wrong-brand + blueprints',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-vitavit-edition-65l') AND url NOT LIKE 'https%'`,
  },
  // ---- p138: 1.jpg is a 5-piece cookware set, 2/3/4 are blueprints ----
  {
    label: 'p138 delete cookware set + blueprints',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'wmf-perfect-plus-45l') AND url NOT LIKE 'https%'`,
  },
  // ---- p133/p137: 2 identical blueprint copies each ----
  {
    label: 'p133/p137 delete blueprints',
    sql: `DELETE FROM "ProductImage" WHERE "productId" IN (SELECT id FROM "Product" WHERE slug IN ('tfa-air-control-digital','tfa-pipet-kuhlschrank')) AND url NOT LIKE 'https%'`,
  },
  // ---- p139: 1.jpg is a deep frying pan, 2.jpg is an oven dish -> neither is a crepe pan ----
  {
    label: 'p139 delete wrong-type locals',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'tefal-preference-crepe-pfanne-25cm') AND url NOT LIKE 'https%'`,
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
