/**
 * Application des prix de marché validés.
 *
 *   npx tsx scripts/apply-prices.ts            # rapport, rien n'est écrit
 *   npx tsx scripts/apply-prices.ts --apply    # écrit les prix
 *
 * Règle : prix = plancher du marché − 5 à 10 %.
 *
 * Chaque ligne porte la source du relevé : sans elle, un prix n'est pas
 * traçable et ne doit pas être écrit. Un `oldPrice` n'est renseigné que si
 * l'ancien prix était supérieur au nouveau, pour qu'une réduction reste
 * visible comme telle.
 *
 * Idempotent : relancer sans `--apply` après coup ne doit rien proposer.
 */

import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const root = path.resolve(__dirname, '..')
for (const file of ['.env.local', '.env']) {
  loadEnv({ path: path.join(root, file) })
}

const prisma = new PrismaClient()

type Row = {
  slug: string
  ancien: number
  nouveau: number
  plancher: number
  source: string
  estimation?: boolean
}

const PRIX: Row[] = [
  {
    slug: 'fissler-intensa-topfset-5tlg',
    ancien: 299.0,
    nouveau: 326.0,
    plancher: 333.0,
    source:
      'testbericht Tiefstpreis 333,00 € · moebel.de 349,90 € · zurbrueggen 349,00 € · mex.de 349,00 € · idealo 398,90 €',
  },
  {
    slug: 'fissler-opc-schmortopf-28cm',
    ancien: 139.0,
    nouveau: 177.0,
    plancher: 179.99,
    source:
      'moebel.de ab 179,99 € (Amazon 185,99 € · koestner-shop 215,48 €) · variante 4,8 L EAN 4009209379999 confirmée fabricant',
  },
  {
    slug: 'fissler-vitavit-edition-80l',
    ancien: 139.99,
    nouveau: 235.0,
    plancher: 251.11,
    source: 'idealo Vitavit Premium 8 L : 251,11–353,65 €, 11 offres · fabricant 339,00 €',
  },
  {
    slug: 'fissler-vitavit-edition-65l',
    ancien: 119.99,
    nouveau: 189.0,
    plancher: 202.93,
    source:
      'testbericht Vitavit Premium 6 L : 202,93–334,42 €, 21 offres · heise 208,99 € · fabricant 309,00 €',
  },
  {
    slug: 'fissler-vitavit-edition-45l',
    ancien: 99.99,
    nouveau: 219.0,
    plancher: 229.0,
    source: 'ESTIMATION — interpolation entre 3,5 L (192,97 €) et 6 L (202,93 €) ; à confirmer',
    estimation: true,
  },
  {
    slug: 'fissler-opc-daempfeinsatz-28cm',
    ancien: 109.0,
    nouveau: 135.0,
    plancher: 139.9,
    source:
      'idealo Fissler Dämpfeinsatz OPC 28 cm : 139,90–181,50 €, 14 offres · fabricant 159,00 € EAN 4009209380407',
  },
  {
    slug: 'fissler-opc-daempfeinsatz-24cm',
    ancien: 95.0,
    nouveau: 92.0,
    plancher: 95.0,
    source:
      'idealo Fissler Dämpfeinsatz OPC 24 cm : 95,00–141,03 €, 13 offres · fabricant 129,00 € EAN 4009209380391 — nous étions à égalité avec le plancher, d’où 3 % sous',
  },
  {
    slug: 'fissler-opc-grillpfanne-28cm',
    ancien: 159.0,
    nouveau: 168.0,
    plancher: 173.36,
    source:
      'idealo, offre identifiée par le SKU fabricant 084 378 28 100/0 (= Stielpfanne mit Novogrill) : 173,36 € · même offre « novogrill Bratfläche » 180,44 € · 182,46 / 191,53 / 191,69 € · fabricant 169,00 € EAN 4009209380766',
  },
  {
    slug: 'fissler-vitavit-edition-30l',
    ancien: 89.99,
    nouveau: 179.0,
    plancher: 192.97,
    source: 'idealo Vitavit Premium 3,5 L : 192,97–279,72 €, 13 offres · fabricant 259,00 €',
  },
]

async function main() {
  const apply = process.argv.includes('--apply')
  const onlyEstimations = process.argv.includes('--skip-estimated')

  const produits = await prisma.product.findMany({
    where: { slug: { in: PRIX.map((p) => p.slug) } },
    select: { slug: true, nameDe: true, price: true, oldPrice: true, ean: true },
  })
  const by = new Map(produits.map((p) => [p.slug, p]))

  console.log(
    `\nApplication des prix — ${PRIX.length} lignes, mode ${apply ? 'ÉCRITURE' : 'lecture seule'}\n`
  )
  console.log('fiche                                        ancien    nouveau   plancher   écart')
  console.log('─'.repeat(88))

  let ecrit = 0
  let deja = 0
  const ignores: string[] = []

  for (const row of PRIX) {
    const p = by.get(row.slug)
    if (!p) {
      ignores.push(`${row.slug} — introuvable en base`)
      continue
    }
    if (row.estimation && onlyEstimations) {
      ignores.push(`${row.slug} — estimation, écartée par --skip-estimated`)
      continue
    }
    if (!row.source.trim()) {
      ignores.push(`${row.slug} — pas de source, prix non traçable`)
      continue
    }

    const actuel = Number(p.price)
    const ancienOld = p.oldPrice ? Number(p.oldPrice) : null
    const finalOld = (() => {
      if (row.nouveau < actuel) return actuel
      if (ancienOld !== null && ancienOld > row.nouveau) return ancienOld
      return null
    })()
    // Déjà à jour si le prix ET l'ancien prix sont conformes : sans cela le
    // script réécrit endlessly.
    if (Math.abs(actuel - row.nouveau) < 0.005) {
      const oldActuel = ancienOld
      if (
        (oldActuel === null) === (finalOld === null) &&
        (finalOld === null || Math.abs(oldActuel! - finalOld!) < 0.005)
      ) {
        deja++
        continue
      }
    }

    // oldPrice n'est affiché que s'il est SUPÉRIEUR au prix de vente. En
    // remontant un prix, l'ancien oldPrice (souvent le prix UVP, donc
    // inférieur) deviendrait inférieur au nouveau prix : la remise
    // s'afficherait à l'envers. On l'efface dans ce cas.
    const ancienOldPrice = p.oldPrice ? Number(p.oldPrice) : null
    const oldPrice = (() => {
      if (row.nouveau < actuel) return actuel
      if (ancienOldPrice !== null && ancienOldPrice > row.nouveau) return ancienOldPrice
      return null
    })()

    const ecart = ((row.nouveau - row.plancher) / row.plancher) * 100
    console.log(
      `${row.slug.slice(0, 42).padEnd(42)} ${actuel.toFixed(2).padStart(7)} ` +
        `${row.nouveau.toFixed(2).padStart(10)} ${row.plancher.toFixed(2).padStart(9)} ` +
        `${(ecart >= 0 ? '+' : '') + ecart.toFixed(1)} %${row.estimation ? '  ⚠' : ''}`
    )

    if (!apply) continue

    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { slug: row.slug },
        data: { price: row.nouveau, oldPrice },
      })
      await tx.auditLog.create({
        data: {
          entityType: 'Product',
          entityId: row.slug,
          action: 'PRIX_MARCHE',
          oldValues: { price: actuel.toString(), oldPrice: p.oldPrice?.toString() ?? null },
          newValues: {
            price: row.nouveau,
            oldPrice: oldPrice?.toString() ?? null,
            plancherMarche: row.plancher,
            decote: `${ecart.toFixed(1)} %`,
            source: row.source,
            estimation: row.estimation ?? false,
          },
        },
      })
    })
    ecrit++
  }

  console.log('─'.repeat(88))
  console.log(
    `\n${apply ? 'Écrit' : 'À écrire'} : ${ecrit}   déjà à jour : ${deja}   écartés : ${ignores.length}`
  )
  if (ignores.length) {
    console.log('')
    ignores.forEach((i) => console.log(`  ${i}`))
  }
  console.log('\n⚠ costPrice est vide sur tout le catalogue : la marge reste invérifiable.')
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
