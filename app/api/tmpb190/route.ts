import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY audit route (batch: 9 products after wmf-topfregal-edelstahl) — deleted right after use.
// Static statements only, no user input. Guarded by secret header.
export const dynamic = 'force-dynamic'

const KEY = '8e4b1f70a3d95c26e0b84f17a2d63905c8e7b4f16a0d92c53b7e8f14a6d205c9'

const SLUGS = [
  'zwilling-spirit-bestechenset-30-teilig',
  'ikea-variera-topfregal',
  'zwilling-now-s-bestechenset-68-teilig',
  'zwilling-now-s-bestechenset-30-teilig',
  'wmf-monde-messerset-3-teilig',
  'zwilling-pro-s-messerset-3-teilig',
  'fissler-adamant-plus-bratpfanne-24cm',
  'tfa-digital-kuehlschrank-thermometer',
  'wmf-diadem-plus-kochtopf-hoch-20cm',
]
const slugList = SLUGS.map((s) => `'${s}'`).join(',')
const pid = (s: string) => `(SELECT id FROM "Product" WHERE slug = '${s}')`

const FIX_STATEMENTS: { label: string; sql: string }[] = [
  {
    label: 'dedupe by url across the batch',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" IN (SELECT id FROM "Product" WHERE slug IN (${slugList})) AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },

  // ---- ikea-variera-topfregal: only the white VARIERA shelf on white is the product ----
  {
    label: 'ikea delete 2 lifestyle kitchen shots',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('ikea-variera-topfregal')} AND url LIKE 'https%'`,
  },

  // ---- zwilling-spirit-bestechenset-30: the 2 clouds are byte-identical ----
  {
    label: 'zwilling-spirit delete duplicate cloud',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('zwilling-spirit-bestechenset-30-teilig')} AND url LIKE '%-3.%'`,
  },

  // ---- zwilling-pro-s-messerset-3: the 2 clouds are byte-identical ----
  {
    label: 'zwilling-pro-s-messerset delete duplicate cloud',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('zwilling-pro-s-messerset-3-teilig')} AND url LIKE '%-3.%'`,
  },

  // ---- wmf-monde-messerset-3: clouds show CUTLERY (5 pc) and a 5-KNIFE block, product is a 3-knife set ----
  {
    label: 'wmf-monde-messerset delete both clouds (cutlery / 5 knives)',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('wmf-monde-messerset-3-teilig')} AND url LIKE 'https%'`,
  },

  // ---- fissler-adamant-plus-bratpfanne-24: clouds and local 1.jpg show a deep lidded pot (a Schmorpot) ----
  {
    label: 'fissler-bratpfanne delete deep-lidded-pot images (wrong product)',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('fissler-adamant-plus-bratpfanne-24cm')} AND (url LIKE 'https%' OR url LIKE '%/1.jpg')`,
  },

  // ---- tfa thermometer: local 2.jpg is a placeholder, and local 1.jpg == cloud (same product shot) ----
  {
    label: 'tfa delete placeholder + duplicate local',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('tfa-digital-kuehlschrank-thermometer')} AND url LIKE '/images/products/%'`,
  },

  // ---- wmf-diadem-plus-kochtopf-hoch-20: local 1.jpg is a lidless shallow pot, local 2.jpg is a placeholder ----
  {
    label: 'wmf-kochtopf delete mismatched local + placeholder',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = ${pid('wmf-diadem-plus-kochtopf-hoch-20cm')} AND url LIKE '/images/products/%'`,
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