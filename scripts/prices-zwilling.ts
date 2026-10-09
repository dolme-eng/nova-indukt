/**
 * Prix WMF / Zwilling / Tefal — règle « plancher − 3 % ».
 *
 *   npx tsx scripts/prices-zwilling.ts           # rapport
 *   npx tsx scripts/prices-zwilling.ts --apply
 *
 * WMF/Zwilling/TefalUnlike Fissler, leurs dénominations correspondent aux
 * libellés des comparateurs : le relevé automatique y est fiable. Relevé du
 * 2026-10-09.
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
    slug: 'zwilling-fondue-set-20l',
    plancher: 54.95,
    source:
      'idealo 5 offres, 54,95–99,00 € — ZWILLING Fondue-Set 40201-001 : caquelon en fonte ' +
      'émail rouge Ø 20 cm, 1,8 L, 6 fourchettes, brûleur à pâte. Capacité 20 cm, pas 20 L : ' +
      'notre libellé « 20l » désigne le diamètre, l’unité est fausse dans notre nom.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/5831457_-fondue-set-40201-001-zwilling.html',
  },
  {
    slug: 'zwilling-four-star-chefmesser-20cm',
    plancher: 49.99,
    source:
      'idealo 32 offres, 49,99–113,00 € — ZWILLING Vier Sterne Kochmesser 20 cm, forgé, ' +
      'eisgehärtet, poignée polygone. Le plancher idealo (49,99 €) est le moins cher des 32 ; ' +
      'retenu plutôt que le 39,90 € d’AP Stahlwaren sur geizhals,-listed mais hors livraison ' +
      'et noté comme marchand autrichien — non représentatif du prix rendu en Allemagne.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/709126_-vier-sterne-kochmesser-20-cm-zwilling.html',
  },
  {
    slug: 'zwilling-pro-s-messerset-3-teilig',
    plancher: 159.9,
    source:
      'idealo 19 offres, 159,90–295,00 € — ZWILLING Pro Messerset 3 tlg. (384300070), ' +
      'composition identique à notre fiche : Spickmesser 10 + Kochmesser 20 + Fleischmesser 20, ' +
      'forgé, poignée plastique. Notre fiche était à 49,99 € pour un set forgé triple : ' +
      'écart d’un facteur 3.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/3767792_-pro-messerset-3-tlg-384300070-zwilling.html',
  },
  {
    slug: 'zwilling-twin-classic-kochtopf-20cm',
    plancher: 44.95,
    source:
      'zwilling.com, article 66583-200-0 : 44,95 € — TWIN Classic Kochtopf 3,5 l / 20 cm, ' +
      'SIGMA Classic, couvercle inox. 1a-neuware le propose à 53,98 € (UVP 89,95 €). ' +
      'Plancher 44,95 € = prix fabricant direct.',
    url: 'https://www.zwilling.com/de/zwilling-twin-classic-kochtopf-35-l-20-cm-18%2F10-edelstahl-66583-200-0/66583-200-0.html',
  },
  {
    slug: 'zwilling-madura-plus-28cm',
    plancher: 59.95,
    source:
      'zwilling.com, série Madura Plus, Bratpfanne 28 cm (1030790) : prix barré 79,95 €, ' +
      'prix de vente affiché 59,95 € (-25 %). On retient le prix RÉELLEMENT payé, 59,95 €, ' +
      'et non le prix barré.',
    url: 'https://www.zwilling.com/de/zwilling/kochgeschirr/madura-plus/',
  },
  {
    slug: 'zwilling-plus-kochtopf-hoch-20cm',
    plancher: 79.95,
    source:
      'zwilling.com, article 71083-200-0 (ZWILLING Pro S Kochtopf 20 cm, 3,5 L, ' +
      'deckel): 79,95 € en promotion, 129,00 € prix plein. Notre fiche est un kochtopf ' +
      'haut 20 cm ; Pro S et Plus partagent ce corps. On retient 79,95 €, le prix ' +
      'actuellement affiché, et non le prix plein barré.',
    url: 'https://www.zwilling.com/de/zwilling-pro-s-kochtopf-20-cm-18%2F10-edelstahl-71083-200-0/71083-200-0.html',
  },
  {
    slug: 'zwilling-pro-s-chefmesser-20cm',
    plancher: 69.95,
    source:
      'zwilling.com, article 31021-201-0 : 69,95 € — référence identique confirmée ' +
      '( Professional S, forgé, noyau Special melting, Lame 20 cm). cuchillalia propose ' +
      'le même article à 78,95 €. Plancher 69,95 € = prix direct fabricant, seul point ' +
      'de comparaison chiffré pour cette référence précise.',
    url: 'https://www.zwilling.com/de/zwilling-professional-s-kochmesser-20-cm-31021-201-0/31021-201-0.html',
  },
  {
    slug: 'zwilling-summit-plus-bratpfanne-28cm',
    plancher: 78.97,
    source:
      'idealo 16 offres, 78,97–99,95 € — ZWILLING Pro Bratpfanne 28 cm Edelstahl (65128-280-0). ' +
      'Variante « hoch » (98,00–119,00 €) écartée : notre fiche est une bratpfanne classique, ' +
      'pas une sauteuse à haut bord. Summit Plus et Pro sont deux lignes Zwilling distinctes, ' +
      'mais même corps 28 cm — plancher retenu par prudence, il reste sous les deux lignes.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/201332978_-pro-bratpfanne-18-10-edelstahl-silber-28-cm-zwilling.html',
  },
  {
    slug: 'zwilling-flow-topfset-5tlg',
    plancher: 141.67,
    source:
      'geizhals.at 71030-000-0, 2 offres : Amazon.at 141,67 € et galaxus.at 143,09 €. ' +
      'Le fabricant (zwilling.com) affiche 149,00 €. Autriche et Allemagne bonshommes le même ' +
      'article, shipping inclus — plancher 141,67 € retenu.',
    url: 'https://geizhals.at/zwilling-flow-kochtopf-set-71030-000-0-a2641642.html',
  },
  {
    slug: 'zwilling-pro-s-chefmesser-26cm',
    plancher: 54.95,
    source:
      'idealo, 7 offres, 54,95–125,00 € — ZWILLING Professional S Kochmesser 26 cm ' +
      '(31021-261-0), confirmé par WhichOne. Notre fiche était à 139,99 €, soit le ' +
      'double du plancher : écart massif, à corriger.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/709084_-professional-s-kochmesser-26-cm-zwilling.html',
  },
]

async function main() {
  console.log(`\nZwilling — ${LIGNES.length} lignes (plancher − ${MARGE * 100} %)\n`)
  let n = 0
  for (const l of LIGNES) {
    const propose = Math.round(l.plancher * (1 - MARGE))
    const p = await prisma.product.findUnique({
      where: { slug: l.slug },
      select: { price: true },
    })
    if (!p) {
      console.log(`  ✗ ${l.slug} — introuvable`)
      continue
    }
    const actuel = Number(p.price)
    const delta = ((propose - actuel) / actuel) * 100
    console.log(
      `  ${l.slug.padEnd(42)} ${actuel.toFixed(2).padStart(8)} → ${propose.toFixed(2).padStart(8)} ` +
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
    console.log(`      ✓ écrit`)
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
