import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
const DOSS = path.join(process.cwd(), '.cache', 'weber')

async function main() {
  if (!existsSync(DOSS)) mkdirSync(DOSS, { recursive: true })
  const S =
    'https://www.weber.com/on/demandware.static/-/Sites-PRODUCTFEEDS/default/productfeeds/Sitemap/products-de.xml'
  const sm = await (await fetch(S, { headers: { 'User-Agent': UA } })).text()
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => u.includes('/DE/de/'))
  console.log(`${urls.length} URL produits Weber DE`)

  const faits: Record<string, string> = {}
  for (const f of readdirSync(DOSS)) {
    if (!f.endsWith('.json')) continue
    const j = JSON.parse(readFileSync(path.join(DOSS, f), 'utf8'))
    if (j.url) faits[j.url] = f.replace('.json', '')
  }
  console.log(`cache existant : ${Object.keys(faits).length}\n`)

  let ecrits = 0
  const PAQUET = 5
  for (let d = 0; d < urls.length; d += PAQUET) {
    const lot = urls.slice(d, d + PAQUET).filter((u) => !faits[u])
    const rs = await Promise.all(
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
          let nom = ''
          let image = ''
          for (const m of html.matchAll(
            /<script[^>]*application\/ld\+json[^>]*>([\s\S]{0,20000}?)<\/script>/gi
          )) {
            try {
              const j = JSON.parse(m[1])
              for (const it of Array.isArray(j) ? j : [j]) {
                if (!nom && it.name) nom = String(it.name)
                if (!image && it.image) image = String(it.image)
              }
            } catch {}
          }
          if (!image) {
            const og = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i)
            if (og) image = og[1]
          }
          if (!nom) {
            const og = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i)
            if (og) nom = og[1]
          }
          if (!nom && !image) return null
          return { url: u, name: nom, image }
        } catch {
          return null
        } finally {
          clearTimeout(t)
        }
      })
    )
    for (const p of rs) {
      if (!p?.name) continue
      // Les URL Weber portent une chaine de requete (?bkcoursecatid=...) qui
      // n entre pas dans un nom de fichier.
      const cle = p.url.split('?')[0].split('/').pop()!.replace('.html', '')
      const f = path.join(DOSS, `${cle}.json`)
      writeFileSync(f, JSON.stringify(p, null, 2))
      ecrits++
    }
    if (d % 100 < PAQUET) console.log(`  ... ${d}/${urls.length}, ${ecrits} ecrits`)
  }
  console.log(`\n${ecrits} pages Weber ecrites dans le cache.`)
}
main()
