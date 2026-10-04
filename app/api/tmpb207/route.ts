import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY audit route (batch: 9 products after wmf-diadem-plus-kochtopf-hoch-20cm) — deleted right after use.
export const dynamic = 'force-dynamic'

const KEY = 'b03f7c28e5d941a6c820f4e7b3d15a9c6820fd47e19b3a5c86d24f7015be893'

const SLUGS = [
  'fissler-adamant-plus-bratpfanne-28cm',
  'soehnle-kuechenwaage-digital',
  'wmf-diadem-plus-set-7-teilig',
  'wmf-diadem-plus-kochtopf-hoch-24cm',
  'wmf-diadem-plus-bratpfanne-24cm',
  'wmf-kitchenmaxx-schneidebrett',
  'zwilling-plus-kochtopf-hoch-20cm',
  'wmf-function-4-set-7-teilig',
  'wmf-diadem-plus-bratpfanne-28cm',
]
const slugList = SLUGS.map((s) => `'${s}'`).join(',')
const pid = (s: string) => `(SELECT id FROM "Product" WHERE slug = '${s}')`

const FIX_STATEMENTS: { label: string; sql: string }[] = [
  {
    label: 'dedupe by url across the batch',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" IN (SELECT id FROM "Product" WHERE slug IN (${slugList})) AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },

  // ---- fissler bratpfanne 28: cloud is a deep lidded Schmorpot, 1.jpg is a small saute pan (other size) ----
  {
    label: 'fissler-bratpfanne-28 delete deep lidded pot',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('fissler-adamant-plus-bratpfanne-28cm')} AND url LIKE 'https%'`,
  },

  // ---- soehnle: 2.jpg is a placeholder, keep 1.jpg (large) + cloud ----
  {
    label: 'soehnle delete placeholder',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('soehnle-kuechenwaage-digital')} AND url LIKE '%/2.jpg'`,
  },

  // ---- wmf-diadem-plus-set-7 and function-4-set-7: local 1.jpg == 2.jpg, both placeholders ----
  {
    label: 'wmf-diadem-plus-set-7 delete placeholder pair',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('wmf-diadem-plus-set-7-teilig')} AND url LIKE '/images/products/%'`,
  },
  {
    label: 'wmf-function-4-set-7 delete placeholder pair',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('wmf-function-4-set-7-teilig')} AND url LIKE '/images/products/%'`,
  },

  // ---- wmf-kochtopf-hoch-24: local 1.jpg is a lidless shallow pot (not 'hoch'), 2.jpg placeholder ----
  {
    label: 'wmf-kochtopf-hoch-24 delete lidless shallow pot + placeholder',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('wmf-diadem-plus-kochtopf-hoch-24cm')} AND url LIKE '/images/products/%'`,
  },

  // ---- zwilling-kochtopf-hoch-20: 2.jpg placeholder, cloud = many pots on a hob ----
  {
    label: 'zwilling-kochtopf-hoch-20 delete placeholder + multi-pot kitchen scene',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('zwilling-plus-kochtopf-hoch-20cm')} AND (url LIKE '%/2.jpg' OR url LIKE 'https%')`,
  },

  // ---- wmf-kitchenmaxx-schneidebrett: cloud is a REDSALT branded bamboo board ----
  {
    label: 'wmf-schneidebrett delete REDSALT-branded board',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('wmf-kitchenmaxx-schneidebrett')} AND url LIKE 'https%'`,
  },

  // ---- wmf-diadem-plus-bratpfanne-24: image 3 is a glass LID, not a frying pan ----
  {
    label: 'wmf-bratpfanne-24 delete glass lid photo',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('wmf-diadem-plus-bratpfanne-24cm')} AND url LIKE '%-3.%'`,
  },

  // ---- wmf-diadem-plus-bratpfanne-28: all 3 clouds show cookware SETS, none shows a single 28cm pan ----
  {
    label: 'wmf-bratpfanne-28 delete all (cookware sets, no single pan)',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('wmf-diadem-plus-bratpfanne-28cm')}`,
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