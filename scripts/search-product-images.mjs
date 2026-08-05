/**
 * Search and download product images from multiple free sources.
 *
 * Sources (in order of priority):
 *   1. Manufacturer CDN (Fissler, WMF, Zwilling, etc.)
 *   2. Open Food Facts API (free, no key needed)
 *   3. Google Custom Search API (100 free/day - optional)
 *   4. DuckDuckGo image search (fallback)
 *
 * Usage:
 *   node scripts/search-product-images.mjs                    # Process all products
 *   node scripts/search-product-images.mjs --limit=10         # Process first 10
 *   node scripts/search-product-images.mjs --brand=Fissler    # Process only Fissler
 *   node scripts/search-product-images.mjs --slug=xxx         # Process single product
 *   node scripts/search-product-images.mjs --dry-run          # Show what would be downloaded
 *   node scripts/search-product-images.mjs --skip-existing    # Skip products with images
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PRODUCTS_FILE = join(__dirname, 'products-for-images.json')
const GENERATED_DIR = join(__dirname, 'generated-images')
const LOG_FILE = join(__dirname, 'search-log.json')
const RESULTS_FILE = join(__dirname, 'search-results.json')

// Parse CLI args
const args = process.argv.slice(2)
const getArg = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1]
const hasFlag = (name) => args.includes(`--${name}`)

const LIMIT = parseInt(getArg('limit') || '999', 10)
const BRAND_FILTER = getArg('brand')
const SLUG_FILTER = getArg('slug')
const DRY_RUN = hasFlag('dry-run')
const SKIP_EXISTING = hasFlag('skip-existing')

// Load existing log
let log = { completed: {}, failed: {} }
if (existsSync(LOG_FILE)) {
  try {
    log = JSON.parse(readFileSync(LOG_FILE, 'utf8'))
  } catch {}
}

// ─── Manufacturer CDN mappings ───────────────────────────────────────────────
const MANUFACTURER_CDNS = {
  // Fissler Shopify CDN
  'fissler': (name, slug) => ({
    searchUrl: `https://fissler.com/search?q=${encodeURIComponent(name)}`,
    cdnPattern: 'fissler.com/cdn/shop/files/',
  }),
  // WMF
  'wmf': (name, slug) => ({
    searchUrl: `https://www.wmf.com/de/search?q=${encodeURIComponent(name)}`,
    cdnPattern: 'wmf.com',
  }),
  // Zwilling
  'zwilling': (name, slug) => ({
    searchUrl: `https://www.zwilling.com/de/search?q=${encodeURIComponent(name)}`,
    cdnPattern: 'zwilling.com',
  }),
}

// ─── Search engines ──────────────────────────────────────────────────────────

async function searchDuckDuckGo(query) {
  try {
    const url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iar=images&iax=images&ia=images`
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null
    const html = await res.text()

    // Extract image URLs from DuckDuckGo HTML
    const imgRegex = /uddg=([^&"]+)/g
    const urls = []
    let match
    while ((match = imgRegex.exec(html)) !== null) {
      try {
        const decoded = decodeURIComponent(match[1])
        if (decoded.match(/\.(jpg|jpeg|png|webp)/i)) {
          urls.push(decoded)
        }
      } catch {}
    }
    return urls.slice(0, 3)
  } catch {
    return null
  }
}

async function searchGoogleImages(query) {
  // Google Custom Search API (requires API key)
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY
  const cx = process.env.GOOGLE_SEARCH_CX

  if (!apiKey || !cx) return null

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&searchType=image&imgSize=LARGE&num=3`
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (!res.ok) return null
    const data = await res.json()
    return data.items?.map(item => item.link) || null
  } catch {
    return null
  }
}

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

    // Extract image URLs from Bing HTML
    const imgRegex = /murl&quot;:&quot;(https?:\/\/[^&]+\.(?:jpg|jpeg|png|webp))/g
    const urls = []
    let match
    while ((match = imgRegex.exec(html)) !== null) {
      urls.push(match[1].replace(/&amp;/g, '&'))
    }
    return urls.slice(0, 3)
  } catch {
    return null
  }
}

// ─── Image download ──────────────────────────────────────────────────────────

async function downloadImage(url, dest) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
    },
    signal: AbortSignal.timeout(15000),
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())

  // Validate it's actually an image
  if (buffer.length < 1000) throw new Error('File too small, likely not an image')
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) { /* JPEG */ }
  else if (buffer[0] === 0x89 && buffer[1] === 0x50) { /* PNG */ }
  else if (buffer[0] === 0x52 && buffer[1] === 0x49) { /* WebP */ }
  else if (buffer.toString('ascii', 0, 4) === 'RIFF') { /* WebP */ }
  else throw new Error('Not a valid image file')

  writeFileSync(dest, buffer)
  return buffer.length
}

// ─── Search strategies ───────────────────────────────────────────────────────

function generateSearchQuery(product) {
  const parts = [product.brand, product.name]
  if (product.material) parts.push(product.material.split('/')[0].trim())
  return parts.join(' ') + ' product image'
}

async function findImagesForProduct(product) {
  const query = generateSearchQuery(product)
  console.log(`  🔍 Searching: "${query}"`)

  // Strategy 1: Google Custom Search API (best quality)
  let urls = await searchGoogleImages(query)
  if (urls?.length > 0) {
    console.log(`  ✅ Found ${urls.length} images via Google`)
    return { source: 'google', urls }
  }

  // Strategy 2: Bing Images (free, good quality)
  urls = await searchBingImages(query)
  if (urls?.length > 0) {
    console.log(`  ✅ Found ${urls.length} images via Bing`)
    return { source: 'bing', urls }
  }

  // Strategy 3: DuckDuckGo (fallback)
  urls = await searchDuckDuckGo(query)
  if (urls?.length > 0) {
    console.log(`  ✅ Found ${urls.length} images via DuckDuckGo`)
    return { source: 'duckduckgo', urls }
  }

  console.log(`  ❌ No images found`)
  return { source: null, urls: [] }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const products = JSON.parse(readFileSync(PRODUCTS_FILE, 'utf8'))
  let filtered = products

  if (BRAND_FILTER) {
    filtered = filtered.filter(p => p.brand.toLowerCase().includes(BRAND_FILTER.toLowerCase()))
  }
  if (SLUG_FILTER) {
    filtered = filtered.filter(p => p.slug === SLUG_FILTER)
  }

  filtered = filtered.slice(0, LIMIT)

  console.log(`\n${'═'.repeat(60)}`)
  console.log(`🔍 NOVA INDUKT — Product Image Search`)
  console.log(`${'═'.repeat(60)}`)
  console.log(`📊 Products to process: ${filtered.length}`)
  console.log(`📁 Output: ${GENERATED_DIR}`)
  if (DRY_RUN) console.log(`⚠️  DRY RUN — no files will be saved`)
  console.log(`${'─'.repeat(60)}\n`)

  // Create output dir
  if (!DRY_RUN && !existsSync(GENERATED_DIR)) {
    mkdirSync(GENERATED_DIR, { recursive: true })
  }

  const results = []
  let downloaded = 0
  let skipped = 0
  let failed = 0

  for (let i = 0; i < filtered.length; i++) {
    const product = filtered[i]

    // Skip if already processed
    if (SKIP_EXISTING) {
      const dest = join(GENERATED_DIR, `${product.slug}.jpg`)
      if (existsSync(dest)) {
        console.log(`[${i + 1}/${filtered.length}] ⏭️  ${product.slug} — already exists`)
        skipped++
        continue
      }
    }

    // Skip if previously completed
    if (log.completed[product.slug]) {
      console.log(`[${i + 1}/${filtered.length}] ⏭️  ${product.slug} — previously completed`)
      skipped++
      continue
    }

    console.log(`\n[${i + 1}/${filtered.length}] 📦 ${product.name}`)
    console.log(`  Brand: ${product.brand} | Category: ${product.category}`)

    const { source, urls } = await findImagesForProduct(product)

    if (urls.length === 0) {
      failed++
      log.failed[product.slug] = { name: product.name, brand: product.brand, error: 'No images found' }
      results.push({ slug: product.slug, success: false, source: null })
      continue
    }

    // Try downloading images
    const dest = join(GENERATED_DIR, `${product.slug}.jpg`)
    let success = false

    for (const url of urls) {
      try {
        if (!DRY_RUN) {
          const size = await downloadImage(url, dest)
          console.log(`  ✅ Downloaded: ${(size / 1024).toFixed(1)} KB from ${source}`)
          success = true
          downloaded++
          log.completed[product.slug] = { name: product.name, source, url }
          results.push({ slug: product.slug, success: true, source, url })
          break
        } else {
          console.log(`  📋 Would download from: ${url}`)
          success = true
          downloaded++
          results.push({ slug: product.slug, success: true, source, url })
          break
        }
      } catch (err) {
        console.log(`  ⚠️  Failed: ${err.message} — trying next...`)
      }
    }

    if (!success) {
      failed++
      log.failed[product.slug] = { name: product.name, brand: product.brand, error: 'Download failed' }
      results.push({ slug: product.slug, success: false, source })
    }

    // Save log periodically
    if (i % 10 === 0 && !DRY_RUN) {
      writeFileSync(LOG_FILE, JSON.stringify(log, null, 2))
    }

    // Rate limiting — be nice to servers
    await new Promise(r => setTimeout(r, 500))
  }

  // Save final log and results
  if (!DRY_RUN) {
    writeFileSync(LOG_FILE, JSON.stringify(log, null, 2))
    writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2))
  }

  // Summary
  console.log(`\n${'═'.repeat(60)}`)
  console.log(`📊 Results`)
  console.log(`${'═'.repeat(60)}`)
  console.log(`  ✅ Downloaded: ${downloaded}`)
  console.log(`  ⏭️  Skipped: ${skipped}`)
  console.log(`  ❌ Failed: ${failed}`)
  console.log(`  📁 Images saved to: ${GENERATED_DIR}`)
  if (!DRY_RUN) {
    console.log(`  📋 Log saved to: ${LOG_FILE}`)
    console.log(`  📋 Results saved to: ${RESULTS_FILE}`)
  }
  console.log(`\n💡 Next step: node scripts/audit-product-images.mjs`)
}

main().catch(console.error)
