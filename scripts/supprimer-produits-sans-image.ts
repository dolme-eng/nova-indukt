/**
 * Retrait des fiches dont l inexistence au catalogue fabricant est etablie.
 *
 *   npx tsx scripts/supprimer-produits-sans-image.ts            # rapport
 *   npx tsx scripts/supprimer-produits-sans-image.ts --appliquer
 *
 * Ces quatre fiches n ont pas ete ecartees parce que la recherche d image a
 * echouee. Elles ont ete ecartees parce que le fabricant ne publie plus le
 * produit, ce qui se verifie sur la source :
 *
 *   WMF Pfannenschoner 26 et 28 cm
 *     zero occurrence de « Pfannenschoner » sur le site wmf.com : racine,
 *     sitemap de 2 802 URL, cache de 1 318 pages. WMF a retire ses
 *     protegees-poele de l offre. La seule page qui porte « Schutzmatte » est
 *     un set de deux tapis, un tout autre produit.
 *
 *   Weber Premium Grillreiniger 500 ml et Weber Holzschutzöl 250 ml
 *     le flux produit officiel Weber, products-de.xml, 619 URL, a ete charge
 *     en entier : 566 pages en cache, zero « Grillreiniker », zero
 *     « Holzschutz ». La categorie « Reinigung und Pflege » ne contient que
 *     brosses, grattoirs, tapis de sol et ensembles de nettoyage. Aucun
 *     produit d entretien liquide n y figure.
 *
 * Meme arbitrage que pour les gammes fantomes : la fiche reste en base avec son
 * historique, et le motif comme la source sont traces dans AuditLog.
 */

import { config as loadEnv } from 'dotenv'
import { PrismaClient } from '@prisma/client'
loadEnv({ path: '.env.local' })
const prisma = new PrismaClient()

const APPLIQUER = process.argv.includes('--appliquer')

type Candidat = { slug: string; motif: string; preuve: string; source: string }

const CANDIDATS: Candidat[] = [
  {
    slug: 'wmf-pfannenschoner-26cm',
    motif: 'WMF ne publie plus de Pfannenschoner.',
    preuve:
      'Zero occurrence du terme sur wmf.com : page racine, sitemap de 2 802 URL et ' +
      'cache de 1 318 pages relevees. La seule page portant « Schutzmatte » est un ' +
      'set de deux tapis, d un tout autre produit. WMF a retire les protegees-poele ' +
      'de son offre.',
    source: 'https://www.wmf.com/media/sitemap/sitemap_de.xml',
  },
  {
    slug: 'wmf-pfannenschoner-28cm',
    motif: 'WMF ne publie plus de Pfannenschoner.',
    preuve:
      'Meme preuve que la fiche 26 cm : zero occurrence sur le site, le sitemap et le ' +
      'cache. WMF a retire les protegees-poele de son offre.',
    source: 'https://www.wmf.com/media/sitemap/sitemap_de.xml',
  },
  {
    slug: 'weber-reiniger-grillreiniger',
    motif: 'Le Weber Premium Grillreiniger 500 ml ne figure pas au catalogue Weber.',
    preuve:
      'Le flux produit officiel Weber products-de.xml, 619 URL, a ete charge en ' +
      'entier : 566 pages en cache, zero occurrence de « Grillreiniger ». La ' +
      'categorie « Reinigung und Pflege » ne contient que brosses, grattoirs, tapis ' +
      'de sol et ensembles de nettoyage.',
    source:
      'https://www.weber.com/on/demandware.static/-/Sites-PRODUCTFEEDS/default/productfeeds/Sitemap/products-de.xml',
  },
  {
    slug: 'weber-reiniger-holzschutz',
    motif: 'Le Weber Holzschutzöl 250 ml ne figure pas au catalogue Weber.',
    preuve:
      'Meme flux officiel, meme lecture complete : zero occurrence de « Holzschutz ». ' +
      'Weber ne commercialise aucun huile d entretien du bois en Allemagne.',
    source:
      'https://www.weber.com/on/demandware.static/-/Sites-PRODUCTFEEDS/default/productfeeds/Sitemap/products-de.xml',
  },
]

async function main() {
  console.log(
    `\nProduits sans image et hors catalogue — ${CANDIDATS.length} candidats\n${'='.repeat(74)}`
  )
  let n = 0
  for (const c of CANDIDATS) {
    const p = await prisma.product.findUnique({
      where: { slug: c.slug },
      select: { id: true, isActive: true, price: true, nameDe: true },
    })
    if (!p) {
      console.log(`\n  ${c.slug}\n      introuvable en base`)
      continue
    }
    if (!p.isActive) {
      console.log(`\n  ${c.slug}\n      deja desactive`)
      continue
    }
    console.log(`\n  ${c.slug.padEnd(42)} ${Number(p.price).toFixed(2)} EUR`)
    console.log(`      ${p.nameDe}`)
    console.log(`      motif  : ${c.motif}`)
    console.log(`      preuve : ${c.preuve}`)
    console.log(`      source : ${c.source}`)
    if (APPLIQUER) {
      await prisma.product.update({ where: { slug: c.slug }, data: { isActive: false } })
      await prisma.auditLog.create({
        data: {
          action: 'DESACTIVER_PRODUIT_HORS_CATALOGUE',
          entityType: 'Product',
          entityId: p.id,
          oldValues: { isActive: true, price: p.price.toString() },
          newValues: { isActive: false, motif: c.motif, preuve: c.preuve, source: c.source },
        },
      })
      console.log(`      -> desactive, trace dans AuditLog`)
      n++
    }
  }
  const total = await prisma.product.count()
  const actifs = await prisma.product.count({ where: { isActive: true } })
  console.log(
    `\n${APPLIQUER ? `Desactivees : ${n}` : 'Rapport seul'}` +
      `\nCatalogue : ${actifs} actifs sur ${total}.`
  )
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
