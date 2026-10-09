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
    slug: 'wmf-mondo-messerset-3-teilig',
    plancher: 66.91,
    source:
      'NON APPLIQUE — Mondo est introuvable. La reference la plus proche cotee ' +
      'est la WMF Kineo Messerset 3-teilig (haushaltsparadies) : 66,91 EUR, UVP ' +
      '99,99 EUR ; la Spitzenklasse Plus 3-teilig est a 99,99 EUR (idealo, 11 ' +
      'offres). Notre fiche est a 59,99 EUR, deja sous les deux references ' +
      'relevees. Aucune ecriture.',
    url: 'https://haushaltsparadies.de/WMF-Messerset-3-teilig-Kineo',
  },
  {
    slug: 'wmf-antihaft-reiniger',
    plancher: 14.99,
    source:
      'NON APPLIQUÉ — wmf.com ne vend plus d « Antihaft-Reiniger » : les produits ' +
      'd entretien WMF actuels sont le Purargan (250 ml, EAN 4000530211040) et le ' +
      'Fusiontec Reinigungsmittel (250 ml, 14,99 EUR sur wmf.com/at). Notre fiche ' +
      '« Antihaft-Reiniger 250 ml » n est plus au catalogue du fabricant. Référence ' +
      'fournie pour arbitrage, non appliquée.',
    url: 'https://www.wmf.com/at/de/produkte/kuechenhelfer/pflege-reinigungsmittel.html',
  },
  {
    // Fiche inexistante : le catalogue porte « wmf-function-4-bratentopf-20cm »
    // (EAN 4000530605856). Il n'y a pas de version 24 cm chez nous, alors que
    // le relevé ci-dessous porte précisément sur le 24 cm. Écartée : appliquer un
    // prix 24 cm à une fiche 20 cm serait l'erreur de variante qu'on a déjà
    // commise deux fois (couvercles 16/20 cm, ustensiles Now S).
    slug: 'wmf-function-4-bratentopf-24cm',
    plancher: 106.08,
    source:
      'koempf24.de, WMF Fleischtopf Ø 24 cm Function 4 (ancienne art. 0761246380, ' +
      '5,7 l, Chromargan 18/10, TransTherm) : 106,08 € en promotion, 113,25 € avant ' +
      'promo, UVP 179,99 €. wmf.com confirme la même référence (Kochtopf mit ' +
      'Deckel, 24 cm) à 119,99 €, UVP 179,99 €. Plancher 106,08 €, le moins cher ' +
      'des deux et la seule offre avec remise active.',
    url: 'https://www.koempf24.de/wmf-fleischtopf-o-24-cm-function-4',
  },
  {
    slug: 'wmf-compact-cuisine-dampfgareinsatz-24cm',
    plancher: 55.93,
    source:
      'idealo 8 offres, 55,93–98,95 € — WMF Compact Cuisine Dämpfereinsatz 24 cm ' +
      '(réf. 793246380), Cromargan 18/10. koempf24 confirme la référence ' +
      '(ancienne 0793246380) à 65,55 € en promotion, UVP 99,99 €. Plancher 55,93 €.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/6839561_-compact-cuisine-daempfereinsatz-24-cm-793246380-wmf.html',
  },
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
