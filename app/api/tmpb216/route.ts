import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY audit route (batch: 9 products after wmf-diadem-plus-bratpfanne-28cm) — deleted right after use.
export const dynamic = 'force-dynamic'

const KEY = 'd19a47e0b83c65f24d9071e5a3b8c47f6012e5d98b3a7c460f1e85d3b2a97406'

const SLUGS = [
  'fissler-adapterplatte-16cm',
  'zwilling-plus-kochtopf-hoch-24cm',
  'tefal-talent-pro-bratpfanne-26cm',
  'zwilling-spirit-set-7-teilig',
  'wmf-adapterplatte-14cm',
  'silit-silargan-kochtopf-hoch-20cm',
  'tefal-talent-pro-bratpfanne-28cm',
  'zwilling-schneidebrett-set-3tlg',
  'silit-silargan-kochtopf-hoch-24cm',
]
const slugList = SLUGS.map((s) => `'${s}'`).join(',')
const pid = (s: string) => `(SELECT id FROM "Product" WHERE slug = '${s}')`

const FIX_STATEMENTS: { label: string; sql: string }[] = [
  {
    label: 'dedupe by url across the batch',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" IN (SELECT id FROM "Product" WHERE slug IN (${slugList})) AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },

  // ---- fissler Adapterplatte 16: 2.jpg is a placeholder; the cloud shows a saucepan with lid ----
  {
    label: 'fissler-adapterplatte delete placeholder + saucepan-with-lid cloud',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('fissler-adapterplatte-16cm')} AND (url LIKE '%/2.jpg' OR url LIKE 'https%')`,
  },

  // ---- wmf Adapterplatte 14: 2.jpg placeholder; cloud shows a deep pot with glass lid ----
  {
    label: 'wmf-adapterplatte delete placeholder + deep-pot-with-lid cloud',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('wmf-adapterplatte-14cm')} AND (url LIKE '%/2.jpg' OR url LIKE 'https%')`,
  },

  // ---- tefal 26 / 28: local 1.jpg shows THREE pans of different sizes (a set), cloud is a single pan ----
  {
    label: 'tefal-talent-pro-26 delete 3-pan-set photo',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('tefal-talent-pro-bratpfanne-26cm')} AND url LIKE '/images/products/%'`,
  },
  {
    label: 'tefal-talent-pro-28 delete 3-pan-set photo',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('tefal-talent-pro-bratpfanne-28cm')} AND url LIKE '/images/products/%'`,
  },

  // ---- zwilling-spirit-set-7: local 1.jpg == 2.jpg, both placeholders; cloud is a single saute pan ----
  {
    label: 'zwilling-spirit-set-7 delete placeholder pair',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('zwilling-spirit-set-7-teilig')} AND url LIKE '/images/products/%'`,
  },

  // ---- zwilling-schneidebrett-set-3: 2.jpg placeholder; 1.jpg and cloud are knives+board / boards ----
  {
    label: 'zwilling-schneidebrett-set-3 delete placeholder',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('zwilling-schneidebrett-set-3tlg')} AND url LIKE '%/2.jpg'`,
  },

  // ---- silit 20 / 24: 2.jpg placeholders ----
  {
    label: 'silit-kochtopf delete placeholders',
    sql: `DELETE FROM "ProductImage" WHERE "productId" IN (${pid('silit-silargan-kochtopf-hoch-20cm')},${pid('silit-silargan-kochtopf-hoch-24cm')}) AND url LIKE '%/2.jpg'`,
  },

  // ---- zwilling-plus-kochtopf-hoch-24: 2.jpg placeholder ----
  {
    label: 'zwilling-kochtopf-hoch-24 delete placeholder',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('zwilling-plus-kochtopf-hoch-24cm')} AND url LIKE '%/2.jpg'`,
  },

  {
    label: 'resequence sortOrder 0..n',
    sql: `WITH ranked AS (SELECT pi.id, ROW_NUMBER() OVER (PARTITION BY pi."productId" ORDER BY pi."sortOrder" ASC, pi.id ASC) - 1 AS rn FROM "ProductImage" pi WHERE pi."productId" IN (SELECT id FROM "Product" WHERE slug IN (${slugList}))) UPDATE "ProductImage" SET "sortOrder" = ranked.rn FROM ranked WHERE "ProductImage".id = ranked.id`,
  },
  {
    label: 'exactly one isMain per product',
    sql: `WITH ranked AS (SELECT pi.id, ROW_NUMBER() OVER (PARTITION BY pi."productId" ORDER BY pi."sortOrder" ASC, pi.id ASC) AS rn FROM "ProductImage" pi WHERE pi."productId" IN (SELECT id FROM "Product" WHERE slug IN (${slugList}))) UPDATE "ProductImage" SET "isMain" = (ranked.rn = 1) FROM ranked WHERE "ProductImage".id = ranked.id`,
  },
]

export async function POST(req: Request) {
  if (req.headers.get('x-audit-key') !== KEY) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  try {
    const backup: unknown[] = await prisma.$queryRawUnsafe(
      `SELECT p.slug, p."nameDe", pi.id, pi.url, pi."sortOrder", pi."isMain" FROM "ProductImage" pi JOIN "Product" p ON p.id = pi."productId" WHERE p.slug IN (${slugList}) ORDER BY p.slug, pi."sortOrder", pi.id`,
    )
    const steps: { label: string; rowCount: number }[] = []
    for (const st of FIX_STATEMENTS) {
      const rowCount = await prisma.$executeRawUnsafe(st.sql)
      steps.push({ label: st.label, rowCount })
    }
    const verification = await prisma.$queryRawUnsafe(
      `SELECT p.slug, COUNT(pi.id)::int AS rows, COUNT(DISTINCT pi.url)::int AS uniq, COALESCE(SUM(CASE WHEN pi."isMain" THEN 1 ELSE 0 END),0)::int AS mains FROM "Product" p LEFT JOIN "ProductImage" pi ON pi."productId" = p.id WHERE p.slug IN (${slugList}) GROUP BY p.slug ORDER BY p.slug`,
    )
    const final = await prisma.$queryRawUnsafe(
      `SELECT p.slug, pi.url, pi."sortOrder", pi."isMain" FROM "ProductImage" pi JOIN "Product" p ON p.id = pi."productId" WHERE p.slug IN (${slugList}) ORDER BY p.slug, pi."sortOrder", pi.id`,
    )
    return NextResponse.json({ backupCount: backup.length, backup, steps, verification, final })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'unknown' }, { status: 500 })
  }
}