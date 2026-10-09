/**
 * Prix Fissler — relevé de marché, règle « plancher − 3 % ».
 *
 *   npx tsx scripts/prices-fissler.ts           # rapport
 *   npx tsx scripts/prices-fissler.ts --apply   # écriture
 *
 * Chaque ligne porte sa source et son URL : un prix sans preuve traçable
 * n'entre pas en base. Releve du 2026-10-09.
 *
 * Le seuil − 3 % est appliqué au PLANCHER constaté, pas à la moyenne : on
 * reste battable en position deDuplex sans se brader.
 */

import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const root = path.resolve(__dirname, '..')
for (const f of ['.env.local', '.env']) loadEnv({ path: path.join(root, f) })
const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')
const MARGE = 0.03

type Ligne = {
  slug: string
  plancher: number
  source: string
  url: string
  /** En attente de décision : on n'écrit rien sans que le sens soit certain. */
  attente?: string
}

const LIGNES: Ligne[] = [
  {
    slug: 'fissler-adamant-wok-32cm',
    plancher: 125.89,
    source: 'Stylight (4 offres) — EAN 4009209382395, Adamant Wok 32 cm antihaft',
    url: 'https://www.stylight.de/Artikel/Fissler/Adamant-Aluminium-Wok-Servier-Pfanne-32cm-6l-c79d5d10/',
  },
  {
    slug: 'fissler-adamant-stielkasserolle-18cm',
    plancher: 70.35,
    source:
      'geizhals, variante « mit Metalldeckel 18cm » (156-154-18-000/0) — plancher 70,35 €. ' +
      'idealo 16 offres 59,90–107,31 € : le 59,90 € est la casserole SANS couvercle, écartée.',
    url: 'https://geizhals.de/fissler-adamant-stielkasserolle-v161235.html',
  },
  {
    slug: 'fissler-intensa-topfset-5teilig',
    plancher: 333.0,
    source: 'testbericht, Tiefstpreis 333,00 € / Ø 335 € — 3 offres',
    url: 'https://www.testbericht.de/produkte/fissler-intensa-topfset-5-tlg',
  },
  {
    slug: 'fissler-adamant-plus-bratpfanne-28cm',
    plancher: 77.5,
    source:
      'idealo : Adamant Comfort Bratpfanne 28 cm, 28 offres, 77,50–128,00 € ; Adamant ' +
      'Premium Bratpfanne 28 cm, 28 offres, 79,99–139,00 €. Notre nom de fiche « Adamant ' +
      'Plus » ne correspond exactement à aucune des deux lignes : on retient le plancher ' +
      'LE PLUS BAS des deux, pour rester sous le marché quelle que soit la ligne réelle.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/6342531_-adamant-comfort-bratpfanne-28-cm-fissler.html',
  },
  {
    slug: 'fissler-cenit-grillpfanne-28x28cm',
    plancher: 80.99,
    source:
      'idealo 8 offres, 80,99–107,90 € — Cenit Induktion Grillpfanne eckig 28 cm, ' +
      ' quadratique, antihaft, induction. Notre fiche était à 61,74 € : sous le marché de 19 €.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/200844279_-cenit-induktion-grillpfanne-eckig-28-cm-fissler.html',
  },
  {
    slug: 'fissler-original-profi-collection-topfset-5tlg',
    plancher: 459.0,
    source:
      'idealo 10 offres 459,00–704,00 € (084-388-05-000/0) ; testbericht offre courante la ' +
      'moins chère 459,00 €, Ø 468 €. On retient 459,00 € et non le Tiefstpreis historique ' +
      'de 427,09 € : un record de prix n’est pas une offre disponible.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/201782079_-original-profi-collection-topfset-5-teilig-084-388-05-000-0-fissler.html',
  },
]

/**
 * Doublons retirés du catalogue.
 *
 * `5tlg` et `5teilig` désignaient le même set (EAN 4009209309224). On garde
 * `5teilig` : le client lit un nombre, pas un code. Deux fiches pour un seul
 * article dégradent le catalogue et nous font nous concurrencer.
 */
const DESACTIVER: { slug: string; raison: string }[] = [
  {
    slug: 'fissler-intensa-topfset-5tlg',
    raison: 'doublon de fissler-intensa-topfset-5teilig (même EAN 4009209309224)',
  },
]

async function main() {
  console.log(`\nFissler — ${LIGNES.length} lignes (règle : plancher − ${MARGE * 100} %)\n`)
  const attend = LIGNES.filter((l) => l.attente)

  let n = 0
  for (const l of LIGNES) {
    const propose = Math.round(l.plancher * (1 - MARGE))
    const p = await prisma.product.findUnique({
      where: { slug: l.slug },
      select: { price: true, brand: true },
    })
    if (!p) {
      console.log(`  ✗ ${l.slug} — introuvable en base`)
      continue
    }
    const actuel = Number(p.price)
    const delta = ((propose - actuel) / actuel) * 100
    console.log(
      `  ${l.slug.padEnd(44)} ${actuel.toFixed(2).padStart(8)} → ${propose.toFixed(2).padStart(8)} ` +
        `(${delta >= 0 ? '+' : ''}${delta.toFixed(0)} %)  plancher ${l.plancher.toFixed(2)} €`
    )
    if (l.attente) {
      console.log(`      ⏸ EN ATTENTE — ${l.attente}\n`)
      continue
    }
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
    console.log(`      ✓ écrit (plancher ${l.plancher.toFixed(2)} € − ${l.source})`)
    n++
  }

  console.log(`\nécrits : ${n}   en attente de décision : ${attend.length}`)

  let desact = 0
  for (const d of DESACTIVER) {
    const p = await prisma.product.findUnique({
      where: { slug: d.slug },
      select: { isActive: true },
    })
    if (!p) {
      console.log(`  ✗ ${d.slug} — introuvable`)
      continue
    }
    if (!p.isActive) continue
    if (!APPLY) {
      console.log(`  ⏸ ${d.slug} — à désactiver (${d.raison})`)
      continue
    }
    await prisma.$transaction(async (tx) => {
      await tx.product.update({ where: { slug: d.slug }, data: { isActive: false } })
      await tx.auditLog.create({
        data: {
          entityType: 'Product',
          entityId: d.slug,
          action: 'DESACTIVE_DOUBLON',
          oldValues: { isActive: 'true' },
          newValues: { isActive: 'false', raison: d.raison },
        },
      })
    })
    console.log(`  ✓ désactivé ${d.slug} — ${d.raison}`)
    desact++
  }
  console.log(`désactivés : ${desact}`)
  if (!APPLY && n === 0 && desact === 0) console.log('Relisez, puis relancez avec --apply.')
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
