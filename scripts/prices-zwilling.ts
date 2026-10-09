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
    // Notre slug annonce 16 cm ; la référence Pro S Utility 16 cm porte l EAN
    // 4009839072802 (zwilling.com.au). Le seul prix public trouvé est en
    // dollars australiens, hors marché allemand : écarté.
    slug: 'zwilling-pro-s-utility-messer-16cm',
    plancher: 0,
    source:
      'NON APPLIQUÉ — référence identifiée (EAN 4009839072802) mais seul prix public ' +
      'trouvé : 299,95 AUD chez zwilling.com.au. Marché allemand non documenté, ' +
      'conversion automatique refusée.',
    url: 'https://zwilling.com.au/professional-s-utility-knife-16cm/',
  },
  {
    slug: 'zwilling-magnetic-messerschiene',
    plancher: 43.95,
    source:
      'idealo 12 offres, 43,95–55,58 € — ZWILLING Magnetleiste Aluminium 45 cm ' +
      '(32622-450-0). zwilling.com affiche la même référence à 54,95 €. Notre slug ne ' +
      'portait pas la longueur : les deux versions existent (30 cm et 45 cm), le prix ' +
      'dépend de la longueur. Sur 45 cm, plancher 43,95 €.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/1708717_-magnetleiste-aluminium-45-cm-zwilling.html',
  },
  {
    slug: 'zwilling-four-star-chefmesser-16cm',
    plancher: 56.83,
    source:
      'idealo 20 offres, 56,83–99,00 € — ZWILLING Vier Sterne Kochmesser 16 cm, forgé, ' +
      'eisgehärté, poignée polygone. testbericht confirme de son côté 56,99 € en offre ' +
      'courante (Tiefstpreis 56,99 €). Plancher 56,83 €.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/709125_-vier-sterne-kochmesser-16-cm-zwilling.html',
  },
  {
    slug: 'zwilling-plus-deckel-20cm',
    plancher: 13.0,
    source:
      'esmeyer-shop.de, TWIN Specials Glasdeckel 20 cm (401-1631) : 13,00 EUR la piece, ' +
      'port offert des 250 EUR. zwilling.com affiche la meme reference ' +
      '(40990-920-0) a 16,95 EUR. Notre fiche est un « Plus Glasdeckel 20 cm » : ' +
      'on retient le plancher le plus bas des deux series de couvercle de 20 cm, ' +
      'pour rester sous le marche dans les deux cas.',
    url: 'https://www.esmeyer-shop.de/deckel-20-cm-rund-glas-serie-twin-specials-marke-zwilling',
  },
  {
    slug: 'zwilling-now-s-kochloeffel',
    plancher: 13.38,
    source:
      'NON APPLIQUE — idealo, ZWILLING Pro Edelstahlloeffel : 13,38 EUR (12 offres, ' +
      '13,38-30,95 EUR). Serie Pro, pas Now S. Ecarté : le prix d une ligne ' +
      'differente ne donne pas le prix de notre fiche.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/205610926_-henckels-pro-edelstahlloeffel-zwilling.html',
  },
  {
    slug: 'zwilling-now-s-besteckenset-30-teilig',
    plancher: 53.99,
    source:
      'NON APPLIQUE — trois games pour 30 pieces releves : Now S est introuvable ' +
      'sur le marché allemand. References voisinees : Aberdeen 30 tlg 94,95 EUR ' +
      '(zwilling.com), Cult 30 tlg 99,00 EUR (tischkulturshop), set generique ' +
      '53,99 EUR (moebel.de, mars 2026). Notre fiche est a 49,99 EUR, deja sous ' +
      'les trois : aucune correction needed, on n ecrit rien.',
    url: 'https://www.moebel.de/marken/zwilling/rubrik:geschirr?data-sheet=202ae3ac3f057188f6fb7231aafaddbf',
  },
  {
    slug: 'zwilling-spirit-sauteuse-24cm',
    plancher: 113.67,
    source:
      'NON APPLIQUE — zwilling.com ne liste que la sauteuse Spirit en dollars ' +
      '(139,99 USD, 64097-280). En Allemagne, le comparateur remonte une TWIN ' +
      'Classic Sauteuse 24 cm (kulinagroup, EAN 4009839260834) a 113,67 EUR : ' +
      'autre serie, meme type. Ecarté : le prix d une Twin Classic ne vaut pas ' +
      'pour une Spirit.',
    url: 'https://www.zwilling.com/us/zwilling-spirit-3-ply-5-qt-stainless-steel-saute-pan-64097-280/64097-280-0.html',
  },
  {
    slug: 'zwilling-fondue-set-20cm',
    plancher: 54.95,
    source:
      'idealo 5 offres, 54,95–99,00 € — ZWILLING Fondue-Set 40201-001, caquelon fonte ' +
      'émaillé rouge Ø 20 cm / 1,8 L, 6 fourchettes, brûleur à pâte. EAN 4009839396113. ' +
      'Notre fiche annonçait 2,0 L pour un produit de 1,8 L : corrigé en nomenclature.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/5831457_-fondue-set-40201-001-zwilling.html',
  },
  {
    slug: 'zwilling-plus-kochtopf-hoch-20cm',
    plancher: 79.95,
    source:
      'zwilling.com, article 71083-200-0 (ZWILLING Pro S Kochtopf 20 cm, 3,5 l, avec ' +
      'couvercle) : 79,95 € en promotion, 129,00 € prix plein. Notre fiche est un kochtopf ' +
      'haut 20 cm ; Plus et Pro S partagent ce corps. On retient le prix actuellement ' +
      'affiché, pas le prix barré.',
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
