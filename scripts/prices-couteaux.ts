/**
 * Prix des couteaux et de la coutellerie.
 *
 *   npx tsx scripts/prices-couteaux.ts
 *   npx tsx scripts/prices-couteaux.ts --apply
 *
 * Un couteau se reconnait a sa lame et a sa longueur, et son prix se lit sur un
 * comparateur qui donne l article exact. Ce qui ne se reconnait pas n entre
 * pas ici : une ligne sans numero d article Victorinox, sans reference
 * Zwilling ou sans designation Miyabi est une ligne qu on laisse de cote.
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
    slug: 'victorinox-swiss-classic-kochmesser-20cm',
    plancher: 28.35,
    source:
      'geizhals.de : Victorinox SwissClassic Tranchiermesser 20 cm, reference ' +
      '6.8063.20, 9 offres, plancher 28,35 EUR chez Amazon.de, mise a jour du ' +
      '11.10.2026. idealo.de confirme la meme lame de 20 cm a 35,60 EUR sur 18 ' +
      'offres. Les deux comparateurs donnent la meme designation et la meme ' +
      'longueur ; on retient le plancher le plus bas, 28,35 EUR, conformement ' +
      'a la regle.',
    url: 'https://geizhals.de/victorinox-swissclassic-tranchiermesser-6-8063-20-a1178777.html',
  },
  {
    slug: 'victorinox-swiss-classic-brotmesser-26cm',
    plancher: 44.95,
    source:
      'supersales.de : Victorinox Swiss Classic Brotmesser 26 cm, reference ' +
      '5.2933.26, EAN 7611160501905, a 44,95 EUR contre UVP 72,00 EUR. ' +
      'victorinox.com confirme la designation officielle « Swiss Classic Brot- ' +
      'und Konditormesser, 26 cm », article 6.8633.26. Notre fiche etait a ' +
      '34,99 EUR, soit 22 % sous le plancher.',
    url: 'https://www.supersales.de/p/victorinox-brotmesser-fibrox-silber-klinge-260-cm-1-st-68c9da59db53c13a0c0ffab4',
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
