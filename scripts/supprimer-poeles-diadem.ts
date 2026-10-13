/**
 * Retrait des poeles « Diadem Plus » que WMF ne publie pas.
 *
 *   npx tsx scripts/supprimer-poeles-diadem.ts --appliquer
 *
 * Le sitemap officiel WMF liste exactement douze produits « Diadem Plus », et
 * on peut les lire :
 *
 *   diadem-plus-kochgeschirr-set-10-teilig-3201001275
 *   diadem-plus-topf-vorteils-set-4-teilig-3201113653
 *   diadem-plus-stielkasserolle-16-cm-3201115427
 *   diadem-plus-topf-set-4-teilig-3201115429
 *   diadem-plus-topf-set-3-teilig-3201115430
 *   diadem-plus-kochtopf-mit-deckel-16-cm-3201115443
 *   diadem-plus-kochtopf-mit-deckel-20-cm-3201115444
 *   diadem-plus-bratentopf-mit-deckel-16-cm-3201115445
 *   diadem-plus-kochtopf-mit-deckel-24-cm-3201115477
 *   diadem-plus-bratentopf-mit-deckel-20-cm-3201115497
 *   diadem-plus-bratentopf-mit-deckel-24-cm-3201115498
 *   diadem-plus-topf-set-5-teilig-3201114738
 *
 * Ce sont des marmites, des cocottes et des ensembles. Aucune Bratpfanne, ni
 * en 24, ni en 28, ni en aucune autre taille. Une poele a frire qui n existe
 * pas au catalogue n a ni image ni EAN, et la garder revient a proposer un
 * article que le fabricant ne fabrique plus.
 *
 * Meme arbitrage que pour les gammes fantomes : la fiche reste en base avec son
 * historique, motif et source traces dans AuditLog.
 */

import { config as loadEnv } from 'dotenv'
import { PrismaClient } from '@prisma/client'
loadEnv({ path: '.env.local' })
const prisma = new PrismaClient()

const APPLIQUER = process.argv.includes('--appliquer')

const CANDIDATS = ['wmf-diadem-plus-bratpfanne-24cm', 'wmf-diadem-plus-bratpfanne-28cm']

const PREUVE =
  'Le sitemap officiel wmf.com liste douze produits « Diadem Plus » : ' +
  'un ensemble 10 pieces, quatre ensembles topf, une Stielkasserolle 16 cm, ' +
  'trois Kochtopf 16/20/24 cm et trois Bratentopf 16/20/24 cm. Aucune Bratpfanne, ' +
  'en aucune taille. Une poele a frire que le fabricant ne publie plus ' +
  'n a ni image ni EAN.'

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
