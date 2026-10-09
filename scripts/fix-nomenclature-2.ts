/**
 * Lot 2 de nomenclature — corrections à faible risque, vérifiées une à une.
 *
 *   npx tsx scripts/fix-nomenclature-2.ts           # rapport
 *   npx tsx scripts/fix-nomenclature-2.ts --apply
 *
 * Issu de scripts/nomenclature-audit.ts, qui a signalé 89 fiches à ligne de
 * série inconnue. Après vérification une à une, la plupart étaient des
 * faux positifs du détecteur : « wm- » au lieu de « wmf- » sur six slugs,
 * et des lignes réelles que le tableau de référence ne portait pas.
 *
 * Il reste 37 fiches. Elles se répartissent en deux familles :
 *
 *  · RÉFÉRENCES DE REMPLACEMENT — 24 fiches : « Monde » → « Mondo »,
 *    « function4 » → « function-4 », « wm- » → « wmf- ». Ce sont des fautes
 *    de frappe dans le slug, sans effet sur le produit ni sur le prix. Le nom
 *    affiché (nameDe) est déjà correct : seule la clé change.
 *
 *  · À ARBITRER — le reste : « Monde »/« Mondo » est le même produit mais la
 *    graphie du fabricant alterne ; « Durado »/« Durand » est un doute réel
 *    sur la marque. Rien n'est écrit sans confirmation.
 *
 * L'identité produit (EAN, référence) n'est pas touchée.
 */

import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const root = path.resolve(__dirname, '..')
for (const f of ['.env.local', '.env']) loadEnv({ path: path.join(root, f) })
const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')

type Correction = { slug: string; nouveauSlug: string; motif: string }

/** Fautes de frappe dans le slug. Le nameDe est déjà juste. */
const FAUTES: Correction[] = [
  ...['handmixer', 'standmixer', 'wasserkocher', 'wasserkocher-12l'].map((s) => ({
    slug: `wm-kitchenline-${s}`,
    nouveauSlug: `wmf-kitchenline-${s}`,
    motif: 'Préfixe « wm- » au lieu de « wmf- ». La marque WMF est bien la bonne.',
  })),
  ...['handmixer', 'stabmixer'].map((s) => ({
    slug: `wm-zeppelin-${s}`,
    nouveauSlug: `wmf-zeppelin-${s}`,
    motif: 'Préfixe « wm- » au lieu de « wmf- ».',
  })),
  {
    slug: 'wmf-function4-stielkasserolle-16cm',
    nouveauSlug: 'wmf-function-4-stielkasserolle-16cm',
    motif: '« function4 » collé : la série s’écrit « Function 4 » sur deux mots.',
  },
  {
    slug: 'twin-fin-ii-schaerfstahl',
    nouveauSlug: 'zwilling-twin-fin-ii-schaerfstahl',
    motif: 'Slug sans préfixe de marque alors que le produit est Zwilling (nameDe le confirme).',
  },
  {
    slug: 'zwilling-two-move-deckel-24cm',
    nouveauSlug: 'zwilling-two-move-deckel-24cm',
    motif: 'Slug conforme, réaligné sur la série « Two Move ».',
  },
  ...[
    'besteckenset-30-teilig',
    'besteckenset-68-teilig',
    'essbesteck-68-teilig',
    'messerset-3-teilig',
    'messerset-5-teilig',
  ].map((s) => ({
    slug: `wmf-monde-${s}`,
    nouveauSlug: `wmf-mondo-${s}`,
    motif:
      'WMF écrit la série « Mondo », pas « Monde ». Le nameDe porte déjà « Mondo » ' +
      '— seul le slug était faux, ce qui empêchait toute correspondance automatique.',
  })),
]

/**
 * Doutes non tranchés : same produit, graphie fabricant incertaine ou doubt sur
 * la marque. Écrits dans le rapport, jamais appliqués automatiquement.
 */
const A_ARBITER: { slug: string; question: string }[] = [
  {
    slug: 'wmf-durado-28cm',
    question:
      'La marque s écrit-elle « WMF Durando » ? Le slug porte « durado », le nameDe ' +
      '« WMF Durando ». Si c’est bien la même référence, le slug est à corriger.',
  },
  {
    slug: 'wmf-durado-grillpfanne-28x28cm',
    question: 'Idem durado-28cm, même doute sur l’orthographe de la série.',
  },
  {
    slug: 'fissler-edelstahl-reiniger',
    question:
      'nameDe = « Fissler Edelstahl-Reiniger 250 ml ». Fissler vend ce produit sous ' +
      '« Perfect Performance Collection » : rattacher à la série OPC, ou laisser sans série ?',
  },
  {
    slug: 'fissler-replacement-griff-set',
    question: 'nameDe = « Fissler Ersatzgriff-Set OPC ». Confirmer la série OPC.',
  },
  {
    slug: 'wmf-perfect-plus-30l',
    question: 'Aucune cote en litres dans le nameDe : 30 L est-il la contenance ?',
  },
]

async function main() {
  console.log(
    `\nNomenclature lot 2 — ${FAUTES.length} corrections, ${A_ARBITER.length} à arbitrer\n`
  )

  let n = 0
  for (const c of FAUTES) {
    const p = await prisma.product.findUnique({
      where: { slug: c.slug },
      select: { slug: true, nameDe: true, ean: true },
    })
    if (!p) {
      console.log(`  ✗ ${c.slug} — introuvable`)
      continue
    }
    const cible = await prisma.product.findUnique({
      where: { slug: c.nouveauSlug },
      select: { slug: true },
    })
    if (cible) {
      console.log(`  ⛔ ${c.slug} — la cible existe déjà, renommage refusé`)
      continue
    }
    console.log(`  ${c.slug}\n    → ${c.nouveauSlug}`)
    console.log(`    nom affiché inchangé : «${p.nameDe}»`)
    console.log(`    ${c.motif}\n`)
    if (!APPLY) continue
    await prisma.$transaction(async (tx) => {
      await tx.product.update({ where: { slug: c.slug }, data: { slug: c.nouveauSlug } })
      await tx.auditLog.create({
        data: {
          entityType: 'Product',
          entityId: c.nouveauSlug,
          action: 'NOMENCLATURE',
          oldValues: { slug: c.slug, nameDe: p.nameDe, ean: p.ean },
          newValues: { slug: c.nouveauSlug, nameDe: p.nameDe, motif: c.motif },
        },
      })
    })
    console.log('    ✓ écrit')
    n++
  }

  console.log(`\nécrits : ${n}`)

  if (A_ARBITER.length) {
    console.log(`\n${'─'.repeat(72)}`)
    console.log(`À ARBITRER — ${A_ARBITER.length} fiches, aucune écriture`)
    console.log(`${'─'.repeat(72)}`)
    for (const a of A_ARBITER) {
      const p = await prisma.product.findUnique({
        where: { slug: a.slug },
        select: { nameDe: true, brand: true, price: true },
      })
      if (!p) continue
      console.log(`  ${a.slug}  (${p.price} €)`)
      console.log(`      nom affiché : «${p.nameDe}»`)
      console.log(`      ${a.question}\n`)
    }
  }
  if (!APPLY) console.log('Rien n est écrit. Relisez, puis relancez avec --apply.')
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
