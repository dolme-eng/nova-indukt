/**
 * Etat des fiches d une marque Shopify face au catalogue en ligne.
 *
 *   npx tsx scripts/shopify-etat.ts --domaine fissler.com --marque Fissler
 *
 * Ecrit en TypeScript plutot qu en PowerShell : les commandes shell de
 *.tests en rafale ont casse la variable de catalogue et produit un « 0
 * presents sur 24 » qui ne voulait rien dire. Un resultat qui ne repose sur
 * rien n est pas un resultat.
 *
 * Pose la question utile : nos fiches existent-elles encore au catalogue, et
 * pour celles qui existent, quel est l EAN ?
 */

import { config as loadEnv } from 'dotenv'
import { PrismaClient } from '@prisma/client'
loadEnv({ path: '.env.local' })
const prisma = new PrismaClient()

const argN = (n: string, d = '') => {
  const i = process.argv.indexOf(n)
  return i > -1 ? process.argv[i + 1] : d
}
const DOMAINE = argN('--domaine', 'fissler.com')
const MARQUE = argN('--marque', 'Fissler')
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

type P = { handle: string; title: string; ean: string }

async function main() {
  const produits: P[] = []
  const vus = new Set<string>()

  for (let page = 1; page <= 8; page++) {
    const suffixe = page === 1 ? '' : `&page=${page}`
    let r: Response
    try {
      r = await fetch(`https://${DOMAINE}/products.json?limit=250${suffixe}`, {
        headers: { 'User-Agent': UA, 'Accept-Language': 'de-DE,de;q=0.9' },
      })
    } catch {
      break
    }
    if (!r.ok) {
      console.log(`  page ${page} refusee : HTTP ${r.status}`)
      break
    }
    const j = (await r.json()) as { products?: unknown[] }
    if (!j.products?.length) break
    let n = 0
    for (const p of j.products as {
      handle: string
      title: string
      variants?: { barcode?: string | null }[]
    }[]) {
      if (vus.has(p.handle)) continue
      vus.add(p.handle)
      n++
      const eans = [
        ...new Set(
          (p.variants ?? [])
            .map((v) => (v.barcode ?? '').trim())
            .filter((c) => /^40\d{11}$/.test(c))
        ),
      ]
      produits.push({ handle: p.handle, title: p.title, ean: eans.length === 1 ? eans[0] : '' })
    }
    if (!n) break
  }

  // Garde-fou : un catalogue vide ou anormalement petit signifie que la
  // requete a echoue, pas que tout a disparu du marche.
  if (produits.length < 20) {
    console.log(
      `\nECHEC DE LECTURE : ${produits.length} produits recus sur ${DOMAINE}.\n` +
        `Un catalogue aussi vide ne veut pas dire que nos 24 fiches ont disparu :\n` +
        `il veut dire que la requete n a pas abouti. Aucun verdict sur ce lot.`
    )
    return
  }
  console.log(`\n${DOMAINE} : ${produits.length} produits au catalogue\n`)

  const parPrefixe = new Map<string, P[]>()
  for (const p of produits) {
    const h = p.handle.toLowerCase()
    for (let i = 6; i <= h.length; i++) {
      const cle = h.slice(0, i)
      if (!parPrefixe.has(cle)) parPrefixe.set(cle, [])
      parPrefixe.get(cle)!.push(p)
    }
  }

  const fiches = await prisma.product.findMany({
    where: { brand: MARQUE, isActive: true, ean: null },
    select: { slug: true, nameDe: true },
    orderBy: { slug: 'asc' },
  })

  let presents = 0
  let absents = 0
  const lignes: string[] = []
  for (const f of fiches) {
    const slug = f.slug.toLowerCase()
    const exact = produits.find((p) => p.handle.toLowerCase() === slug)
    const cand = exact ?? (parPrefixe.get(slug) ?? []).filter((p) => p.ean)[0]
    if (cand) {
      presents++
      lignes.push(
        `  PRESENT ${f.slug.padEnd(44)} ${cand.ean || '(pas d EAN)'}  ${cand.title.slice(0, 40)}`
      )
    } else {
      absents++
      lignes.push(`  ABSENT  ${f.slug}`)
    }
  }
  console.log(lignes.join('\n'))
  console.log(`\n${presents} presents, ${absents} absents du catalogue ${MARQUE} en ligne.`)
  console.log(
    `Un produit absent du catalogue n est pas un produit qui n existe plus :\n` +
      `il est seulement sorti de l offre. Cela justifie une verification, pas une suppression.`
  )
}
main()
  .catch((e) => console.error('✖', e))
  .finally(() => prisma.$disconnect())
