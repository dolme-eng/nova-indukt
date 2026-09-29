import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY audit route (batch #122-130) — deleted right after use.
// Static statements only, no user input. Guarded by secret header.
export const dynamic = 'force-dynamic'

const KEY = '7a1e5c94b3d82f06a7c4e1b95d3806f2a7e5c13b9d0486f2a1c7e5b3d9f08a6c'

const SLUGS = [
  'roesle-silicone-kochloeffel',
  'roesle-silicone-kelle',
  'roesle-edelstahl-wender',
  'zwilling-now-s-kuechenzange',
  'zwilling-now-s-schaumkelle',
  'zwilling-now-s-kochloeffel',
  'zwilling-now-s-schneebesen',
  'wmf-profi-plus-siebloeffel',
  'fissler-pure-collection-kartoffelstoessel',
]

const slugList = SLUGS.map((s) => `'${s}'`).join(',')

const SOURCED: Record<string, { url: string; alt: string }> = {
  'wmf-profi-plus-grillzange': {
    url: 'https://res.cloudinary.com/sz2dzmem/image/upload/v1790705211/nova-indukt/products/wmf-profi-plus-grillzange.jpg',
    alt: 'WMF Profi Plus Grillzange – Edelstahl',
  },
  'zwilling-now-s-kochloeffel': {
    url: 'https://res.cloudinary.com/sz2dzmem/image/upload/v1790705214/nova-indukt/products/zwilling-now-s-kochloeffel.jpg',
    alt: 'Zwilling Now S Kochlöffel – Silikonskopf',
  },
  'wmf-profi-plus-siebloeffel': {
    url: 'https://res.cloudinary.com/sz2dzmem/image/upload/v1790705215/nova-indukt/products/wmf-profi-plus-siebloeffel.jpg',
    alt: 'WMF Profi Plus Sieblöffel – Drahtgeflecht',
  },
  'fissler-pure-collection-kartoffelstoessel': {
    url: 'https://res.cloudinary.com/sz2dzmem/image/upload/v1790705217/nova-indukt/products/fissler-pure-collection-kartoffelstoessel.jpg',
    alt: 'Kartoffelstößel – Edelstahl',
  },
}

const genId = `concat('c', substr(md5(random()::text || clock_timestamp()::text), 1, 24))`

const FIX_STATEMENTS: { label: string; sql: string }[] = [
  // ---- generic URL dedupe across the batch (keeps oldest row) ----
  {
    label: 'dedupe by url (all products)',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" IN (SELECT id FROM "Product" WHERE slug IN (${slugList})) AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },
  // ---- identical blueprint copies on every utensil product ----
  {
    label: 'delete all local rows (blueprints) for utensil products',
    sql: `DELETE FROM "ProductImage" WHERE "productId" IN (SELECT id FROM "Product" WHERE slug IN (${slugList})) AND url NOT LIKE 'https%'`,
  },
  // ---- p122 hero is a slotted silicone turner, not a cooking spoon: leave hero, flag only ----
  // ---- p127 hero was a knife; p113/p129 heroes were a potato twister; p130 hero was a cookware set ----
  ...Object.keys(SOURCED).map((slug) => ({
    label: `reset ${slug} to sourced image`,
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = '${slug}')`,
  })),
  ...Object.entries(SOURCED).map(([slug, v]) => ({
    label: `insert sourced image for ${slug}`,
    sql: `INSERT INTO "ProductImage" ("id", "productId", url, alt, "sortOrder", "isMain") SELECT ${genId}, id, '${v.url}', '${v.alt}', 0, true FROM "Product" WHERE slug = '${slug}'`,
  })),
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
