import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY audit route (batch: 9 products after silit-silargan-kochtopf-hoch-24cm) — deleted right after use.
export const dynamic = 'force-dynamic'

const KEY = 'c62b08e53f7a14d97e0b6c4825af3d7091c8b4e2657d03a9f1b8e4c72d605af3'

const SLUGS = [
  'demeyere-essential-5-set-5-teilig',
  'zwilling-summit-plus-bratpfanne-24cm',
  'kratzschutzmatte-induktion-28cm',
  'fissler-opc-schmortopf-24cm',
  'silit-silargan-set-5-teilig',
  'zwilling-summit-plus-bratpfanne-28cm',
  'kratzschutzmatte-induktion-32cm',
  'fissler-opc-schmortopf-28cm',
  'bosch-serie-6-induktionskochfeld-60cm',
]
const slugList = SLUGS.map((s) => `'${s}'`).join(',')
const pid = (s: string) => `(SELECT id FROM "Product" WHERE slug = '${s}')`

const FIX_STATEMENTS: { label: string; sql: string }[] = [
  {
    label: 'dedupe by url across the batch',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" IN (SELECT id FROM "Product" WHERE slug IN (${slugList})) AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },

  // ---- 2 sets: BOTH local files are identical placeholders, only the cloud shows the real set ----
  {
    label: 'demeyere-essential-5-set delete placeholder pair',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('demeyere-essential-5-set-5-teilig')} AND url LIKE '/images/products/%'`,
  },
  {
    label: 'silit-silargan-set-5 delete placeholder pair',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('silit-silargan-set-5-teilig')} AND url LIKE '/images/products/%'`,
  },

  // ---- kratzschutzmatte 28: 2.jpg placeholder; cloud is byte-identical to the 32 cm cloud ----
  // ---- kratzschutzmatte 32: 2.jpg placeholder; cloud is the same shared photo ----
  {
    label: 'kratzschutzmatte delete placeholders',
    sql: `DELETE FROM "ProductImage" WHERE "productId" IN (${pid('kratzschutzmatte-induktion-28cm')},${pid('kratzschutzmatte-induktion-32cm')}) AND url LIKE '%/2.jpg'`,
  },
  {
    label: 'kratzschutzmatte-32 delete cloud (same photo as the 28 cm one, 1.jpg is the real size)',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('kratzschutzmatte-induktion-32cm')} AND url LIKE 'https%'`,
  },

  // ---- zwilling-summit+ 24: 2.jpg shows the UNDERSIDE of a pan, not the product face ----
  {
    label: 'zwilling-summit-24 delete upside-down pan photo',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('zwilling-summit-plus-bratpfanne-24cm')} AND url LIKE '%/2.jpg'`,
  },

  // ---- zwilling-summit+ 28: local 1.jpg is the SAME pan as the cloud and as the 24 cm one ----
  {
    label: 'zwilling-summit-28 delete duplicate of the cloud',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('zwilling-summit-plus-bratpfanne-28cm')} AND url LIKE '/images/products/%'`,
  },

  // ---- fissler schmortopf 24 / 28: 2.jpg placeholders ----
  {
    label: 'fissler-schmortopf delete placeholders',
    sql: `DELETE FROM "ProductImage" WHERE "productId" IN (${pid('fissler-opc-schmortopf-24cm')},${pid('fissler-opc-schmortopf-28cm')}) AND url LIKE '%/2.jpg'`,
  },

  // ---- bosch kochfeld: 1.jpg is a 600x338 crop of the same hob as the cloud ----
  {
    label: 'bosch-kochfeld delete duplicate local crop',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('bosch-serie-6-induktionskochfeld-60cm')} AND url LIKE '/images/products/%'`,
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