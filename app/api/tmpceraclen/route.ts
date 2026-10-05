import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY audit route (complete the Ceraclen copy fix) — deleted right after use.
export const dynamic = 'force-dynamic'

const KEY = '9a3e51c7d84b26f10e5379ac2b6d814f0739e2c5a86b1d47f0c93e5a72d6184b'

const FIXES: { label: string; sql: string }[] = [
  {
    label: 'ceraclen: rewrite descriptionDe (remove the "unangefochtene Testsieger" claim)',
    sql: `UPDATE "Product" SET "descriptionDe" = 'Ceraclen 3 in 1 ist ein Reiniger und Pfleger für Glaskeramik- und Induktionskochfelder sowie Edelstahloberflächen.

**Merkmale:**
- 3-in-1-Formel: reinigt gründlich, poliert sanft für Hochglanz und schützt die Oberfläche vor neuem Schmutz
- Enthält natürliche Polierperlen aus Aprikosenkernen
- Entfernt Alltagsfett, Fingerabdrücke und leichte Kalkflecken
- Nicht für die Reinigung des Backofens geeignet (Herstellerangabe)
- 200 ml (Hersteller: Reckitt Benckiser Deutschland GmbH)

Die Profi-Pflege für Ihr Induktionsfeld, damit es auch nach Jahren noch aussieht wie am ersten Tag!' WHERE slug = 'ceraclen-3in1-reiniger-pfleger'`,
  },
  {
    label: 'ceraclen: shortDescription without the award claim',
    sql: `UPDATE "Product" SET "shortDescription" = 'Reinigt, poliert und schützt Glaskeramik- und Induktionskochfelder' WHERE slug = 'ceraclen-3in1-reiniger-pfleger'`,
  },
  {
    label: 'ceraclen: badges without the award claim',
    sql: `UPDATE "Product" SET badges = ARRAY['3-in-1 Formel']::text[] WHERE slug = 'ceraclen-3in1-reiniger-pfleger'`,
  },
]

export async function POST(req: Request) {
  if (req.headers.get('x-audit-key') !== KEY) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  try {
    const before = await prisma.$queryRawUnsafe(
      `SELECT slug, "nameDe", price, dimensions, "shortDescription", badges, "descriptionDe", "metaTitle", "metaDescription" FROM "Product" WHERE slug = 'ceraclen-3in1-reiniger-pfleger'`,
    )
    const steps: { label: string; rowCount: number }[] = []
    for (const f of FIXES) {
      const rowCount = await prisma.$executeRawUnsafe(f.sql)
      steps.push({ label: f.label, rowCount })
    }
    const after = await prisma.$queryRawUnsafe(
      `SELECT slug, "nameDe", price, dimensions, "shortDescription", badges, "metaTitle", "metaDescription", ("descriptionDe" LIKE '%Testsieger%') AS stillClaims FROM "Product" WHERE slug = 'ceraclen-3in1-reiniger-pfleger'`,
    )
    return NextResponse.json({ before, steps, after })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'unknown' }, { status: 500 })
  }
}