/**
 * Search for ADDITIONAL product images (2nd and 3rd) to reach 3 per product.
 *
 * Reads existing upload-log.json to know which products already have images,
 * then searches for more images with different search queries.
 *
 * Usage:
 *   node scripts/search-additional-images.mjs                    # All products needing images
 *   node scripts/search-additional-images.mjs --limit=20         # Process first 20
 *   node scripts/search-additional-images.mjs --need=2           # Only products needing 2 more
 *   node scripts/search-additional-images.mjs --dry-run          # Show what would be searched
 */
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PRODUCTS_FILE = join(__dirname, 'products-for-images.json')
const GENERATED_DIR = join(__dirname, 'generated-images')
const UPLOAD_LOG_FILE = join(__dirname, 'upload-log.json')
const SEARCH_LOG_FILE = join(__dirname, 'search-log.json')
const RESULTS_FILE = join(__dirname, 'search-additional-results.json')

// Parse CLI args
const args = process.argv.slice(2)
const getArg = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1]
const hasFlag = (name) => args.includes(`--${name}`)

const LIMIT = parseInt(getArg('limit') || '999', 10)
const DRY_RUN = hasFlag('dry-run')
const NEED_FILTER = parseInt(getArg('need') || '0', 10)

// ─── Load data ───────────────────────────────────────────────────────────────

const products = JSON.parse(readFileSync(PRODUCTS_FILE, 'utf8'))
let uploadLog = {}
if (existsSync(UPLOAD_LOG_FILE)) {
  try { uploadLog = JSON.parse(readFileSync(UPLOAD_LOG_FILE, 'utf8')) } catch {}
}
let searchLog = {}
if (existsSync(SEARCH_LOG_FILE)) {
  try { searchLog = JSON.parse(readFileSync(SEARCH_LOG_FILE, 'utf8')) } catch {}
}

// ─── Determine products needing more images ──────────────────────────────────

function getImagesNeeded(product) {
  const currentCount = product.currentImages.length
  const hasUpload = uploadLog[product.slug] ? 1 : 0
  const total = currentCount + hasUpload
  return Math.max(0, 3 - total)
}

const needsMore = products
  .map(p => ({
    ...p,
    imagesNeeded: getImagesNeeded(p),
    currentCount: p.currentImages.length + (uploadLog[p.slug] ? 1 : 0),
  }))
  .filter(p => p.imagesNeeded > 0)
  .filter(p => NEED_FILTER === 0 || p.imagesNeeded === NEED_FILTER)
  .sort((a, b) => b.imagesNeeded - a.imagesNeeded)
  .slice(0, LIMIT)

// ─── Search engines ──────────────────────────────────────────────────────────

async function searchBingImages(query) {
  try {
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&qft=+filterui:imagesize-wallpaper&form=IRFLTR`
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null
    const html = await res.text()

    const imgRegex = /murl&quot;:&quot;(https?:\/\/[^&]+\.(?:jpg|jpeg|png|webp))/g
    const urls = []
    let match
    while ((match = imgRegex.exec(html)) !== null) {
      urls.push(match[1].replace(/&amp;/g, '&'))
    }
    return urls
  } catch {
    return null
  }
}

async function searchDuckDuckGo(query) {
  try {
    const url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iar=images&iax=images&ia=images`
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null
    const html = await res.text()

    const imgRegex = /uddg=([^&"]+)/g
    const urls = []
    let match
    while ((match = imgRegex.exec(html)) !== null) {
      try {
        const decoded = decodeURIComponent(match[1])
        if (decoded.match(/\.(jpg|jpeg|png|webp)/i)) urls.push(decoded)
      } catch {}
    }
    return urls
  } catch {
    return null
  }
}

// ─── Image download ──────────────────────────────────────────────────────────

async function downloadImage(url, dest) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
    },
    signal: AbortSignal.timeout(15000),
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  if (buffer.length < 1000) throw new Error('File too small')

  const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50
  const isWebP = buffer.toString('ascii', 0, 4) === 'RIFF'
  if (!isJpeg && !isPng && !isWebP) throw new Error('Not a valid image')

  writeFileSync(dest, buffer)
  return buffer.length
}

// ─── Generate search queries ─────────────────────────────────────────────────

function generateSearchQueries(product) {
  const base = `${product.brand} ${product.name}`
  return [
    `${base} product photo`,
    `${base} kitchen ${product.category}`,
    `${base} ${product.material?.split('/')[0] || ''} detail`,
    `${base} cookware official`,
    `${base} indution ${product.dimensions || ''}`,
  ]
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n${'═'.repeat(60)}`)
  console.log(`🔍 SEARCH ADDITIONAL PRODUCT IMAGES`)
  console.log(`${'═'.repeat(60)}`)
  console.log(`📊 Products needing more images: ${needsMore.length}`)
  const totalNeeded = needsMore.reduce((sum, p) => sum + p.imagesNeeded, 0)
  console.log(`🖼️  Total images to find: ${totalNeeded}`)
  if (DRY_RUN) console.log(`⚠️  DRY RUN — no files will be saved`)
  console.log(`${'─'.repeat(60)}\n`)

  if (!DRY_RUN && !existsSync(GENERATED_DIR)) {
    const { mkdirSync } = await import('fs')
    mkdirSync(GENERATED_DIR, { recursive: true })
  }

  let downloaded = 0
  let failed = 0
  const results = []

  for (let i = 0; i < needsMore.length; i++) {
    const product = needsMore[i]
    console.log(`\n[${i + 1}/${needsMore.length}] 📦 ${product.name}`)
    console.log(`  Current: ${product.currentCount} images | Need: ${product.imagesNeeded} more`)

    const queries = generateSearchQueries(product)
    let imagesFound = 0

    for (const query of queries) {
      if (imagesFound >= product.imagesNeeded) break

      console.log(`  🔍 Searching: "${query.substring(0, 60)}..."`)

      let urls = await searchBingImages(query)
      if (!urls || urls.length === 0) {
        urls = await searchDuckDuckGo(query)
      }

      if (!urls || urls.length === 0) {
        console.log(`  ❌ No results`)
        continue
      }

      console.log(`  ✅ Found ${urls.length} candidate images`)

      for (const url of urls) {
        if (imagesFound >= product.imagesNeeded) break

        const imgIndex = product.currentCount + imagesFound + 1
        const filename = `${product.slug}-${imgIndex}.jpg`
        const dest = join(GENERATED_DIR, filename)

        try {
          if (!DRY_RUN) {
            const size = await downloadImage(url, dest)
            console.log(`  ✅ Downloaded ${filename} (${(size / 1024).toFixed(1)} KB)`)
            imagesFound++
            downloaded++

            if (!searchLog[product.slug]) searchLog[product.slug] = []
            searchLog[product.slug].push({ index: imgIndex, url, filename })

            await new Promise(r => setTimeout(r, 400))
          } else {
            console.log(`  📋 Would download: ${filename}`)
            imagesFound++
            downloaded++
          }
        } catch (err) {
          // silently try next
        }
      }
    }

    if (imagesFound < product.imagesNeeded) {
      console.log(`  ⚠️  Only found ${imagesFound}/${product.imagesNeeded} images`)
    }

    results.push({
      slug: product.slug,
      name: product.name,
      needed: product.imagesNeeded,
      found: imagesFound,
    })

    // Save logs periodically
    if (i % 10 === 0 && !DRY_RUN) {
      writeFileSync(SEARCH_LOG_FILE, JSON.stringify(searchLog, null, 2))
    }
  }

  // Save final logs
  if (!DRY_RUN) {
    writeFileSync(SEARCH_LOG_FILE, JSON.stringify(searchLog, null, 2))
    writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2))
  }

  // Summary
  console.log(`\n${'═'.repeat(60)}`)
  console.log(`📊 Results`)
  console.log(`${'═'.repeat(60)}`)
  console.log(`  ✅ Downloaded: ${downloaded}`)
  console.log(`  ❌ Failed: ${failed}`)
  console.log(`  📁 Images saved to: ${GENERATED_DIR}`)
  console.log(`\n💡 Next: node scripts/auto-accept-images.mjs`)
}

main().catch(console.error)
