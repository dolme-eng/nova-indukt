/**
 * Export du catalogue depuis les seeds du depot, quand la base est injoignable.
 *
 *   npx tsx scripts/export-catalogue-local.ts > catalogue.json
 *
 * Pourquoi
 * --------
 * Neon refuse toute connexion sur le projet (quota Free plan epuise). Les
 * scripts de rapprochement ont besoin de la liste des fiches, pas de la base.
 * Les seeds du depot portent les memes slugs et les memes noms, dans le meme
 * langage que le catalogue.
 *
 * Ce que ce fichier n'est pas
 * --------------------------
 * L'etat de la base. Un seed est une intention de saisie, pas la realite :
 * il ignore lesArticles desactives depuis, les 34 retraits, et les 17
 * renommages. Les resultats produits a partir d ici sont donc un
 * rapprochement en lecture seule sur les donnees du depot, et ne doivent etre
 * appliques qu'apres confrontation a la base revenue.
 */

import path from 'node:path'
import { readdirSync, readFileSync } from 'node:fs'

const root = path.resolve(__dirname, '..')
const dossier = path.join(root, 'prisma')

export type Fiche = { slug: string; name: string; brand: string; ean: string | null }

const BRANDS = ['wmf', 'zwilling', 'fissler', 'tefal', 'demeyere', 'staub', 'lodge']

export function lireSeeds(): Fiche[] {
  const out: Fiche[] = []
  const vus = new Set<string>()

  for (const f of readdirSync(dossier)) {
    if (!f.startsWith('seed-') || !f.endsWith('.ts')) continue
    const src = readFileSync(path.join(dossier, f), 'utf8')

    // Chaque produit est un objet avec slug, nameDe ou name, et brand.
    // On decoupe sur `slug:` puis on lit les champs voisins.
    for (const m of src.matchAll(/slug:\s*'([^']+)'/g)) {
      const slug = m[1]
      if (vus.has(slug)) continue
      const debut = Math.max(0, (m.index ?? 0) - 700)
      const fenetre = src.slice(debut, (m.index ?? 0) + 700)
      const nom = fenetre.match(/(?:nameDe|name):\s*'([^']*)'/)?.[1] ?? ''
      const marque = fenetre.match(/brand:\s*'([^']*)'/)?.[1] ?? slug.split('-')[0]
      const ean = fenetre.match(/ean:\s*'(\d{13})'/)?.[1] ?? null
      if (!nom) continue
      vus.add(slug)
      out.push({ slug, name: nom, brand: marque, ean })
    }
  }
  return out
}

if (require.main === module) {
  const fiches = lireSeeds()
  const wmf = fiches.filter((f) => f.brand.toLowerCase() === 'wmf' || f.slug.startsWith('wmf-'))
  console.error(
    `export : ${fiches.length} fiches au total, dont ${wmf.length} WMF, ${fiches.filter((f) => BRANDS.includes(f.brand.toLowerCase())).length} sur les marques principales`
  )
  console.log(JSON.stringify(fiches))
}
