import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY audit route (batch #149-157) — deleted right after use.
// Static statements only, no user input. Guarded by secret header.
export const dynamic = 'force-dynamic'

const KEY = '6c1f94a83b7e05d24c8f1a937b6e04d57a2c8f31e6b04d97a1c5f8e3b2d70a6c'

const SLUGS = [
  'fissler-opc-deckel-20cm',
  'tefal-preference-raclette-pfanne',
  'wmf-professional-s-plus-kastenform',
  'bugatti-fondue-set-15l',
  'wmf-professional-s-plus-tarte-form',
  'fissler-opc-deckel-24cm',
  'zwilling-fondue-set-20l',
  'fissler-opc-deckel-28cm',
  'stash-cocotte-oval-31x21cm',
]

const slugList = SLUGS.map((s) => `'${s}'`).join(',')

const FIX_STATEMENTS: { label: string; sql: string }[] = [
  // ---- generic URL dedupe across the batch (keeps oldest row) ----
  {
    label: 'dedupe by url (all products)',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" IN (SELECT id FROM "Product" WHERE slug IN (${slugList})) AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },
  // ---- p149/p154/p156: 2.jpg and 3.jpg are identical blueprints ----
  {
    label: 'p149/p154/p156 delete blueprints',
    sql: `DELETE FROM "ProductImage" WHERE "productId" IN (SELECT id FROM "Product" WHERE slug IN ('fissler-opc-deckel-20cm','fissler-opc-deckel-24cm','fissler-opc-deckel-28cm')) AND (url LIKE '%/2.jpg' OR url LIKE '%/3.jpg')`,
  },
  // ---- p151: 3.jpg is a Wuesthof-branded tin, cloud hero is a raclette appliance ----
  {
    label: 'p151 delete Wuesthof tin + raclette hero',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'wmf-professional-s-plus-kastenform') AND (url LIKE 'https%' OR url LIKE '%/3.jpg')`,
  },
  // ---- p152: local is a Tefal fondue pot, cloud is a shop-shelf snapshot -> no valid image, needs supplier photo ----
  {
    label: 'p152 delete Tefal + shop snapshot',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'bugatti-fondue-set-15l')`,
  },
  // ---- p153: cloud hero is a frying pan, not a tart tin ----
  {
    label: 'p153 delete frying-pan hero',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'wmf-professional-s-plus-tarte-form') AND url LIKE 'https%'`,
  },
  // ---- p155: cloud hero is a cast-iron caquelon, not a Zwilling set ----
  {
    label: 'p155 delete caquelon hero',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'zwilling-fondue-set-20l') AND url LIKE 'https%'`,
  },
  // ---- p157: local is a ROUND cocotte, product is the OVAL one ----
  {
    label: 'p157 delete round cocotte',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'stash-cocotte-oval-31x21cm') AND url NOT LIKE 'https%'`,
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
