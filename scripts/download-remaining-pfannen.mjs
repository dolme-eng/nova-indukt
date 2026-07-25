import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const PRODUCTS_DIR = join(process.cwd(), 'public', 'images', 'products')

const productImages = {
  // === FISSLER (already downloaded) ===
  // Skip - already have real images

  // === ZWILLING ===
  'Zwilling Summit Plus Bratpfanne — 24 cm': {
    slug: 'zwilling-summit-plus-bratpfanne-24cm',
    urls: [
      'https://www.zwilling.com/on/demandware.static/-/Sites-zwilling-master-catalog/default/dw4212974c/images/large/1034786_1.jpg',
      'https://www.zwilling.com/on/demandware.static/-/Sites-zwilling-master-catalog/default/dw4212974c/images/large/1034786_2.jpg',
    ],
  },
  'Zwilling Summit Plus Bratpfanne — 28 cm': {
    slug: 'zwilling-summit-plus-bratpfanne-28cm',
    urls: [
      'https://www.zwilling.com/on/demandware.static/-/Sites-zwilling-master-catalog/default/dw4212974c/images/large/1034784_1.jpg',
      'https://www.zwilling.com/on/demandware.static/-/Sites-zwilling-master-catalog/default/dw4212974c/images/large/1034784_2.jpg',
    ],
  },
  'Zwilling Summit+ — Grillpfanne 28 cm': {
    slug: 'zwilling-summit-plus-grillpfanne-28cm',
    urls: [
      'https://www.zwilling.com/on/demandware.static/-/Sites-zwilling-master-catalog/default/dwa9a04982/images/large/40996-028-0_1.jpg',
      'https://www.zwilling.com/on/demandware.static/-/Sites-zwilling-master-catalog/default/dwa9a04982/images/large/40996-028-0_2.jpg',
    ],
  },

  // === WMF ===
  'WMF Diadem Plus Bratpfanne — 24 cm': {
    slug: 'wmf-diadem-plus-bratpfanne-24cm',
    urls: [
      'https://www.wmf.com/media/catalog/product/a/1/a1aff31d-7f79-45ad-b799907c5f483e96-3201000444-20240306-143718.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=800&width=800',
    ],
  },
  'WMF Diadem Plus Bratpfanne — 28 cm': {
    slug: 'wmf-diadem-plus-bratpfanne-28cm',
    urls: [
      'https://www.wmf.com/media/catalog/product/a/1/a1aff31d-7f79-45ad-b799907c5f483e96-3201000445-20240306-143718.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=800&width=800',
    ],
  },
  'WMF Durado — Grillpfanne 28x28 cm': {
    slug: 'wmf-durado-grillpfanne-28x28cm',
    urls: [
      'https://www.wmf.com/media/catalog/product/a/1/a1aff31d-7f79-45ad-b799907c5f483e96-396476f2-3201001437-20260115-134332.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=800&width=800',
    ],
  },
  'WMF Performance — Grillpfanne 28 cm': {
    slug: 'wmf-performance-grillpfanne-28cm',
    urls: [
      'https://www.wmf.com/media/catalog/product/a/1/a1aff31d-7f79-45ad-b799907c5f483e96-396476f2-3201001437-20260115-134332.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=800&width=800',
    ],
  },

  // === TEFAL ===
  'Tefal Talent Pro Bratpfanne — 26 cm': {
    slug: 'tefal-talent-pro-bratpfanne-26cm',
    urls: [
      'https://www.tefal.de/medias/?.img=/content/dam/tfal/global/product-images/global/P000094980_G26406.png&v=1&v1=tefal',
    ],
  },
  'Tefal Talent Pro Bratpfanne — 28 cm': {
    slug: 'tefal-talent-pro-bratpfanne-28cm',
    urls: [
      'https://www.tefal.de/medias/?.img=/content/dam/tfal/global/product-images/global/P000094980_G2640632.png&v=1&v1=tefal',
    ],
  },
  'Tefal Natural On Induction — Grillpfanne 26 cm': {
    slug: 'tefal-natural-on-induction-grillpfanne-26cm',
    urls: [
      'https://www.tefal.de/medias/?.img=/content/dam/tfal/global/product-images/global/P000094980_G28006.png&v=1&v1=tefal',
    ],
  },
}

async function downloadFile(url, dest) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
    }
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  writeFileSync(dest, buffer)
  return buffer.length
}

async function main() {
  let downloaded = 0
  let failed = 0

  for (const [folder, data] of Object.entries(productImages)) {
    const dir = join(PRODUCTS_DIR, folder)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }

    console.log(`\n📥 ${folder}`)

    for (let i = 0; i < data.urls.length; i++) {
      const filename = `${i + 1}.jpg`
      const dest = join(dir, filename)

      try {
        const size = await downloadFile(data.urls[i], dest)
        console.log(`  ✅ ${filename} (${(size / 1024).toFixed(1)} KB)`)
        downloaded++
      } catch (err) {
        console.error(`  ❌ ${filename}: ${err.message}`)
        failed++
      }
    }
  }

  console.log(`\n📊 Results: ${downloaded} downloaded, ${failed} failed`)
}

main().catch(console.error)
