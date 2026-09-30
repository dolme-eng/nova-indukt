import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY audit route (batch #140-148) — deleted right after use.
// Static statements only, no user input. Guarded by secret header.
export const dynamic = 'force-dynamic'

const KEY = 'e2a70b5d91c8463f07d5e2a91b7c046d38e1f5a92b7c04d6e1a9382f5c7b0d46'

const SLUGS = [
  'soehnle-digital-kuechen-thermometer',
  'wmf-perfect-plus-65l',
  'tfa-digoo-dual',
  'kuhn-rikon-duromatic-50l',
  'fissler-cenit-auflaufform-26x18cm',
  'stelton-emma-fondue-set',
  'fissler-cenit-auflaufform-33x23cm',
  'tefal-apicio-fondue-set',
  'wmf-profi-plus-backform-set',
]

const slugList = SLUGS.map((s) => `'${s}'`).join(',')

const FIX_STATEMENTS: { label: string; sql: string }[] = [
  // ---- generic URL dedupe across the batch (keeps oldest row) ----
  {
    label: 'dedupe by url (all products)',
    sql: `DELETE FROM "ProductImage" a USING "ProductImage" b WHERE a."productId" IN (SELECT id FROM "Product" WHERE slug IN (${slugList})) AND b."productId" = a."productId" AND a.url = b.url AND a.id > b.id`,
  },
  // ---- p140/p141/p142/p143: identical blueprint copies ----
  {
    label: 'p140/p141/p142/p143 delete blueprints',
    sql: `DELETE FROM "ProductImage" WHERE "productId" IN (SELECT id FROM "Product" WHERE slug IN ('soehnle-digital-kuechen-thermometer','wmf-perfect-plus-65l','tfa-digoo-dual','kuhn-rikon-duromatic-50l')) AND url NOT LIKE 'https%' AND url NOT LIKE '%/1.jpg'`,
  },
  // ---- p144: 2.jpg and 3.jpg are the same photo as 1.jpg at lower resolutions ----
  {
    label: 'p144 delete redundant resolutions',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-cenit-auflaufform-26x18cm') AND (url LIKE '%26x18 cm/2.jpg' OR url LIKE '%26x18 cm/3.jpg')`,
  },
  // ---- p145: 1.jpg is a shop-display snapshot with price tags ----
  {
    label: 'p145 delete shop snapshot',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'stelton-emma-fondue-set') AND url LIKE '%/1.jpg'`,
  },
  // ---- p146: cloud hero shows two frying pans; 2/3 duplicate 1.jpg ----
  {
    label: 'p146 delete frying-pan hero',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-cenit-auflaufform-33x23cm') AND url LIKE 'https%'`,
  },
  {
    label: 'p146 delete redundant resolutions',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'fissler-cenit-auflaufform-33x23cm') AND (url LIKE '%33x23 cm/2.jpg' OR url LIKE '%33x23 cm/3.jpg')`,
  },
  // ---- p148: 3.jpg is a Wuesthof box (wrong brand), cloud hero is whisk drawings ----
  {
    label: 'p148 delete Wuesthof + whisk drawings',
    sql: `DELETE FROM "ProductImage" WHERE "productId" = (SELECT id FROM "Product" WHERE slug = 'wmf-profi-plus-backform-set') AND (url LIKE 'https%' OR url LIKE '%/3.jpg')`,
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
