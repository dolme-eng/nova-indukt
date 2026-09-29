import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY audit route (batch #113-121) — deleted right after use.
// Static statements only, no user input. Guarded by secret header.
export const dynamic = 'force-dynamic'

const KEY = 'd9f4c17b62e0a5384c7b1f6d95e203a7c4b8e15d93f0a276c5b1e8d430a7f2c'

const SLUGS = [
  'wmf-profi-plus-grillzange',
  'demeyere-industry-5-sauteuse-24cm',
  'fissler-pure-collection-kochloeffel',
  'demeyere-industry-5-sauteuse-28cm',
  'fissler-pure-collection-schoepfkelle',
  'fissler-pure-collection-saucenheber',
  'fissler-pure-collection-nudelkelle',
  'roesle-silicone-backpinsel',
  'roesle-silicone-spatula',
]

const slugList = SLUGS.map((s) => `'${s}'`).join(',')

const NEW_UTENSILS: Record<string, { url: string; alt: string }> = {
  'fissler-pure-collection-kochloeffel': {
    url: 'https://res.cloudinary.com/sz2dzmem/image/upload/v1790696382/nova-indukt/products/fissler-pure-collection-kochloeffel.jpg',
    alt: 'Fissler Pure Collection Kochlöffel – Edelstahl',
  },
  'fissler-pure-collection-schoepfkelle': {
    url: 'https://res.cloudinary.com/sz2dzmem/image/upload/v1790696385/nova-indukt/products/fissler-pure-collection-schoepfkelle.jpg',
    alt: 'Fissler Pure Collection Schöpfkelle – perforiert',
  },
  'fissler-pure-collection-saucenheber': {
    url: 'https://res.cloudinary.com/sz2dzmem/image/upload/v1790696389/nova-indukt/products/fissler-pure-collection-saucenheber.jpg',
    alt: 'Fissler Pure Collection Saucenheber – beim Anrichten',
  },
  'fissler-pure-collection-nudelkelle': {
    url: 'https://res.cloudinary.com/sz2dzmem/image/upload/v1790696394/nova-indukt/products/fissler-pure-collection-nudelkelle.jpg',
    alt: 'Fissler Pure Collection Nudelkelle – Spaghetti greifen',
  },
}

const genId = `concat('c', substr(md5(random()::text || clock_timestamp()::text), 1, 24))`

const FIX_STATEMENTS: { label: string; sql: string }[] = [
  // ---- generic URL dedupe across the batch (keeps oldest row) ----
  {
    label: 'dedupe by url (all products)',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" IN (SELECT id FROM "Product" WHERE slug IN (${slugList})) AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },
  // ---- p113: 2 blueprints + a 600px local; keep the 1200px hero only ----
  {
    label: 'p113 delete blueprints + low-res local',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'wmf-profi-plus-grillzange') AND (url NOT LIKE 'https%' AND url NOT LIKE '%/1.jpg')`,
  },
  {
    label: 'p113 delete 600px local',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'wmf-profi-plus-grillzange') AND url LIKE '%/1.jpg'`,
  },
  // ---- p114: cloud hero is a 2-handle casserole, not a sauteuse -> drop it ----
  {
    label: 'p114 delete wrong-type cloud hero',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'demeyere-industry-5-sauteuse-24cm') AND url LIKE 'https%'`,
  },
  // ---- p120/p121: 3 identical blueprint copies each ----
  {
    label: 'p120/p121 delete blueprint locals',
    sql: `DELETE FROM "ProductImage" WHERE "productId" IN (SELECT id FROM "Product" WHERE slug IN ('roesle-silicone-backpinsel','roesle-silicone-spatula')) AND url NOT LIKE 'https%'`,
  },
  // ---- p115/p117/p118/p119: heroes were cookware-set photos, locals were blueprints -> reset to sourced images ----
  {
    label: 'Fissler utensils reset (cookware-set heroes + blueprint locals)',
    sql: `DELETE FROM "ProductImage" WHERE "productId" IN (SELECT id FROM "Product" WHERE slug IN ('fissler-pure-collection-kochloeffel','fissler-pure-collection-schoepfkelle','fissler-pure-collection-saucenheber','fissler-pure-collection-nudelkelle'))`,
  },
  ...Object.entries(NEW_UTENSILS).map(([slug, v]) => ({
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
