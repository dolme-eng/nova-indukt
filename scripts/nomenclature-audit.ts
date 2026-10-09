/**
 * Inventaire de nomenclature — liste les fiches dont le libellé ne correspond
 * pas aux dénominations du marché allemand.
 *
 *   npx tsx scripts/nomenclature-audit.ts            # rapport complet
 *   npx tsx scripts/nomenclature-audit.ts --brand Fissler
 *
 * Sortie : la liste de travail à trancher. Rien n'est écrit ici — ce script
 * n'apporte que du constats, les corrections passent par fix-nomenclature.ts.
 *
 * Quatre défauts recherchés, tous rencontrés sur le catalogue :
 *
 *  1. LIGNE-INCONNUE   le nom de série n'existe pas chez le fabricant
 *                       (« Adamant Plus » : Fissler vend Comfort et Premium)
 *  2. FAUSSE-UNITE     le suffixe se lit autrement qu'il ne veut dire
 *                       (« 20l » pour un diametre de 20 cm)
 *  3. TYPE-CONFONDU    deux denominations designent deux produits distincts
 *                       (Sautépfanne avec couvercle ≠ Bratpfanne sans)
 *  4. PAS-DE-COTES     une fiche sans dimension ne peut pas etre rapprochee
 *                       d'une offre, puisque la dimension est le premier
 *                       discriminant d'un comparateur
 */

import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const root = path.resolve(__dirname, '..')
for (const f of ['.env.local', '.env']) loadEnv({ path: path.join(root, f) })
const prisma = new PrismaClient()

const arg = (n: string) => {
  const i = process.argv.indexOf(n)
  return i > -1 ? process.argv[i + 1] : undefined
}
const BRAND = arg('--brand')

/** Lignes de série réellement vendues par chaque fabricant. */
const LIGNES_REELLES: Record<string, string[]> = {
  Fissler: [
    'adamant',
    'adamant-comfort',
    'adamant-premium',
    'cenit',
    'centimeter',
    'intensa',
    'octopus',
    'opc',
    'original-profi-collection',
    'perfect',
    'pure',
    'vitavit',
    'woll',
  ],
  Zwilling: [
    'essential',
    'first-choice',
    'flow',
    'four-star',
    'forte',
    'foundation',
    'madura-plus',
    'now-s',
    'plus',
    'pro',
    'professional-s',
    'simplify',
    'spirit',
    'summit-plus',
    'twin-classic',
  ],
  WMF: [
    'advanced-plus',
    'comfort-line',
    'compact-cuisine',
    'diadem-plus',
    'dorado',
    'function-4',
    'fusiontec',
    'gourmet',
    'ideal-plus',
    'kitchenline',
    'mondo',
    'permacook',
    'professional',
    'professional-plus',
    'profi-plus',
    'topfregal',
    'zeppelin',
  ],
  Tefal: [
    'apicio',
    'blendforce',
    'duetto',
    'eternal',
    'excellence',
    'hard-titanium',
    'ingenio',
    'intuition',
    'jamie-oliver',
    'maison',
    'master',
    'masterclass',
    'natural-on',
    'ondine',
    'preference',
    'pure-plus',
    'raclette',
    'snack-collection',
    'stylis',
    'talent',
  ],
}

/** Suffixes de dimension attendus — sans l'un d'eux, pas de rapprochement. */
const COTE = /(\d+cm|\d+x\d+cm|\d+(\.\d+)?l|\d+(\.\d+)?cm)/i

type Constat = { slug: string; nom: string; marque: string; defauts: string[] }

async function main() {
  const where = BRAND ? { isActive: true, brand: BRAND } : { isActive: true }
  const produits = await prisma.product.findMany({
    where,
    select: { slug: true, nameDe: true, brand: true },
    orderBy: { slug: 'asc' },
  })

  const constats: Constat[] = []
  for (const p of produits) {
    const marque = p.brand ?? ''
    const nom = p.nameDe ?? ''
    const defauts: string[] = []

    // 1. Ligne de série inconnue du fabricant.
    //    Le préfixe de marque dans le slug n'est pas toujours celui de la
    //    colonne `brand` (« wm- » pour une marque WMF) : on retire le préfixe
    //    réel du slug, pas celui déduit de la marque.
    const reelles = LIGNES_REELLES[marque]
    if (reelles) {
      const corps = p.slug.replace(/^[a-z]+-/, '')
      // On isole le début de série : les tokens Until la première cote.
      const tete = corps.split('-').slice(0, 3)
      const connu = reelles.some((r) =>
        tete.some((t) => r === t || r.startsWith(`${t}-`) || t.startsWith(`${r}-`))
      )
      if (!connu) defauts.push(`ligne inconnue : ${tete.join('-')}`)
    }

    // 2. Fausse unité : un suffixe « 20l » pour un produit de quelques litres.
    const fauxL = nom.match(/(\d+)l\b/i)
    if (fauxL && Number(fauxL[1]) >= 5) defauts.push(`fausse unité : «${fauxL[0]}»`)

    // 3. Type confondu : « sauteuse » et « bratpfanne » sont deux produits.
    const aSauteuse = /\bsaut/i.test(nom)
    const aBrat = /\bbratpfanne|\bbratenpfanne/i.test(nom)
    if (aSauteuse && aBrat) defauts.push('sauteuse et bratpfanne dans le meme nom')
    else if (aSauteuse) defauts.push('Sautépfanne : a confirmer vs Bratpfanne (produits distincts)')

    // 4. Absence de dimension.
    if (!COTE.test(p.slug)) defauts.push('pas de cote dans le slug')

    if (defauts.length) constats.push({ slug: p.slug, nom, marque, defauts })
  }

  const parMarque = constats.reduce<Record<string, Constat[]>>((acc, c) => {
    ;(acc[c.marque] ??= []).push(c)
    return acc
  }, {})

  console.log(
    `\nInventaire de nomenclature — ${constats.length} fiches sur ${produits.length} actives`
  )
  console.log(
    `Répartition : ${Object.entries(parMarque)
      .map(([m, l]) => `${m} ${l.length}`)
      .join('   ')}\n`
  )

  for (const [marque, liste] of Object.entries(parMarque).sort(
    (a, b) => b[1].length - a[1].length
  )) {
    console.log(`── ${marque} (${liste.length})`)
    for (const c of liste) {
      console.log(`  ${c.slug}`)
      for (const d of c.defauts) console.log(`      · ${d}`)
    }
    console.log('')
  }

  // Priorité : le seul défaut qui bloque vraiment le relevé automatique est la
  // ligne de série inconnue. « Pas de cote » et « sauteuse à confirmer » sont
  // des remarques : elles n'empêchent pas une recherche manuelle.
  const bloquants = constats.filter((c) => c.defauts.some((d) => d.startsWith('ligne inconnue')))

  console.log(`\n${'='.repeat(72)}`)
  console.log(`BLOQUANT — ligne de série inconnue : ${bloquants.length} fiches`)
  console.log(`${'='.repeat(72)}\n`)
  for (const c of bloquants.sort((a, b) => a.marque.localeCompare(b.marque))) {
    const ligne = c.defauts
      .find((d) => d.startsWith('ligne inconnue'))!
      .replace('ligne inconnue : ', '')
    const candidats = (LIGNES_REELLES[c.marque] ?? []).slice(0, 6).join(', ')
    console.log(`  ${c.slug.padEnd(44)} → ? ${ligne}`)
    console.log(`      lignes réelles : ${candidats}`)
  }
  console.log(
    `\nCes ${bloquants.length} fiches sont inéligibles au relevé automatique tant que la ligne` +
      `\nn est pas rectifiée. C est le travail qui débloque le reste du catalogue.`
  )
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
