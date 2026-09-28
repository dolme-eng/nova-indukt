import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY audit route (batch #77-85) — deleted right after use.
// Static statements only, no user input. Guarded by secret header.
export const dynamic = 'force-dynamic'

const KEY = 'e2b7f95c1d83a6407c5e2b9d4f8a13605c7e2b4d9f1a6830c5e7b2d4f9a1368c'

const SLUGS = [
  'wmf-comfort-line-stielkasserolle-16cm',
  'petromax-brater-ft6-28cm',
  'wmf-compact-cuisine-dampfgareinsatz-24cm',
  'wmf-diadem-plus-stielkasserolle-16cm',
  'wmf-performance-grillpfanne-28cm',
  'chasseur-cocotte-ronde-24cm',
  'fissler-opc-daempfeinsatz-28cm',
  'petromax-brater-ft9-32cm',
  'demeyere-essential-5-stielkasserolle-18cm',
]

const slugList = SLUGS.map((s) => `'${s}'`).join(',')

const NEW_WMF_GRILL =
  'https://res.cloudinary.com/sz2dzmem/image/upload/v1790592945/nova-indukt/products/wmf-performance-grillpfanne-28cm.jpg'
const NEW_FISSLER_INSERT =
  'https://res.cloudinary.com/sz2dzmem/image/upload/v1790592947/nova-indukt/products/fissler-opc-daempfeinsatz-28cm.jpg'

const genId = `concat('c', substr(md5(random()::text || clock_timestamp()::text), 1, 24))`

const FIX_STATEMENTS: { label: string; sql: string }[] = [
  // ---- generic URL dedupe across the batch (keeps oldest row) ----
  {
    label: 'dedupe by url (all products)',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" IN (SELECT id FROM "Product" WHERE slug IN (${slugList})) AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },
  // ---- identical technical-drawing images (blueprints), 2 or 3 copies each ----
  {
    label: 'p77/p80 delete blueprints',
    sql: `DELETE FROM "ProductImage" WHERE "productId" IN (SELECT id FROM "Product" WHERE slug IN ('wmf-comfort-line-stielkasserolle-16cm','wmf-diadem-plus-stielkasserolle-16cm')) AND (url LIKE '%Stielkasserolle 16 cm/2.jpg' OR url LIKE '%Stielkasserolle 16 cm/3.jpg')`,
  },
  {
    label: 'p78/p84 delete blueprints',
    sql: `DELETE FROM "ProductImage" WHERE "productId" IN (SELECT id FROM "Product" WHERE slug IN ('petromax-brater-ft6-28cm','petromax-brater-ft9-32cm')) AND (url LIKE '%ter ft6 - Br%ter 28 cm/2.jpg' OR url LIKE '%ter ft6 - Br%ter 28 cm/3.jpg' OR url LIKE '%ter ft9 - Br%ter 32 cm/2.jpg' OR url LIKE '%ter ft9 - Br%ter 32 cm/3.jpg')`,
  },
  {
    label: 'p79 delete blueprint locals',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'wmf-compact-cuisine-dampfgareinsatz-24cm') AND url NOT LIKE 'https%'`,
  },
  {
    label: 'p82 delete blueprints',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'chasseur-cocotte-ronde-24cm') AND (url LIKE '%Cocotte 24 cm/2.jpg' OR url LIKE '%Cocotte 24 cm/3.jpg')`,
  },
  {
    label: 'p85 delete blueprints + wrong 2-handle variant',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'demeyere-essential-5-stielkasserolle-18cm') AND url NOT LIKE 'https%'`,
  },
  // ---- p81: hero was a round non-ridged pan, local was a square pan; replaced by sourced 2560px grill pan ----
  {
    label: 'p81 reset to sourced grill pan',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'wmf-performance-grillpfanne-28cm')`,
  },
  {
    label: 'p81 insert sourced grill pan',
    sql: `INSERT INTO "ProductImage" ("id", "productId", url, alt, "sortOrder", "isMain") SELECT ${genId}, id, '${NEW_WMF_GRILL}', 'WMF Performance Grillpfanne 28 cm – gerillte Oberfläche', 0, true FROM "Product" WHERE slug = 'wmf-performance-grillpfanne-28cm'`,
  },
  // ---- p83: hero was a stacked pot set; replaced by the real Fissler steaming insert ----
  {
    label: 'p83 reset to sourced insert',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-opc-daempfeinsatz-28cm')`,
  },
  {
    label: 'p83 insert sourced insert',
    sql: `INSERT INTO "ProductImage" ("id", "productId", url, alt, "sortOrder", "isMain") SELECT ${genId}, id, '${NEW_FISSLER_INSERT}', 'Fissler Dämpfeinsatz 28 cm – Edelstahl', 0, true FROM "Product" WHERE slug = 'fissler-opc-daempfeinsatz-28cm'`,
  },
  // ---- hero pinning for the products that keep several images ----
  {
    label: 'pin hero p77/p80 (cloud)',
    sql: `UPDATE "ProductImage" SET "sortOrder" = -1 WHERE "productId" IN (SELECT id FROM "Product" WHERE slug IN ('wmf-comfort-line-stielkasserolle-16cm','wmf-diadem-plus-stielkasserolle-16cm')) AND url LIKE 'https%'`,
  },
  {
    label: 'pin hero p78/p84 (cloud)',
    sql: `UPDATE "ProductImage" SET "sortOrder" = -1 WHERE "productId" IN (SELECT id FROM "Product" WHERE slug IN ('petromax-brater-ft6-28cm','petromax-brater-ft9-32cm')) AND url LIKE 'https%'`,
  },
  {
    label: 'pin hero p82 (cloud)',
    sql: `UPDATE "ProductImage" SET "sortOrder" = -1 WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'chasseur-cocotte-ronde-24cm') AND url LIKE 'https%'`,
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
