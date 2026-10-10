/**
 * Suppression des fiches dont le produit n'existe pas chez le fabricant.
 *
 *   npx tsx scripts/supprimer-produits-obsoletes.ts           # rapport
 *   npx tsx scripts/supprimer-produits-obsoletes.ts --apply
 *
 * Règle appliquée : une fiche est désactivée quand le fabricant ne publie
 * aucun article correspondant — pas quand il le publie sous un autre nom ou
 * une autre taille. Un mauvais libellé se corrige, un produit fantôme se
 * retire.
 *
 * Ces fiches étaient en vente avec une image et un prix. Elles ne
 * correspondent à rien dans le catalogue du fabricant : impossible de les
 * foulancer, impossible de les réassurer, et un client qui compare les
 * trouve ailleurs sans explanation.
 *
 * Le prix n'est pas effacé : la fiche reste traçable, avec son historique
 * en base. Seuls isActive et un motif en AuditLog changent.
 */

import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const root = path.resolve(__dirname, '..')
for (const f of ['.env.local', '.env']) loadEnv({ path: path.join(root, f) })
const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')

type Candidat = { slug: string; motif: string; preuve: string }

const CANDIDATS: Candidat[] = [
  {
    slug: 'wmf-function-4-topfset-5teilig',
    motif: 'Doublon strict de wmf-function-4-topfset-5tlg.',
    preuve:
      'Les deux fiches portent le meme EAN 4000530720207 et la meme reference ' +
      'fabricant 8900547704 (Function 4 Topf-Vorteils-Set 5-teilig), avec une ' +
      'composition identique : Bratentopf 20 cm, Fleischtöpfe 16/20/24 cm, ' +
      'Stielkasserolle 16 cm. Deux fiches pour un seul article dégradent le ' +
      'catalogue et nous faisons nous-meme concurrence. On garde ' +
      '« wmf-function-4-topfset-5tlg », dont le libellé reprend le nom du ' +
      'fabricant, et on retire cette fiche. Même arbitrage que le doublon Intensa ' +
      '« 5tlg » / « 5teilig » traité plus haut.',
  },
  {
    slug: 'wmf-replacement-griff-set',
    motif: 'WMF ne vend aucun « Ersatzgriff-Set ».',
    preuve:
      'koempf24.de publie le Perfect Plus Griff en pièce unique à 82,62 EUR ' +
      'et la Kochsignal-Dichting Perfect à 9,49 EUR. Aucune page du cache ' +
      'wmf.com (1 013 articles) ne porte de « Ersatzgriff-Set ». Le concept de ' +
      'set de rechange n existe pas chez WMF : notre fiche à 17,99 EUR ne ' +
      'correspond à aucun produit.',
  },
  {
    slug: 'tefal-masterclass-contactgrill',
    motif: 'Tefal ne publie aucune série « Masterclass ».',
    preuve:
      'idealo ne recense que les OptiGrill : GC7058 (86,85–118,90 EUR, ' +
      '37 offres) et OptiGrill 4in1 GC776D10 (179,99 EUR). Aucun « Masterclass » ' +
      'dans la marque. Cinquième nom de gamme fantôme du catalogue, après ' +
      '« Adamant Plus », « Summit Plus », « Küchenmaxx » et « Spirit Messerset ».',
  },
  {
    slug: 'zwilling-spirit-messerset-3-teilig',
    motif: 'La série Spirit ne contient aucun couteau.',
    preuve:
      'zwilling.com affiche un GOURMET Messerset 3-tlg (36130-003-0) à ' +
      '79,99 EUR. Le Spirit est de la vaisselle inox sans lames. Une fiche ' +
      '« set de 3 lames » dans cette série est impossible : notre prix de ' +
      '149,99 EUR ne correspond à aucun article.',
  },
  {
    slug: 'zwilling-pro-s-schaerfmesser-18cm',
    motif: 'Zwilling ne fabrique pas d’affûteur 18 cm.',
    preuve:
      'zwilling.com et les 1 984 pages du cache ne proposent qu’un Wetzstahl ' +
      '(18, 21, 23, 26 cm) et un Schärfstab 15 cm. Aucune référence 18 cm. ' +
      'Notre fiche à 59,99 EUR porte une cote qui n’existe pas chez le fabricant.',
  },
  {
    slug: 'wmf-antihaft-reiniger',
    motif: 'Produit retiré du catalogue WMF.',
    preuve:
      'wmf.com ne vend plus d’« Antihaft-Reiniger » : les produits d’entretien ' +
      'actuels sont le Purargan (250 ml, EAN 4000530211040) et le Fusiontec ' +
      'Reinigungsmittel (250 ml, 14,99 EUR). Notre fiche à 15,00 EUR désigne ' +
      'un article hors catalogue.',
  },
]

async function main() {
  console.log(`\nProduits obsolètes — ${CANDIDATS.length} candidats\n`)

  let n = 0
  for (const c of CANDIDATS) {
    const p = await prisma.product.findUnique({
      where: { slug: c.slug },
      select: { slug: true, nameDe: true, brand: true, price: true, isActive: true },
    })
    if (!p) {
      console.log(`  ✗ ${c.slug} — introuvable en base`)
      continue
    }
    if (!p.isActive) {
      console.log(`  · ${c.slug} — déjà désactivé`)
      continue
    }

    console.log(`  ${p.brand} / ${p.slug}`)
    console.log(`      « ${p.nameDe} » — ${p.price.toFixed(2)} EUR`)
    console.log(`      motif   : ${c.motif}`)
    console.log(`      preuve  : ${c.preuve}\n`)

    if (!APPLY) continue

    await prisma.$transaction(async (tx) => {
      await tx.product.update({ where: { slug: c.slug }, data: { isActive: false } })
      await tx.auditLog.create({
        data: {
          entityType: 'Product',
          entityId: c.slug,
          action: 'DESACTIVER_PRODUIT_OBSOLETE',
          oldValues: { isActive: 'true', price: p.price.toString(), nameDe: p.nameDe },
          newValues: { isActive: 'false', motif: c.motif, preuve: c.preuve },
        },
      })
    })
    console.log('      ✓ désactivé\n')
    n++
  }

  console.log(`désactivés : ${n}`)
  if (!APPLY) console.log('Rien n’est écrit. Relisez, puis relancez avec --apply.')
  console.log(
    '\nCes fiches restent en base avec leur historique : rien n’est perdu, ' +
      'elles ne sont simplement plus vendues.'
  )
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
