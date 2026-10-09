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
    slug: 'wmf-diadem-plus-bratpfanne-28cm',
    plancher: 75.94,
    source:
      'testberichte.de, comparaison 75,94–89,90 € pour la WMF Diadem Plus Bratpfanne 28 cm ' +
      'en Cromargan, induction ; WhichOne confirme 84,56 € sur la même référence. ' +
      'Plancher 75,94 € (galaxus, livraison offerte).',
    url: 'https://www.testberichte.de/heim-garten/wmf-diadem-plus-bratpfanne-28-cm.html',
  },
  {
    slug: 'tefal-natural-on-induction-grillpfanne-26cm',
    plancher: 47.28,
    source:
      'moebel.de, référence fabricant G2801902 : 47,28 € (offre du mois d octobre 2026). ' +
      'La même fiche affiche 97,72 € sur un relevé de mars 2026 : on retient le relevé ' +
      'le plus récent, le plus bas. Gril 26 cm, antiadhésif Mineralia, induction.',
    url: 'https://www.moebel.de/p/7930733031ecfb23a28a376fadde18f3',
  },
  {
    slug: 'wmf-function-4-bratentopf-20cm',
    plancher: 104.99,
    source:
      'idealo, WMF Function4 Fleischtopf 20 cm, 3,9 l, avec couvercle, 109,00–160,00 €. ' +
      'Deutschlandcard, sur le même EAN 4000530605856 : 104,99 € avec livraison offerte. ' +
      'Référence fabricant identique à celle posée en base (Function 4 Kochtopf mit ' +
      'Deckel, 20 cm) : plancher 104,99 €.',
    url: 'https://www.deutschlandcard.de/preisvergleich/p/4000530605856-wmf-kochtopf-wmf-function-4-kochtopf-mit-deckel-20-cm-8900535527',
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
