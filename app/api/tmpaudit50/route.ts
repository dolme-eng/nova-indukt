import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY audit route (batch #50-58) — deleted right after use.
// Static statements only, no user input. Guarded by secret header.
export const dynamic = 'force-dynamic'

const KEY = '9f3c7a1e4b8d2f6a5c0e8b4d7a1f3c69e2b5d8f0a4c7e1b3d6f9a2c5e8b1d4f7a'

const SLUGS = [
  'tefal-jamie-oliver-wok-28cm',
  'roesle-elegance-globe-topfset-10tlg',
  'demeyere-proline-7-28cm',
  'fissler-adamant-wok-32cm',
  'siemens-kochfeldreiniger-glaskeramik-induktion',
  'wmf-function-4-topfset-5teilig',
  'tefal-duetto-topfset-9tlg',
  'lodge-logic-l10sk3-gusseisen-30cm',
  'woll-concept-wok-1030nc-30cm',
]

const slugList = SLUGS.map((s) => `'${s}'`).join(',')

const FIX_STATEMENTS: { label: string; sql: string }[] = [
  {
    label: 'p50 delete tiny local dups',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'tefal-jamie-oliver-wok-28cm') AND url = '/images/products/Tefal Jamie Oliver Wokpfanne - 28 cm/1.jpg'`,
  },
  {
    label: 'p52 delete wrong-model locals',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'demeyere-proline-7-28cm') AND url = '/images/products/Demeyere Proline 7 - 28 cm/1.jpg'`,
  },
  {
    label: 'p52 dedupe cloud by url',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" = (SELECT id FROM "Product" WHERE slug = 'demeyere-proline-7-28cm') AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },
  {
    label: 'p53 dedupe by url',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-adamant-wok-32cm') AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },
  {
    label: 'p54 delete wrong-brand cloud',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'siemens-kochfeldreiniger-glaskeramik-induktion') AND url LIKE '%siemens-kochfeldreiniger-glaskeramik-induktion.jpg'`,
  },
  {
    label: 'p57 dedupe local',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" = (SELECT id FROM "Product" WHERE slug = 'lodge-logic-l10sk3-gusseisen-30cm') AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },
  {
    label: 'p58 dedupe local',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" = (SELECT id FROM "Product" WHERE slug = 'woll-concept-wok-1030nc-30cm') AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },
  {
    label: 'p54 pin hero first',
    sql: `UPDATE "ProductImage" SET "sortOrder" = -1 WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'siemens-kochfeldreiniger-glaskeramik-induktion') AND url = '/images/products/Siemens - Kochfeldreiniger (Original)/3.jpg'`,
  },
  {
    label: 'resequence sortOrder',
    sql: `WITH ranked AS (SELECT id, ROW_NUMBER() OVER (PARTITION BY "productId" ORDER BY "sortOrder" ASC, id ASC) - 1 AS rn FROM "ProductImage" WHERE "productId" IN (SELECT id FROM "Product" WHERE slug IN (${slugList}))) UPDATE "ProductImage" SET "sortOrder" = ranked.rn FROM ranked WHERE "ProductImage".id = ranked.id`,
  },
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
