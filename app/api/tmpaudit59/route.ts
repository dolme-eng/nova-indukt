import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY audit route (batch #59-67) — deleted right after use.
// Static statements only, no user input. Guarded by secret header.
export const dynamic = 'force-dynamic'

const KEY = 'd4b8e1f7a3c95e206b7d4a8f1c6e23907b5d8a2c4f7e1b6d9a3c5e8f2b7d0a4c'

const SLUGS = [
  'fissler-intensa-topfset-5teilig',
  'waermeverteiler-platte-simmerring-induktionsherd',
  'staub-cocotte-ronde-24cm',
  'fissler-opc-stielkasserolle-16cm-metalldeckel',
  'fissler-cenit-grillpfanne-28x28cm',
  'fissler-opc-daempfeinsatz-20cm',
  'wmf-durado-grillpfanne-28x28cm',
  'fissler-opc-stielkasserolle-18cm',
  'staub-cocotte-ronde-28cm',
]

const slugList = SLUGS.map((s) => `'${s}'`).join(',')

const FIX_STATEMENTS: { label: string; sql: string }[] = [
  // p59: the 4 local images are Tefal pans (wrong brand) -> drop every local row
  {
    label: 'p59 delete Tefal locals',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-intensa-topfset-5teilig') AND url NOT LIKE 'https%'`,
  },
  // p61: remove the two identical blueprint/technical-drawing images
  {
    label: 'p59 dedupe cloud',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-intensa-topfset-5teilig') AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },
  {
    label: 'p61 delete blueprints',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'staub-cocotte-ronde-24cm') AND (url LIKE '%Cocotte 24 cm/2.jpg' OR url LIKE '%Cocotte 24 cm/3.jpg')`,
  },
  // p62: cloud hero is a 2-handle casserole, not a Stielkasserolle -> drop all cloud rows
  {
    label: 'p62 delete wrong-type cloud hero',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-opc-stielkasserolle-16cm-metalldeckel') AND url LIKE '%stielkasserolle-16cm-metalldeckel%'`,
  },
  {
    label: 'p62 delete blueprints',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-opc-stielkasserolle-16cm-metalldeckel') AND (url LIKE '%Stielkasserolle 16 cm/2.jpg' OR url LIKE '%Stielkasserolle 16 cm/3.jpg')`,
  },
  // p63: cloud duplicated 5x
  {
    label: 'p63 dedupe by url',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-cenit-grillpfanne-28x28cm') AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },
  // p64: 3 identical blueprints, no real photo -> drop every local row
  {
    label: 'p64 delete blueprint locals',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-opc-daempfeinsatz-20cm') AND url NOT LIKE 'https%'`,
  },
  {
    label: 'p64 dedupe cloud',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-opc-daempfeinsatz-20cm') AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },
  // p65: cloud hero is a ROUND grill pan, product is 28x28 cm SQUARE -> drop cloud
  {
    label: 'p65 delete round-shaped cloud hero',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'wmf-durado-grillpfanne-28x28cm') AND url LIKE '%wmf-durado-grillpfanne%'`,
  },
  // p66: cloud duplicated 4x + 2 blueprints
  {
    label: 'p66 dedupe by url',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-opc-stielkasserolle-18cm') AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },
  {
    label: 'p66 delete blueprints',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-opc-stielkasserolle-18cm') AND (url LIKE '%Stielkasserolle 18 cm/2.jpg' OR url LIKE '%Stielkasserolle 18 cm/3.jpg')`,
  },
  // p67: 2 identical blueprints
  {
    label: 'p67 delete blueprints',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'staub-cocotte-ronde-28cm') AND (url LIKE '%Cocotte 28 cm/2.jpg' OR url LIKE '%Cocotte 28 cm/3.jpg')`,
  },
  // ---- hero pinning (sortOrder -1 => first after resequence) ----
  {
    label: 'pin hero p60',
    sql: `UPDATE "ProductImage" SET "sortOrder" = -1 WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'waermeverteiler-platte-simmerring-induktionsherd') AND url LIKE '%waermeverteiler-platte-simmerring%'`,
  },
  {
    label: 'pin hero p61',
    sql: `UPDATE "ProductImage" SET "sortOrder" = -1 WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'staub-cocotte-ronde-24cm') AND url LIKE '%staub-cocotte-ronde-24cm%'`,
  },
  {
    label: 'pin hero p62 (local 1.jpg)',
    sql: `UPDATE "ProductImage" SET "sortOrder" = -1 WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-opc-stielkasserolle-16cm-metalldeckel') AND url LIKE '%Stielkasserolle 16 cm/1.jpg'`,
  },
  {
    label: 'pin hero p63',
    sql: `UPDATE "ProductImage" SET "sortOrder" = -1 WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-cenit-grillpfanne-28x28cm') AND url LIKE '%fissler-cenit-grillpfanne%'`,
  },
  {
    label: 'pin hero p65 (local 1.jpg)',
    sql: `UPDATE "ProductImage" SET "sortOrder" = -1 WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'wmf-durado-grillpfanne-28x28cm') AND url LIKE '%Grillpfanne 28x28 cm/1.jpg'`,
  },
  {
    label: 'pin hero p66',
    sql: `UPDATE "ProductImage" SET "sortOrder" = -1 WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-opc-stielkasserolle-18cm') AND url LIKE '%stielkasserolle-18cm.jpg'`,
  },
  {
    label: 'pin hero p67',
    sql: `UPDATE "ProductImage" SET "sortOrder" = -1 WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'staub-cocotte-ronde-28cm') AND url LIKE '%staub-cocotte-ronde-28cm%'`,
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
      `SELECT p.slug, COUNT(*)::int AS rows, COUNT(DISTINCT pi.url)::int AS uniq, SUM(CASE WHEN pi."isMain" THEN 1 ELSE 0 END)::int AS mains, MIN(pi."sortOrder")::int AS minSort FROM "ProductImage" pi JOIN "Product" p ON p.id = pi."productId" WHERE p.slug IN (${slugList}) GROUP BY p.slug ORDER BY p.slug`,
    )
    return NextResponse.json({ backup, steps, verification })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'unknown' },
      { status: 500 },
    )
  }
}
