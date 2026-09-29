import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY audit route (batch #95-103) — deleted right after use.
// Static statements only, no user input. Guarded by secret header.
export const dynamic = 'force-dynamic'

const KEY = 'f1a7c40d93b85e268d7a1f05c4b9e38d2a6c07f1b5e94d83a270c6b5e1f9d42'

const SLUGS = [
  'miyabi-5000mcd-santoku-18cm',
  'miyabi-birchwood-santoku-18cm',
  'bob-kramer-meiji-chefmesser-20cm',
  'bob-kramer-meiji-santoku-18cm',
  'victorinox-swiss-classic-kochmesser-20cm',
  'victorinox-swiss-classic-brotmesser-26cm',
  'victorinox-fibrox-pro-chefmesser-20cm',
  'zwilling-spirit-messerset-3-teilig',
  'miyabi-5000mcd-messerblock-7-teilig',
]

const slugList = SLUGS.map((s) => `'${s}'`).join(',')

const FIX_STATEMENTS: { label: string; sql: string }[] = [
  // ---- generic URL dedupe across the batch (keeps oldest row) ----
  {
    label: 'dedupe by url (all products)',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" IN (SELECT id FROM "Product" WHERE slug IN (${slugList})) AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },
  // ---- p95: local 1.jpg is a Miyabi Birchwood knife (light cork handle), not the ebony-handled 5000MCD ----
  {
    label: 'p95 delete Birchwood local',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'miyabi-5000mcd-santoku-18cm') AND url LIKE '%/1.jpg'`,
  },
  // ---- p97/p98: cloud heroes are serrated bread knives, not the chef/santoku knives ----
  {
    label: 'p97/p98 delete wrong-type cloud heroes',
    sql: `DELETE FROM "ProductImage" WHERE "productId" IN (SELECT id FROM "Product" WHERE slug IN ('bob-kramer-meiji-chefmesser-20cm','bob-kramer-meiji-santoku-18cm')) AND url LIKE 'https%'`,
  },
  // ---- p99/p100/p101: local 1.jpg is the SAME "Colour Plus" knife-set photo on all three products ----
  {
    label: 'p99/p100/p101 delete shared Colour-Plus local',
    sql: `DELETE FROM "ProductImage" WHERE "productId" IN (SELECT id FROM "Product" WHERE slug IN ('victorinox-swiss-classic-kochmesser-20cm','victorinox-swiss-classic-brotmesser-26cm','victorinox-fibrox-pro-chefmesser-20cm')) AND url LIKE '%/1.jpg'`,
  },
  // ---- p102: local 1.jpg duplicates the cloud hero (same 3-knife Zwilling set) ----
  {
    label: 'p102 delete redundant local',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'zwilling-spirit-messerset-3-teilig') AND url LIKE '%/1.jpg'`,
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
