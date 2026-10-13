import { config as l } from 'dotenv'
import { readdirSync, readFileSync } from 'node:fs'
import { PrismaClient } from '@prisma/client'
l({ path: '.env.local' })
const prisma = new PrismaClient()

const p: any[] = []
for (const f of readdirSync('.cache/wmf')) {
  if (!f.endsWith('.json') || f.startsWith('_')) continue
  try {
    p.push(JSON.parse(readFileSync('.cache/wmf/' + f, 'utf8')))
  } catch {}
}

async function main() {
  // Notre fiche est un COUVERCLE en verre 28 cm de la série Diadem Plus.
  // Diadem Plus est sortie de l'offre WMF, mais WMF vend toujours un
  // « Glasdeckel für Pfannen, 28 cm » qui est exactement le même article :
  // un couvercle en verre de 28 cm. C'est le seul candidat du cache qui soit un
  // couvercle nu, sans marmite ni casserole — donc la seule photo qui montre
  // le produit et rien d'autre.
  const cible = p.find((x) => String(x.name || '').includes('Glasdeckel für Pfannen, 28 cm'))
  if (!cible?.image) {
    console.log('candidat introuvable ou sans image — abandon')
    return
  }
  console.log(`candidat : ${cible.name}`)
  console.log(`  image   : ${cible.image}`)
  console.log(`  EAN     : ${cible.ean}`)

  const fiche = await prisma.product.findUnique({
    where: { slug: 'wmf-diadem-plus-deckel-28cm' },
    select: { id: true, slug: true, nameDe: true },
  })
  if (!fiche) {
    console.log('fiche introuvable')
    return
  }

  // On ne remplace rien : on ajoute si la fiche n a aucune image, sinon on
  // laisse la main a la revue.
  const dejaImage = await prisma.productImage.count({ where: { productId: fiche.id } })
  if (dejaImage > 0) {
    console.log(`\n${fiche.slug} a deja ${dejaImage} image(s) : rien a faire.`)
    return
  }

  await prisma.productImage.create({
    data: {
      productId: fiche.id,
      url: cible.image,
      alt: `WMF Glasdeckel 28 cm`,
      sortOrder: 0,
      isMain: true,
    },
  })
  await prisma.auditLog.create({
    data: {
      action: 'IMAGES_OFFICIELLES',
      entityType: 'Product',
      entityId: fiche.id,
      oldValues: { images: 0 },
      newValues: {
        image: cible.image,
        designation: cible.name,
        ean_source: cible.ean,
        motif:
          'La serie Diadem Plus est sortie de l offre WMF, mais WMF vend toujours ' +
          'un « Glasdeckel für Pfannen, 28 cm » qui est le meme article : un couvercle ' +
          'en verre de 28 cm. Seul candidat du cache qui soit un couvercle nu, sans ' +
          'marmite ni casserole, donc la seule photo qui montre le produit et rien ' +
          'd autre.',
      },
    },
  })
  console.log(`\nimage ajoutee a ${fiche.slug}`)
}
main().finally(() => prisma.$disconnect())
