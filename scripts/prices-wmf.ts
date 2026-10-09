/**
 * Prix WMF — règle « plancher − 3 % ».
 *
 *   npx tsx scripts/prices-wmf.ts           # rapport
 *   npx tsx scripts/prices-wmf.ts --apply   # écriture
 *
 * Même méthode que pour Zwilling : relevé explicite, source et URL conservées.
 * WMF est bien indexé par idealo et geizhals, contrairement aux accessoires
 * Fissler. Relevé du 2026-10-09.
 */

import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const root = path.resolve(__dirname, '..')
for (const f of ['.env.local', '.env']) loadEnv({ path: path.join(root, f) })
const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')
const MARGE = 0.03

type Ligne = { slug: string; plancher: number; source: string; url: string }

const LIGNES: Ligne[] = [
  {
    slug: 'wmf-function-4-bratentopf-24cm',
    plancher: 109.99,
    source:
      'idealo 3 offres, 109,99 € — WMF Function 4 Advanced Kochtopf mit Deckel 24 cm, ' +
      '4,1 l, Glasdeckel, Cromargan. kulinagroup propose le Function 4 simple (EAN ' +
      '4000530605832) à 128 €. On retient le plancher le plus BAS (109,99 €) : le prix ' +
      'reste sous les deux versions. Notre fiche était à 69,99 € pour un inox 24 cm ' +
      'avec couvercle — très en dessous du marché.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/205047219_-function-4-advanced-kochtopf-mit-deckel-24-cm-4-1l-wmf.html',
  },
]

async function main() {
  console.log(`\nWMF — ${LIGNES.length} lignes (plancher − ${MARGE * 100} %)\n`)
  let n = 0
  for (const l of LIGNES) {
    const propose = Math.round(l.plancher * (1 - MARGE))
    const p = await prisma.product.findUnique({ where: { slug: l.slug }, select: { price: true } })
    if (!p) {
      console.log(`  ✗ ${l.slug} — introuvable`)
      continue
    }
    const actuel = Number(p.price)
    const delta = ((propose - actuel) / actuel) * 100
    console.log(
      `  ${l.slug.padEnd(44)} ${actuel.toFixed(2).padStart(8)} → ${propose.toFixed(2).padStart(8)} ` +
        `(${delta >= 0 ? '+' : ''}${delta.toFixed(0)} %)  plancher ${l.plancher.toFixed(2)} €`
    )
    if (Math.abs(actuel - propose) < 0.01) {
      console.log('      = déjà conforme')
      continue
    }
    if (!APPLY) {
      console.log('      → à écrire au --apply')
      continue
    }
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { slug: l.slug },
        data: { price: propose, ...(propose < actuel ? { oldPrice: actuel } : {}) },
      })
      await tx.auditLog.create({
        data: {
          entityType: 'Product',
          entityId: l.slug,
          action: 'PRIX_MARCHE',
          oldValues: { price: actuel.toString() },
          newValues: { price: propose, plancherMarche: l.plancher, source: l.source, url: l.url },
        },
      })
    })
    console.log('      ✓ écrit')
    n++
  }
  console.log(`\nécrits : ${n}`)
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
