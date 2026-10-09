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

/**
 * Une ligne de relevé.
 *
 * `appliquer: false` marque un relevé conservé pour arbitrage mais non écrit
 * en base. Le champ est explicite et le runner le respecte — écrire « NON
 * APPLIQUÉ » dans le texte de `source` ne suffisait pas et a caused une
 * écriture : le Gourmet Plus 5-teilig a été calé sur le Diadem Plus voisin et
 * enregistré à 126 € au lieu de 319 €. Un relevé refusé doit l'être dans la
 * donnée, pas dans sa description.
 */
type Ligne = {
  slug: string
  plancher: number
  source: string
  url: string
  appliquer?: false
}

const LIGNES: Ligne[] = [
  {
    slug: 'wmf-gourmet-plus-topfset-5tlg',
    plancher: 329.0,
    source:
      'testbericht.de, relevé du 09/10/2026 : WMF Gourmet Plus Kochtopf-Set mit ' +
      'Stieltopf 5-teilig (0720056030) à 329,00 EUR, Ø 348 EUR sur un mois, ' +
      'Tiefstpreis 315,47 EUR, 3 offres. Composition : Bratentopf 20 cm, ' +
      'Fleischtopf 16/20/24 cm, Stielkasserolle 16 cm — TransTherm, ' +
      'Dampföffnung. Notre fiche est à 299,00 EUR. On retient le plancher ' +
      'courant 329,00 EUR et non le Tiefstpreis de 315,47 EUR, atteint mais ' +
      'non garanti.',
    url: 'https://www.testbericht.de/produkte/wmf-gourmet-plus-kochgeschirr-set-5-tlg-0720056030',
  },
  {
    appliquer: false,
    slug: 'wmf-gourmet-plus-kochtopf-24cm',
    plancher: 99.14,
    source:
      'koempf24.de, WMF Fleischtopf Ø 24 cm Gourmet Plus : 99,14 EUR en promotion, ' +
      '106,16 EUR avant promo, UVP 179,99 EUR ; 5,7 L, TransTherm, couvercle inox ' +
      'à dégagement de vapeur. idealo, 6 offres, 101,99-179,99 EUR. Les deux ' +
      'sources se recoupent sur la même référence. Plancher 99,14 EUR.',
    url: 'https://www.koempf24.de/wmf-fleischtopf-o-24-cm-gourmet-plus',
  },
  {
    appliquer: false,
    slug: 'wmf-fusiontec-schmorpfanne-28cm',
    plancher: 119.99,
    source:
      'idealo 12 offres, 119,99-202,89 EUR — WMF Fusiontec Schmorpfanne 28 cm, ' +
      '4,1 L, haut bord, kratzfest. deutschlandcard confirme l EAN 4000530702746 ' +
      '(variante Black) à 149,99 EUR. Plancher 119,99 EUR.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/6615027_-fusiontec-schmorpfanne-28-cm-wmf.html',
  },
  {
    appliquer: false,
    slug: 'wmf-diadem-plus-kochtopf-hoch-16cm',
    plancher: 29.99,
    source:
      'NON APPLIQUE — idealo, 8 offres, 29,99-89,95 EUR pour le WMF Diadem Plus ' +
      'Fleischtopf 16 cm / 2,0 L ; wmf.com confirme l EAN 4000530570420. Mais ' +
      'notre catalogue n a que les versions 20 et 24 cm. Reference fournie pour ' +
      'arbitrage.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/687225_-diadem-plus-fleischtopf-16-cm-wmf.html',
  },
  {
    slug: 'wmf-diadem-plus-sauteuse-24cm',
    plancher: 47.02,
    source:
      'idealo 6 offres, 47,02–99,95 € — WMF Diadem Plus Bratentopf 24 cm, 4,5 L, ' +
      'couvercle à emboîtement, TransTherm. wmf.com confirme la référence (CMMF ' +
      '3201115498, EAN 4000530570413, 4,5 L, hauteur 97 mm) : c est bien la ' +
      'sauteuse à haut bord que nous vendons, pas une simple sauteuse. ' +
      'Plancher 47,02 €.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/687224_-diadem-plus-bratentopf-24-cm-wmf.html',
  },
  {
    appliquer: false,
    slug: 'wmf-diadem-plus-set-7-teilig',
    plancher: 129.99,
    source:
      'NON APPLIQUE par défaut — la référence la plus proche est le Diadem Plus ' +
      'Topf-Set 5-teilig (EAN 4000530736482) : 149,99 EUR chez wmf.com (30 jours ' +
      'au meilleur prix) et 129,99 EUR chez Alternate. Notre fiche est un ' +
      '« Set 7-teilig » : la composition differe, donc ce prix ne lui est pas ' +
      'applicable. Releve fourni pour arbitrage.',
    url: 'https://www.alternate.de/WMF/Topf-Set-Diadem-Plus-5-teilig/html/product/100096394',
  },
  {
    slug: 'wmf-diadem-plus-kochtopf-hoch-20cm',
    plancher: 34.31,
    source:
      'idealo 11 offres, 34,31–99,95 € — WMF Diadem Plus Fleischtopf 20 cm, 3,5 L, ' +
      'couvercle à emboîtement, TransTherm. Plancher 34,31 € atteint chez deux ' +
      'vendeurs. À distinguer du Bratentopf 20 cm (plancher 34,06 €) : deux ' +
      'hauteurs de corps différentes, notre fiche est le kochtopf haut.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/687226_-diadem-plus-fleischtopf-20-cm-wmf.html',
  },
  {
    slug: 'wmf-diadem-plus-stielkasserolle-16cm',
    plancher: 34.94,
    source:
      'mydealz.de, relevé du 10/08/2026 : WMF Diadem Plus Stielkasserolle mit Deckel ' +
      '16 cm à 29,99 EUR chez WMF lui-même, 34,94 EUR port compris, avec un code ' +
      'promo de 25 % (27,44 EUR effectif). Prochain vendeur cité : Otto à 40,49 EUR. ' +
      'deutschlandcard donne 34,99 EUR pour le même EAN 4000530532237. ' +
      'Plancher 34,94 EUR : la promo de 29,99 EUR est datée et le code-coupon ' +
      'réduit de 25 % ne vaut pas comme référence de marché.',
    url: 'https://www.mydealz.de/deals/cb-wmf-diadem-plus-stielkasserolle-mit-deckel-16-cm-2822959',
  },
  {
    slug: 'wmf-diadem-plus-kochtopf-hoch-24cm',
    plancher: 39.04,
    source:
      'idealo 11 offres, 39,04–119,95 € — WMF Diadem Plus Fleischtopf 24 cm, 6,0 L, ' +
      'couvercle à emboîtement, TransTherm. wmf.com confirme la référence ' +
      '(Diadem Plus Kochtopf mit Deckel, 24 cm, EAN 4000530570444, 6,5 L, ' +
      'Cromargan 18/10) — c’est bien la variante haute que nous vendons. ' +
      'Plancher 39,04 €, atteint chez Amazon, kaufland et un troisième vendeur.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/687227_-diadem-plus-fleischtopf-24-cm-wmf.html',
  },
  {
    appliquer: false,
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
    appliquer: false,
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
    appliquer: false,
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
    // Relevé conservé pour arbitrage : reported, jamais écrit.
    if (l.appliquer === false) {
      const existe = await prisma.product.findUnique({
        where: { slug: l.slug },
        select: { slug: true },
      })
      console.log(`  [refuse] ${l.slug}${existe ? '' : '   (pas de fiche)'}`)
      continue
    }
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
