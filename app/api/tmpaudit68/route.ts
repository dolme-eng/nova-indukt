import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY audit route (batch #68-76) — deleted right after use.
// Static statements only, no user input. Guarded by secret header.
export const dynamic = 'force-dynamic'

const KEY = 'a7e2d94b6c1f8035d47e9b2c6a05f83d1e4b7c90a2f5d8361b4e7c0a9d2f5b38'

const SLUGS = [
  'le-creuset-signature-braeter-rund-26cm',
  'fissler-adamant-stielkasserolle-18cm',
  'tefal-natural-on-induction-grillpfanne-26cm',
  'fissler-opc-daempfeinsatz-24cm',
  'wmf-function4-stielkasserolle-16cm',
  'zwilling-summit-plus-grillpfanne-28cm',
  'le-creuset-signature-braeter-rund-28cm',
  'zwilling-plus-daempfeinsatz-24cm',
  'fissler-opc-grillpfanne-28cm',
]

const slugList = SLUGS.map((s) => `'${s}'`).join(',')

const NEW_FISSLER =
  'https://res.cloudinary.com/sz2dzmem/image/upload/v1790559390/nova-indukt/products/fissler-opc-grillpfanne-28cm.jpg'
const NEW_ZWILLING =
  'https://res.cloudinary.com/sz2dzmem/image/upload/v1790559401/nova-indukt/products/zwilling-summit-plus-grillpfanne-28cm.jpg'

const FIX_STATEMENTS: { label: string; sql: string }[] = [
  // ---- generic URL dedupe for every product in the batch (keeps oldest row) ----
  {
    label: 'dedupe by url (all products)',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" IN (SELECT id FROM "Product" WHERE slug IN (${slugList})) AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },
  // ---- p68 Le Creuset 26: drop the 2 identical blueprint images ----
  {
    label: 'p68 delete blueprints',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'le-creuset-signature-braeter-rund-26cm') AND (url LIKE '%rund 26 cm/2.jpg' OR url LIKE '%rund 26 cm/3.jpg')`,
  },
  // ---- p69 Fissler Adamant: drop the 2 identical blueprint images ----
  {
    label: 'p69 delete blueprints',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-adamant-stielkasserolle-18cm') AND (url LIKE '%Stielkasserolle 18 cm/2.jpg' OR url LIKE '%Stielkasserolle 18 cm/3.jpg')`,
  },
  // ---- p70 Tefal: cloud hero is a plain frying pan (no grill ridges) -> drop it, keep local 1.jpg ----
  {
    label: 'p70 delete non-grill cloud hero',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'tefal-natural-on-induction-grillpfanne-26cm') AND url LIKE '%tefal-natural-on-induction-grillpfanne-26cm%'`,
  },
  // ---- p71 Fissler Daempfeinsatz 24: 3 identical blueprints -> drop all locals ----
  {
    label: 'p71 delete blueprint locals',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-opc-daempfeinsatz-24cm') AND url NOT LIKE 'https%'`,
  },
  // ---- p72 WMF Function 4: drop the 2 identical blueprint images ----
  {
    label: 'p72 delete blueprints',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'wmf-function4-stielkasserolle-16cm') AND (url LIKE '%Stielkasserolle 16 cm/2.jpg' OR url LIKE '%Stielkasserolle 16 cm/3.jpg')`,
  },
  // ---- p73 Zwilling Summit+: all images were 280px/640px -> replace with new high-res ----
  {
    label: 'p73 reset to new high-res image',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'zwilling-summit-plus-grillpfanne-28cm')`,
  },
  {
    label: 'p73 insert new high-res image',
    sql: `INSERT INTO "ProductImage" ("productId", url, alt, "sortOrder", "isMain") SELECT id, '${NEW_ZWILLING}', 'Zwilling Summit+ Grillpfanne 28 cm – am Herd', 0, true FROM "Product" WHERE slug = 'zwilling-summit-plus-grillpfanne-28cm'`,
  },
  // ---- p74 Le Creuset 28: drop the 2 identical blueprint images ----
  {
    label: 'p74 delete blueprints',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'le-creuset-signature-braeter-rund-28cm') AND (url LIKE '%rund 28 cm/2.jpg' OR url LIKE '%rund 28 cm/3.jpg')`,
  },
  // ---- p75 Zwilling Daempfeinsatz: 3 identical blueprints -> drop all locals ----
  {
    label: 'p75 delete blueprint locals',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'zwilling-plus-daempfeinsatz-24cm') AND url NOT LIKE 'https%'`,
  },
  // ---- p76 Fissler Grillpfanne: ALL 4 images were wrong (perforated steam inserts, saute pan, generic lifestyle) -> reset to sourced image ----
  {
    label: 'p76 reset to sourced Fissler grill pan',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-opc-grillpfanne-28cm')`,
  },
  {
    label: 'p76 insert sourced image',
    sql: `INSERT INTO "ProductImage" ("productId", url, alt, "sortOrder", "isMain") SELECT id, '${NEW_FISSLER}', 'Fissler Grillpfanne 28 cm – gerillte Oberfläche', 0, true FROM "Product" WHERE slug = 'fissler-opc-grillpfanne-28cm'`,
  },
  // ---- hero pinning ----
  {
    label: 'pin hero p68',
    sql: `UPDATE "ProductImage" SET "sortOrder" = -1 WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'le-creuset-signature-braeter-rund-26cm') AND url LIKE '%le-creuset-signature-braeter-rund-26cm%'`,
  },
  {
    label: 'pin hero p69',
    sql: `UPDATE "ProductImage" SET "sortOrder" = -1 WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-adamant-stielkasserolle-18cm') AND url LIKE '%fissler-adamant-stielkasserolle-18cm%'`,
  },
  {
    label: 'pin hero p72',
    sql: `UPDATE "ProductImage" SET "sortOrder" = -1 WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'wmf-function4-stielkasserolle-16cm') AND url LIKE '%wmf-function4-stielkasserolle-16cm%'`,
  },
  {
    label: 'pin hero p74',
    sql: `UPDATE "ProductImage" SET "sortOrder" = -1 WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'le-creuset-signature-braeter-rund-28cm') AND url LIKE '%le-creuset-signature-braeter-rund-28cm%'`,
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
