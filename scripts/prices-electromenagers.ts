/**
 * Prix des electromenagers et des marques hors des trois premiers lots.
 *
 *   npx tsx scripts/prices-electromenagers.ts
 *   npx tsx scripts/prices-electromenagers.ts --apply
 *
 * Meme regle que les autres lots de prix : plancher de marche actuel moins
 * 3 %, arrondi a l euro, source et URL obligatoires, et un refus explicite
 * lorsque le produit releve n est pas celui de la fiche.
 *
 * Les ustensiles et l electromenager ne se verifient pas de la meme facon. Un
 * couteau se reconnait a sa lame et a sa longueur ; une plaque de cuisson a un
 * modele exact — PKFI3, EX645LYC1E, PIF64RBB5E. Un modele qui ne correspond
 * pas est un autre appareil, et son prix ne dit rien du notre.
 */

import { config as loadEnv } from 'dotenv'
import { PrismaClient } from '@prisma/client'
loadEnv({ path: '.env.local' })
const prisma = new PrismaClient()

const APPLY = process.argv.includes('--apply')
const MARGE = 0.03

type Ligne = { slug: string; plancher: number; source: string; url: string }

const LIGNES: Ligne[] = [
  {
    slug: 'bora-professional-3-pkfi3-induktionskochfeld-kochfeldabzug',
    plancher: 2049.0,
    source:
      'elektrokoeck.de : BORA PKFI3 a 2 049,00 EUR, UVP 2 508,00 EUR. ' +
      'mykitchens.de : 788754 BORA PKFI3 a 2 088,00 EUR, UVP 2 487,10 EUR, EAN ' +
      '4251731201112. Les deuxqdmarchands designent le modele PKFI3 et donnent les ' +
      'memes cotes, 370 x 540 x 52 mm, 2 zones de 2 100 W. Plancher 2 049,00 EUR. ' +
      'geizhals.de annonce de son cote « ab 2 049,00 € » pour la meme reference, ' +
      'ce qui correspond au prix le plus bas et non a une moyenne.',
    url: 'https://www.mykitchens.de/bora-pkfi3-herdunabhaengiges-induktionskochfeld-schwarz',
  },
  {
    slug: 'siemens-iq700-ex645lyc1e-induktionskochfeld',
    plancher: 543.73,
    source:
      'testbericht.de : Siemens EX645LYC1E, 31 offres, plancher 543,73 EUR, moyenne ' +
      '546 EUR sur un mois, donnees du 12.10.2026. La meme reference est confirmee ' +
      'par galaxus.de a 585,99 EUR, article 11053696, fabricant EX645LYC1E. Les ' +
      'deux sources concordent sur le modele, la largeur de 58,3 cm et la ' +
      'puissance de 7 400 W. Notre fiche etait a 549,00 EUR, soit 2 % au-dessus ' +
      'du plancher : a corriger.',
    url: 'https://www.testbericht.de/produkte/siemens-ex645lyc1e',
  },
  {
    slug: 'aeg-ikb6431axb-autarkes-induktionskochfeld-60cm',
    plancher: 469.0,
    source:
      'meta-preisvergleich.de : le prix de comparaison du AEG IKB6431AXB ' +
      's etablit a 469,00 EUR, fourchette pertinente de 470 a 600 EUR pour une ' +
      'offre de niveau de marche normal. Notre fiche etait a 320,00 EUR, soit ' +
      '32 % sous le plancher : nous etions moins chers que tout le marche. ' +
      'mykitchens.de et untrue.de confirment le modele IKB6431AXB avec ' +
      'Hob2Hood, serie 5000, 4 zones, 7 350 W, EAN 7333394024592.',
    url: 'https://meta-preisvergleich.de/s/aeg-ikb6431axb.htm',
  },
]

async function main() {
  console.log(`\n${LIGNES.length} lignes\n${'='.repeat(74)}`)
  let n = 0
  for (const l of LIGNES) {
    const propose = Math.round(l.plancher * (1 - MARGE))
    const p = await prisma.product.findUnique({
      where: { slug: l.slug },
      select: { price: true, nameDe: true },
    })
    if (!p) {
      console.log(`  ${l.slug} : introuvable`)
      continue
    }
    const actuel = Number(p.price)
    console.log(`\n  ${l.slug}`)
    console.log(`      ${p.nameDe}`)
    console.log(`      ${actuel.toFixed(2)} EUR -> ${propose} EUR (plancher ${l.plancher} EUR)`)
    if (Math.abs(actuel - propose) < 0.01) {
      console.log('      = deja conforme')
      continue
    }
    if (!APPLY) {
      console.log('      -> a ecrire au --apply')
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
    console.log('      ecrit')
    n++
  }
  console.log(`\necrits : ${n}`)
}

main()
  .catch((e) => {
    console.error('x', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
