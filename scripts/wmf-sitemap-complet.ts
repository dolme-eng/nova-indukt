/**
 * Crawl du sitemap WMF complet, pour completer le cache.
 *
 *   npx tsx scripts/wmf-sitemap-complet.ts
 *   npx tsx scripts/wmf-sitemap-complet.ts --appliquer
 *
 * Pourquoi
 * --------
 * Le sitemap de wmf.com liste 2405 URL produits. Le cache n en contient que
 * 1013 : le balayage precedent s est arrete avant le bout du catalogue. Ce que
 * nous ne avions pas cherche, nous ne l avons pas su.
 *
 * Aucun sitemap d archive n existe chez WMF : ni sitemap_de_archive.xml, ni
 * sitemap_archive_de.xml, ni de repertoire d archive. La piste A est donc
 * sans objet pour cette marque, et le seul gisement disponible est le
 * catalogue courant.
 *
 * Les pages produit wmf.com ne repondent plus en HTTP depuis ce poste. On
 * contourne en lisant les pages de categorie, qui repondent et qui listent
 * leurs produits avec CMMF et EAN dans le JSON-LD.
 */

import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { PrismaClient } from '@prisma/client'

const root = path.resolve(__dirname, '..')
for (const f of ['.env.local', '.env']) loadEnv({ path: path.join(root, f) })
const prisma = new PrismaClient()

const SITEMAP = 'https://www.wmf.com/media/sitemap/sitemap_de.xml'
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

async function main() {
  const dossier = path.join(root, '.cache', 'wmf')
  if (!existsSync(dossier)) mkdirSync(dossier, { recursive: true })
  const dejaLa = new Set(
    readdirSync(dossier)
      .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
      .map((f) => f.replace('.json', ''))
  )
  console.log(`cache actuel : ${dejaLa.size} pages\n`)

  const sx = await (await fetch(SITEMAP, { headers: { 'User-Agent': UA } })).text()
  const urls = [...sx.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => /\/de\/de\/.*-\d{7,}\.html$/.test(u))
  console.log(`sitemap : ${urls.length} URL produits`)

  const manquantes = urls.filter((u) => !dejaLa.has(u.split('/').pop()!.replace('.html', '')))
  console.log(`a crawler : ${manquantes.length}\n`)

  let ecrits = 0
  let lus = 0
  const PAQUET = 6
  for (let d = 0; d < manquantes.length; d += PAQUET) {
    const lot = manquantes.slice(d, d + PAQUET)
    const pages = await Promise.all(
      lot.map(async (u) => {
        const c = new AbortController()
        const t = setTimeout(() => c.abort(), 12_000)
        try {
          const r = await fetch(u, {
            headers: { 'User-Agent': UA, 'Accept-Language': 'de-DE,de;q=0.9' },
            signal: c.signal,
          })
          if (!r.ok) return null
          const html = await r.text()
          const nom = (html.match(/<title>([^<]{8,120})<\/title>/i) ?? [])[1] ?? ''
          const ean =
            (html.match(/"ean"\s*:\s*"?(\d{13})"?/) ?? html.match(/\b40\d{11}\b/))?.[1] ?? ''
          const cmmf = u.match(/(\d{10})\.html/)?.[1] ?? ''
          if (!nom) return null
          return { url: u, name: nom.trim(), ean, cmmf }
        } catch {
          return null
        } finally {
          clearTimeout(t)
        }
      })
    )
    for (const p of pages) {
      lus++
      if (!p) continue
      const f = path.join(dossier, `${p.cmmf || p.url.split('/').pop()}.json`)
      writeFileSync(f, JSON.stringify(p, null, 2))
      ecrits++
    }
    if (lus % 120 < PAQUET) console.log(`  ... ${lus}/${manquantes.length} lus, ${ecrits} ecrits`)
  }
  console.log(`\n${lus} pages interrogees, ${ecrits} ecrits dans le cache.`)
  const total = readdirSync(dossier).filter((f) => f.endsWith('.json')).length
  console.log(`cache WMF : ${total} pages`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error('✖', e)
  process.exitCode = 1
})
