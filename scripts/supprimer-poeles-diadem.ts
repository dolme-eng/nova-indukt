/**
 * Retrait des poeles et sauteuses « Diadem Plus » que WMF ne publie pas.
 *
 *   npx tsx scripts/supprimer-poeles-diadem.ts --appliquer
 *
 * Le sitemap officiel WMF liste exactement douze produits « Diadem Plus », et
 * on peut les lire un par un : un ensemble 10 pieces, quatre ensembles topf,
 * une Stielkasserolle 16 cm, trois Kochtopf 16/20/24 cm, trois Bratentopf
 * 16/20/24 cm. Ni poele a frire, ni sauteuse, en aucune taille.
 *
 * Nos quatre fiches dans ces deux types — poeles 24 et 28 cm, sauteuses 24 et
 * 28 cm — n ont donc pas de correspondant dans l offre actuelle. Les poeles
 * n avaient pas d'image, les sauteuses en avaient une, mais une image ne fait
 * pas un produit.
 *
 * Meme arbitrage que pour les gammes fantomes : la fiche reste en base avec son
 * historique, motif et source traces dans AuditLog.
 */

import { config as loadEnv } from 'dotenv'
import { PrismaClient } from '@prisma/client'
loadEnv({ path: '.env.local' })
const prisma = new PrismaClient()

const APPLIQUER = process.argv.includes('--appliquer')

const CANDIDATS = [
  'wmf-diadem-plus-bratpfanne-24cm',
  'wmf-diadem-plus-bratpfanne-28cm',
  'wmf-diadem-plus-sauteuse-24cm',
  'wmf-diadem-plus-sauteuse-28cm',
]

const LISTE_OFFICIELLE =
  'Le sitemap officiel wmf.com liste douze produits « Diadem Plus » : ' +
  'diadem-plus-kochgeschirr-set-10-teilig, quatre ensembles topf, ' +
  'une Stielkasserolle 16 cm, trois Kochtopf 16/20/24 cm et trois Bratentopf ' +
  '16/20/24 cm. Ni Bratpfanne, ni Servierpfanne, en aucune taille.'

const PREUVE_POELES =
  LISTE_OFFICIELLE +
  ' Les deux poeles a frire 24 et 28 cm que nous proposions ne sont donc pas des articles WMF publie.'

const PREUVE_SAUTEUSES =
  LISTE_OFFICIELLE +
  ' Les deux sauteuses 24 et 28 cm que nous proposions ne sont donc pas, ' +
  'elles non plus, des articles WMF publie. Elles avaient une image, mais une ' +
  'image ne fait pas un produit : elles sont retirees sur le meme constat que ' +
  'les deux poeles, apres decision explicite.'

const PREUVE = PREUVE_POELES + ' ' + PREUVE_SAUTEUSES

async function main() {
  let n = 0
  for (const slug of CANDIDATS) {
    const p = await prisma.product.findUnique({
      where: { slug },
      select: {
        id: true,
        isActive: true,
        nameDe: true,
        price: true,
        _count: { select: { images: true } },
      },
    })
    if (!p) {
      console.log(`${slug} : introuvable`)
      continue
    }
    if (!p.isActive) {
      console.log(`${slug} : deja desactive`)
      continue
    }
    console.log(`\n${slug}  ${Number(p.price).toFixed(2)} EUR  ${p._count.images} image(s)`)
    console.log(`  ${p.nameDe}`)
    console.log(`  ${PREUVE}`)
    if (APPLIQUER) {
      await prisma.product.update({ where: { slug }, data: { isActive: false } })
      await prisma.auditLog.create({
        data: {
          action: 'DESACTIVER_GAMME_FANTOME',
          entityType: 'Product',
          entityId: p.id,
          oldValues: { isActive: true, price: p.price.toString() },
          newValues: {
            isActive: false,
            motif: 'Poele Diadem Plus hors catalogue WMF.',
            preuve: PREUVE,
            source: 'https://www.wmf.com/media/sitemap/sitemap_de.xml',
          },
        },
      })
      console.log('  -> desactive, trace dans AuditLog')
      n++
    }
  }
  const actifs = await prisma.product.count({ where: { isActive: true } })
  const total = await prisma.product.count()
  const sansImage = await prisma.product.count({ where: { isActive: true, images: { none: {} } } })
  console.log(
    `\n${APPLIQUER ? `Desactivees : ${n}` : 'Rapport seul'}\n` +
      `Catalogue : ${actifs} actifs sur ${total}, dont ${sansImage} sans image.`
  )
}
main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
