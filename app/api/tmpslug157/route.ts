import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY audit route (slug fix #157) — deleted right after use.
// Static statements only, no user input. Guarded by secret header.
export const dynamic = 'force-dynamic'

const KEY = '9d3e07b4c15f8a26d47e0b93f6c2ad5810b7e43f95c8d26a1b40e7fd38c5921'

const OLD_SLUG = 'stash-cocotte-oval-31x21cm'
const NEW_SLUG = 'staub-cocotte-oval-31x21cm'

const FIX_STATEMENTS: { label: string; sql: string }[] = [
  {
    label: 'update slug typo stash- -> staub-',
    sql: `UPDATE "Product" SET slug = '${NEW_SLUG}' WHERE slug = '${OLD_SLUG}'`,
  },
]

export async function POST(req: Request) {
  if (req.headers.get('x-audit-key') !== KEY) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  try {
    const backup = await prisma.$queryRawUnsafe(
      `SELECT p.slug, p.id, p."nameDe", p.brand, p."supplierSku", pi.id AS imageId, pi.url, pi.alt, pi."sortOrder", pi."isMain" FROM "Product" p LEFT JOIN "ProductImage" pi ON pi."productId" = p.id WHERE p.slug IN ('${OLD_SLUG}','${NEW_SLUG}') ORDER BY p.slug, pi."sortOrder" ASC, pi.id ASC`,
    )
    const steps: { label: string; rowCount: number }[] = []
    for (const st of FIX_STATEMENTS) {
      const rowCount = await prisma.$executeRawUnsafe(st.sql)
      steps.push({ label: st.label, rowCount })
    }
    const verification = await prisma.$queryRawUnsafe(
      `SELECT p.slug, p.id, p."nameDe", COUNT(pi.id)::int AS rows, COUNT(DISTINCT pi.url)::int AS uniq, SUM(CASE WHEN pi."isMain" THEN 1 ELSE 0 END)::int AS mains FROM "Product" p LEFT JOIN "ProductImage" pi ON pi."productId" = p.id WHERE p.slug IN ('${OLD_SLUG}','${NEW_SLUG}') GROUP BY p.slug, p.id, p."nameDe" ORDER BY p.slug`,
    )
    return NextResponse.json({ backup, steps, verification })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'unknown' },
      { status: 500 },
    )
  }
}
