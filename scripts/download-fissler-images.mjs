import { writeFileSync } from 'fs'
import { join } from 'path'

// Product → manufacturer image URL mapping
// Fissler uses Shopify CDN: fissler.com/cdn/shop/files/...
// WMF uses: wmf.com image CDN
// Tefal uses: tefal.de image CDN  
// Zwilling uses: zwilling.com image CDN

const productImages = {
  // === FISSLER ===
  'Fissler Adamant Plus Bratpfanne — 24 cm': {
    slug: 'fissler-adamant-plus-bratpfanne-24cm',
    urls: [
      'https://fissler.com/cdn/shop/files/adamant-comfort-frypan-sa-perspective2.jpg?v=1770202645&width=1024',
      'https://fissler.com/cdn/shop/files/159-105-28-100_Scratch_Resistant_2_6f01e671-58b7-49b6-8a38-8296d09a9e71.jpg?v=1770369894&width=1024',
      'https://fissler.com/cdn/shop/files/159-105-28-100_Scratch_Resistant_1.jpg?v=1770369894&width=1024',
    ],
  },
  'Fissler Adamant Plus Bratpfanne — 28 cm': {
    slug: 'fissler-adamant-plus-bratpfanne-28cm',
    urls: [
      'https://fissler.com/cdn/shop/files/adamant-comfort-frypan-sa-perspective2.jpg?v=1770202645&width=1024',
      'https://fissler.com/cdn/shop/files/159-105-28-100_Scratch_Resistant_2_6f01e671-58b7-49b6-8a38-8296d09a9e71.jpg?v=1770369894&width=1024',
      'https://fissler.com/cdn/shop/files/159-105-28-100_Scratch_Resistant_1.jpg?v=1770369894&width=1024',
    ],
  },
  'Fissler Cenit — Grillpfanne 28x28 cm': {
    slug: 'fissler-cenit-grillpfanne-28x28cm',
    urls: [
      'https://fissler.com/cdn/shop/files/4009209375571-cenit-grill-pan-28cm-sa-perspective1.jpg?v=1767688378&width=1024',
      'https://fissler.com/cdn/shop/files/Cenit_grillpfanne_pm_v1.jpg?v=1770295681&width=1024',
      'https://fissler.com/cdn/shop/files/4009209375571-cenit-grill-pan-28cm-sa-perspective2.jpg?v=1770295681&width=1024',
    ],
  },
  'Fissler Original Profi Collection — Grillpfanne 28 cm': {
    slug: 'fissler-opc-grillpfanne-28cm',
    urls: [
      'https://fissler.com/cdn/shop/files/4009209380773-original-profi-collection_sa_perspective1_75e69a62-c4a4-4271-999f-4826e954e385.jpg?v=1772523871&width=1024',
      'https://fissler.com/cdn/shop/files/4009209380766-original-profi-collection_sa_perspective1.jpg?v=1772523871&width=1024',
      'https://fissler.com/cdn/shop/files/084-378-28-100_084-128-28-000_Original-Profi_Collection_Lifestyle_1.jpg?v=1772523871&width=1024',
    ],
  },
}

const PRODUCTS_DIR = join(process.cwd(), 'public', 'images', 'products')

async function downloadFile(url, dest) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  writeFileSync(dest, buffer)
  return buffer.length
}

async function main() {
  for (const [folder, data] of Object.entries(productImages)) {
    const dir = join(PRODUCTS_DIR, folder)
    console.log(`\n📥 Downloading ${folder}...`)

    for (let i = 0; i < data.urls.length; i++) {
      const ext = data.urls[i].includes('.png') ? 'png' : 'jpg'
      const filename = `${i + 1}.${ext}`
      const dest = join(dir, filename)

      try {
        const size = await downloadFile(data.urls[i], dest)
        console.log(`  ✅ ${filename} (${(size / 1024).toFixed(1)} KB)`)
      } catch (err) {
        console.error(`  ❌ ${filename}: ${err.message}`)
      }
    }
  }

  console.log('\n✅ Done!')
}

main().catch(console.error)
