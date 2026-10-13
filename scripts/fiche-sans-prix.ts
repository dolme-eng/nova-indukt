/**
 * Trois fiches qu on ne peut pas coter, et pourquoi.
 *
 *   npx tsx scripts/fiche-sans-prix.ts
 *
 * Ce sont des fiches dont le libelle ne permet pas de retrouver le bon article.
 * Ce n est pas un probleme de marche : c est une absence d identite. On ne les
 * touche pas, on les signale.
 */

import { config as loadEnv } from 'dotenv'
import { PrismaClient } from '@prisma/client'
loadEnv({ path: '.env.local' })
const prisma = new PrismaClient()

const CIBLES = [
  'ikea-mittled-induktionskochfeld-60cm',
  'aeg-induktionskochfeld-60cm',
  'neff-induktionskochfeld-60cm',
  'miele-cs-7612-fl-smartline-induktionskochfeld-domino',
]

const MOTIFS: Record<string, string> = {
  'ikea-mittled-induktionskochfeld-60cm':
    'MITTLED n est pas une plaque de cuisson. La seule reference allemande de ' +
    'cette designation est une reglette lumineuse pour plan de travail, ' +
    '60528584, a 22,00 EUR. Le mot « Mittled » designe chez IKEA des ' +
    'luminaires, pas des plaques. Notre fiche a 299,00 EUR pour un article ' +
    'qui n existe pas sous ce nom.',
  'aeg-induktionskochfeld-60cm':
    'Aucun modele dans le libelle. AEG publie des dizaines de plaques 60 cm : ' +
    'IB6420ACB, IKS6431AXB, IKB6431AXB, et leurs prix s etalent de 350 a ' +
    '600 EUR. Sans reference, un plancher lu ailleurs decrirait un autre ' +
    'appareil.',
  'neff-induktionskochfeld-60cm':
    'Aucun modele dans le libelle. Neff publie T58BT20N0, TBT5660N, T58TT20N0 ' +
    'et d autres, de 400 a 2 500 EUR. Meme raison que pour AEG.',
  'miele-cs-7612-fl-smartline-induktionskochfeld-domino':
    'Le modele est bon, mais le marche allemand est absent. Les 1 499 EUR ' +
    'viennent de geizhals.at, marketplace autrichienne, et les 1 619 EUR de ' +
    'miele.de sont un prix de vente directe, hors comparaison. Le seul autre ' +
    'tarif trouve est a Chypre. Un plancher autrichien ne remplace pas un ' +
    'plancher allemand.',
}

async function main() {
  console.log('')
  for (const slug of CIBLES) {
    const p = await prisma.product.findFirst({
      where: { slug },
      select: { slug: true, nameDe: true, price: true, isActive: true },
    })
    if (!p) continue
    console.log('='.repeat(74))
    console.log(`${p.slug}   ${Number(p.price).toFixed(2)} EUR${p.isActive ? '' : '  [inactive]'}`)
    console.log(`  ${p.nameDe}`)
    console.log(`  ${MOTIFS[slug] ?? ''}`)
    console.log('')
  }
}
main().finally(() => prisma.$disconnect())
