import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY audit route (batch: 9 products after wmf-pfannenschoner-28cm) — deleted right after use.
// Static statements only, no user input. Guarded by secret header.
export const dynamic = 'force-dynamic'

const KEY = 'c47a1e0b93d5f82641ae07b3c59d2f684e10a7c53b96d2f08471ea3c6b95d02'

const SLUGS = [
  'fissler-pfannenschoner-26cm',
  'wmf-monde-bestechenset-30-teilig',
  'fissler-heat-memory-wasserkocher',
  'weber-reiniger-holzschutz',
  'fissler-pfannenschoner-28cm',
  'wmf-function-4-bestechenset-68-teilig',
  'tefal-masterclass-waffeleisen',
  'wmf-antihaft-reiniger',
  'rivsalt-topfregal-klein',
]
const slugList = SLUGS.map((s) => `'${s}'`).join(',')

const FIX_STATEMENTS: { label: string; sql: string }[] = [
  // ---- generic: collapse rows sharing one URL ----
  {
    label: 'dedupe by url across the batch',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" IN (SELECT id FROM "Product" WHERE slug IN (${slugList})) AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },

  // ---- pfannenschoner 26: clouds are a Fissler AD banner and a generic kitchen scene ----
  {
    label: 'p-pfannenschoner-26 delete clouds (ad banner + kitchen scene)',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-pfannenschoner-26cm') AND url LIKE 'https%'`,
  },
  // ---- pfannenschoner 28: clouds are a pot-wall detail crop and a frying pan ----
  {
    label: 'p-pfannenschoner-28 delete clouds (pot detail crop + frying pan)',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-pfannenschoner-28cm') AND url LIKE 'https%'`,
  },

  // ---- heat-memory-wasserkocher: local is an ad banner, -3 cloud is byte-identical to the base cloud ----
  {
    label: 'p-heat-memory delete ad-banner local + duplicate cloud',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-heat-memory-wasserkocher') AND (url LIKE '/images/products/%' OR url LIKE '%-3.%')`,
  },

  // ---- weber holzschutz: placeholder + a PIAD "Holzoel" 10s lacquer can + a Webertec caulk cartridge ----
  {
    label: 'p-weber-holzschutz delete all (placeholder, PIAD lacquer, Webertec caulk)',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'weber-reiniger-holzschutz')`,
  },

  // ---- tefal waffeleisen: both clouds show an OptiGrill contact grill (and are byte-identical) ----
  {
    label: 'p-tefal-waffeleisen delete clouds (OptiGrill, not a waffle iron)',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'tefal-masterclass-waffeleisen') AND url LIKE 'https%'`,
  },

  // ---- wmf antihaft-reiniger: both clouds are a generic white/blue bottle (byte-identical) ----
  {
    label: 'p-wmf-antihaft-reiniger delete clouds (generic bottle, identical pair)',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'wmf-antihaft-reiniger') AND url LIKE 'https%'`,
  },

  // ---- rivsalt: utensil rail + grater/salt-cellar lifestyle shots, never a dish drainer ----
  {
    label: 'p-rivsalt delete all (utensil rail, grater + salt cellar)',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'rivsalt-topfregal-klein')`,
  },

  // ---- function-4: its two clouds are byte-identical ----
  {
    label: 'p-function-4 delete duplicate cloud',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'wmf-function-4-bestechenset-68-teilig') AND url LIKE '%-3.%'`,
  },

  // ---- housekeeping ----
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
      `SELECT p.slug, p."nameDe", p.brand, p."supplierSku", pi.id, pi.url, pi.alt, pi."sortOrder", pi."isMain" FROM "ProductImage" pi JOIN "Product" p ON p.id = pi."productId" WHERE p.slug IN (${slugList}) ORDER BY p.slug, pi."sortOrder" ASC, pi.id ASC`,
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