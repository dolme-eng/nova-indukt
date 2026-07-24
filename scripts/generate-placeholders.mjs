/**
 * Generate professional placeholder images for products missing real photos.
 *
 * Usage:
 *   node scripts/generate-placeholders.mjs                  # all missing
 *   node scripts/generate-placeholders.mjs --brand=WMF      # single brand
 *   node scripts/generate-placeholders.mjs --dry-run        # preview only
 *   node scripts/generate-placeholders.mjs --limit=10       # first N products
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const PRODUCTS_DIR = path.join(ROOT, 'public', 'images', 'products')

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=')
    return [k, v ?? true]
  })
)

const DRY_RUN = !!args['dry-run']
const BRAND_FILTER = args.brand || null
const LIMIT = args.limit ? parseInt(args.limit) : Infinity

const WIDTH = 800
const HEIGHT = 800

// ── SVG icon silhouettes per category ────────────────────────────────────────

const CATEGORY_ICONS = {
  pfannen: `<path d="M200 420 Q200 380 250 360 L550 360 Q600 380 600 420 L600 440 Q600 460 550 470 L250 470 Q200 460 200 440 Z" fill="none" stroke="#d1d5db" stroke-width="3"/>
    <line x1="600" y1="400" x2="720" y2="400" stroke="#d1d5db" stroke-width="4" stroke-linecap="round"/>`,
  toepfe: `<path d="M220 340 Q220 300 280 280 L520 280 Q580 300 580 340 L580 480 Q580 500 540 510 L260 510 Q220 500 220 480 Z" fill="none" stroke="#d1d5db" stroke-width="3"/>
    <path d="M260 280 Q260 250 300 240 L500 240 Q540 250 540 280" fill="none" stroke="#d1d5db" stroke-width="3"/>
    <line x1="580" y1="400" x2="680" y2="400" stroke="#d1d5db" stroke-width="4" stroke-linecap="round"/>`,
  messer: `<path d="M400 200 L400 520" stroke="#d1d5db" stroke-width="3"/>
    <path d="M400 200 Q420 220 430 280 L430 380 Q430 400 400 410 Q370 400 370 380 L370 280 Q380 220 400 200 Z" fill="none" stroke="#d1d5db" stroke-width="3"/>
    <rect x="385" y="410" width="30" height="110" rx="4" fill="none" stroke="#d1d5db" stroke-width="3"/>`,
  bestecke: `<line x1="340" y1="220" x2="340" y2="520" stroke="#d1d5db" stroke-width="3" stroke-linecap="round"/>
    <line x1="400" y1="200" x2="400" y2="520" stroke="#d1d5db" stroke-width="3" stroke-linecap="round"/>
    <line x1="460" y1="220" x2="460" y2="520" stroke="#d1d5db" stroke-width="3" stroke-linecap="round"/>
    <circle cx="340" cy="220" r="8" fill="none" stroke="#d1d5db" stroke-width="2"/>
    <path d="M395 200 Q400 190 405 200 L405 260 Q400 270 395 260 Z" fill="none" stroke="#d1d5db" stroke-width="2"/>`,
  default: `<circle cx="400" cy="380" r="120" fill="none" stroke="#d1d5db" stroke-width="3" stroke-dasharray="8 4"/>
    <path d="M360 380 L400 340 L440 380 L420 380 L420 420 L380 420 L380 380 Z" fill="none" stroke="#d1d5db" stroke-width="2"/>`,
}

function getCategoryIcon(productName, folder) {
  const lower = (productName + ' ' + folder).toLowerCase()
  if (/pfanne|crepe|grill|sauter/.test(lower)) return CATEGORY_ICONS.pfannen
  if (/topf|kasserol|kochtopf|bräter|dampf|schnellkoch|sauteuse/.test(lower)) return CATEGORY_ICONS.toepfe
  if (/messer|schärf|keramikmesser|kleinmesser|bbq-messer/.test(lower)) return CATEGORY_ICONS.messer
  if (/besteck|löffel|gabel|messer-set|messerset/.test(lower)) return CATEGORY_ICONS.bestecke
  return CATEGORY_ICONS.default
}

function wrapText(text, maxChars) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const word of words) {
    if ((line + ' ' + word).trim().length > maxChars) {
      if (line) lines.push(line.trim())
      line = word
    } else {
      line = line ? line + ' ' + word : word
    }
  }
  if (line) lines.push(line.trim())
  return lines
}

function generateSvg(product) {
  const icon = getCategoryIcon(product.name, product.folder)
  const nameLines = wrapText(product.name, 30)
  const brandLines = wrapText(product.brand, 30)

  const nameY = 400 - nameLines.length * 12
  const nameSvg = nameLines.map((line, i) =>
    `<text x="400" y="${nameY + i * 28}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="700" fill="#1f2937" letter-spacing="-0.5">${escapeXml(line)}</text>`
  ).join('\n    ')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fafafa"/>
      <stop offset="100%" stop-color="#f3f4f6"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4ECCA3"/>
      <stop offset="100%" stop-color="#3BA88A"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>

  <!-- Subtle border -->
  <rect x="1" y="1" width="${WIDTH - 2}" height="${HEIGHT - 2}" rx="16" fill="none" stroke="#e5e7eb" stroke-width="1"/>

  <!-- Top accent line -->
  <rect x="0" y="0" width="${WIDTH}" height="4" rx="2" fill="url(#accent)"/>

  <!-- Category icon (centered, slightly above middle) -->
  <g transform="translate(0, -80)">
    ${icon}
  </g>

  <!-- Brand name -->
  <text x="400" y="${HEIGHT - 120}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#9CA3AF" letter-spacing="3" text-transform="uppercase">${escapeXml(brandLines.join(' '))}</text>

  <!-- Product name -->
  ${nameSvg}

  <!-- NOVA INDUKT watermark -->
  <text x="400" y="${HEIGHT - 50}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="500" fill="#D1D5DB" letter-spacing="1">NOVA INDUKT</text>

  <!-- Placeholder badge -->
  <rect x="300" y="${HEIGHT - 80}" width="200" height="20" rx="10" fill="#f3f4f6" stroke="#e5e7eb" stroke-width="1"/>
  <text x="400" y="${HEIGHT - 66}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="600" fill="#9CA3AF" letter-spacing="1">PLATZHALTER</text>
</svg>`
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

// ── Seed file parser ─────────────────────────────────────────────────────────

function parseSeedFiles() {
  const seedDir = path.join(ROOT, 'prisma')
  const files = fs.readdirSync(seedDir).filter(f =>
    f.startsWith('seed-') && f.endsWith('.ts') &&
    !f.includes('all') && !f.includes('categories') &&
    !f.includes('blog') && !f.includes('cleanup') &&
    !f.includes('helpers')
  )

  const products = []
  for (const file of files) {
    const content = fs.readFileSync(path.join(seedDir, file), 'utf8')

    const objectRe = /\{[^{}]*?(?:folder:\s*['"`][^'"`]+['"`][^{}]*?imageFiles:\s*\[[^\]]+\][^{}]*?|imageFiles:\s*\[[^\]]+\][^{}]*?folder:\s*['"`][^'"`]+['"`][^{}]*?)\}/gs

    let objMatch
    while ((objMatch = objectRe.exec(content))) {
      const obj = objMatch[0]

      const brandM = obj.match(/brand:\s*['"`]([^'"`]+)['"`]/)
      const nameM = obj.match(/nameDe:\s*['"`]([^'"`]+)['"`]/) || obj.match(/name:\s*['"`]([^'"`]+)['"`]/)
      const folderM = obj.match(/folder:\s*['"`]([^'"`]+)['"`]/)
      const filesM = obj.match(/imageFiles:\s*\[([^\]]+)\]/)

      if (!folderM) continue

      const folder = folderM[1]
      const imageFiles = filesM
        ? [...filesM[1].matchAll(/['"`]([^'"`]+)['"`]/g)].map(m => m[1])
        : ['1.png', '2.png', '3.png', '4.png']

      if (products.some(p => p.folder === folder)) continue

      products.push({
        brand: brandM ? brandM[1] : 'Unknown',
        name: nameM ? nameM[1] : folder,
        folder,
        imageFiles,
        source: file,
      })
    }
  }
  return products
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔍 Parsing seed files...')
  const allProducts = parseSeedFiles()
  console.log(`   Found ${allProducts.length} products total`)

  const missing = allProducts.filter(p => {
    const dir = path.join(PRODUCTS_DIR, p.folder)
    return !fs.existsSync(dir) || p.imageFiles.some(f => !fs.existsSync(path.join(dir, f)))
  })
  console.log(`   Missing images: ${missing.length}`)

  let targets = missing
  if (BRAND_FILTER) {
    targets = targets.filter(p => p.brand.toLowerCase() === BRAND_FILTER.toLowerCase())
    console.log(`   Brand filter "${BRAND_FILTER}": ${targets.length} products`)
  }
  targets = targets.slice(0, LIMIT)

  if (targets.length === 0) {
    console.log('✅ All products have images!')
    return
  }

  let created = 0
  let errors = 0

  for (let i = 0; i < targets.length; i++) {
    const p = targets[i]
    const dir = path.join(PRODUCTS_DIR, p.folder)

    if (DRY_RUN) {
      console.log(`[${i + 1}/${targets.length}] 📁 ${p.folder} (${p.imageFiles.length} images)`)
      continue
    }

    try {
      fs.mkdirSync(dir, { recursive: true })

      for (let j = 0; j < p.imageFiles.length; j++) {
        const targetFile = path.join(dir, p.imageFiles[j])
        if (fs.existsSync(targetFile)) continue

        // Generate slightly different SVG per image slot (different zoom/angle hint)
        const svg = generateSvg(p)
        const pngBuffer = await sharp(Buffer.from(svg))
          .png({ quality: 90 })
          .toBuffer()

        fs.writeFileSync(targetFile, pngBuffer)
        created++
      }

      if ((i + 1) % 50 === 0 || i === targets.length - 1) {
        console.log(`   Progress: ${i + 1}/${targets.length} (${created} images created)`)
      }
    } catch (err) {
      console.log(`   ❌ Error for ${p.folder}: ${err.message}`)
      errors++
    }
  }

  console.log(`\n${'═'.repeat(50)}`)
  console.log(`📊 Results:`)
  console.log(`   ✅ Created: ${created} placeholder images`)
  console.log(`   ❌ Errors: ${errors}`)
  console.log(`   📁 Products processed: ${targets.length}`)
}

main().catch(console.error)
