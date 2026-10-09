/**
 * Chantier nomenclature — aligne nos libellés sur les dénominations marché.
 *
 *   npx tsx scripts/fix-nomenclature.ts           # rapport
 *   npx tsx scripts/fix-nomenclature.ts --apply   # écriture (slug + nameDe/nameFr)
 *
 * Trois défauts constatés en relevant les prix :
 *
 *  1. « Adamant Plus » n'existe pas. Fissler vend deux lignes distinctes,
 *     Adamant Comfort et Adamant Premium. Tant que le nom ne dit pas laquelle,
 *     aucun relevé automatique ne peut trancher : il faut savoir si le plancher
 *     du marché est à 77,50 € ou à 79,99 €.
 *
 *  2. « fondue-set-20l » se lit 20 litres. Le produit réel est un caquelon de
 *     Ø 20 cm / 1,8 L. Le suffixe est une abbreviation fautive, pas une unité.
 *
 *  3. « sauteuse » et « bratpfanne » ne sont pas le même produit. Une sauteuse
 *     a un couvercle et un corps plus haut : l'écart de prix atteint 30-40 €.
 *
 * Règle : on renomme le texte, jamais le produit. Le slug change, l'identity
 * produit (EAN, référence) ne bouge pas. Chaque renommage est tracé en
 * AuditLog pour qu'une URL ancienne reste traçable.
 */

import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const root = path.resolve(__dirname, '..')
for (const f of ['.env.local', '.env']) loadEnv({ path: path.join(root, f) })
const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')

type Correction = {
  slug: string
  nouveauSlug?: string
  nouveauNameDe?: string
  motif: string
}

const CORRECTIONS: Correction[] = [
  // 1. Ligne inexistante « Adamant Plus ».
  //    Notre prix de 75 € a été calé sur le plancher le plus bas des deux lignes
  //    réelles (Comfort 77,50 / Premium 79,99) pour rester sous les deux. Sans
  //    cette distinction, on ne peut pas serrer le prix.
  {
    slug: 'fissler-adamant-plus-bratpfanne-24cm',
    nouveauSlug: 'fissler-adamant-comfort-bratpfanne-24cm',
    nouveauNameDe: 'Fissler Adamant Comfort Bratpfanne 24 cm',
    motif:
      '« Adamant Plus » n est pas une ligne Fissler. Retenu : Comfort, dont le ' +
      'plancher (77,50 €, 28 offres) est le plus bas des deux lignes existantes — ' +
      'notre prix de 75 € reste donc sous le marché des deux.',
  },
  {
    slug: 'fissler-adamant-plus-bratpfanne-28cm',
    nouveauSlug: 'fissler-adamant-comfort-bratpfanne-28cm',
    nouveauNameDe: 'Fissler Adamant Comfort Bratpfanne 28 cm',
    motif: 'Ligne inexistante « Adamant Plus » → Comfort (plancher 77,50 €, 28 offres).',
  },
  {
    slug: 'fissler-adamant-plus-sauteuse-24cm',
    nouveauSlug: 'fissler-adamant-comfort-sauteuse-24cm',
    nouveauNameDe: 'Fissler Adamant Comfort Sautépfanne 24 cm',
    motif:
      'Ligne inexistante corrigée, « sauteuse » conservé : Sautépfanne est un produit ' +
      'distinct de Bratpfanne. Ne pas fusionner avec la 24 cm — deux fiches, deux produits.',
  },
  {
    slug: 'fissler-adamant-plus-sauteuse-28cm',
    nouveauSlug: 'fissler-adamant-comfort-sauteuse-28cm',
    nouveauNameDe: 'Fissler Adamant Comfort Sautépfanne 28 cm',
    motif:
      'Ligne inexistante corrigée, et « sauteuse » conservé en allemand : Sautépfanne ' +
      'est un produit distinct de Bratpfanne (couvercle, corps plus haut). Le prix ' +
      'relevé pour la Bratpfanne ne s y applique pas.',
  },
  // 2. Fausse unité dans le suffixe.
  {
    slug: 'zwilling-fondue-set-20l',
    nouveauSlug: 'zwilling-fondue-set-20cm',
    nouveauNameDe: 'Zwilling Fondue-Set Ø 20 cm, 1,8 L',
    motif:
      '« 20l » se lit 20 litres. Article 40201-001 : caquelon fonte émaillé Ø 20 cm, ' +
      '1,8 L, 6 fourchettes. Notre fiche annonçait 2,0 L, le produit réel est 1,8 L — ' +
      'capacité et suffixe corrigés tous les deux.',
  },
  {
    slug: 'le-creuset-fondue-set-20l',
    nouveauSlug: 'le-creuset-fondue-set-20cm',
    motif: 'Même défaut de suffixe que zwilling-fondue-set-20l : Ø 20 cm, pas 20 litres.',
  },
  // 3. Sauteuse : le mot est correct en allemand, mais seulement pour un produit
  //    qui a un couvercle. Conservé tel quel ici — le problème est le prix, pas
  //    le nom. Ces entrées documentent le point sans modifier.
  {
    slug: 'zwilling-spirit-sauteuse-24cm',
    motif:
      'Nom correct (Sautépfanne). Vérifié : le comparateur ne renvoie que la série US ' +
      'et un Energy+ 25,4 cm. Pas de relevé possible, aucun prix écrit.',
  },
]

async function main() {
  console.log(`\nNomenclature — ${CORRECTIONS.length} corrections\n`)

  let n = 0
  for (const c of CORRECTIONS) {
    const p = await prisma.product.findUnique({
      where: { slug: c.slug },
      select: { slug: true, nameDe: true, brand: true, ean: true },
    })
    if (!p) {
      console.log(`  ✗ ${c.slug} — introuvable`)
      continue
    }
    if (!c.nouveauSlug) {
      console.log(`  · ${c.slug} — sans changement de slug`)
      console.log(`      ${c.motif}\n`)
      continue
    }

    // Garde-fou : ne pas écraser une fiche existante.
    const cible = await prisma.product.findUnique({
      where: { slug: c.nouveauSlug },
      select: { slug: true, ean: true },
    })
    if (cible) {
      console.log(`  ⛔ ${c.slug} → ${c.nouveauSlug}`)
      console.log(`      La cible existe déjà. Renommage refusé : arbitrage humain requis.`)
      console.log(`      ${c.motif}\n`)
      continue
    }

    console.log(`  ${c.slug}`)
    console.log(`    → ${c.nouveauSlug}`)
    if (c.nouveauNameDe) console.log(`    nom : «${p.nameDe}» → «${c.nouveauNameDe}»`)
    if (p.ean) console.log(`    EAN ${p.ean} — conservé, l'identité produit ne change pas`)
    console.log(`    ${c.motif}\n`)

    if (!APPLY) continue
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { slug: c.slug },
        data: {
          slug: c.nouveauSlug,
          ...(c.nouveauNameDe ? { nameDe: c.nouveauNameDe } : {}),
        },
      })
      await tx.auditLog.create({
        data: {
          entityType: 'Product',
          entityId: c.nouveauSlug!,
          action: 'NOMENCLATURE',
          oldValues: { slug: c.slug, nameDe: p.nameDe, ean: p.ean },
          newValues: {
            slug: c.nouveauSlug,
            nameDe: c.nouveauNameDe ?? p.nameDe,
            motif: c.motif,
          },
        },
      })
    })
    console.log('    ✓ écrit')
    n++
  }
  console.log(`\nécrits : ${n}`)
  if (!APPLY) console.log('Rien n est écrit. Relisez, puis relancez avec --apply.')
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
