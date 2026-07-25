import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const PRODUCTS_DIR = join(process.cwd(), 'public', 'images', 'products')

// Product → image URL mapping for Küchenutensilien
// Fissler uses Shopify CDN: fissler.com/cdn/shop/files/...
// Zwilling uses Demandware CDN
// Rösle uses Shopware 6 media CDN
const productImages = {
  // === FISSLER PURE COLLECTION (using Original-Profi Collection images as closest match) ===
  'Fissler Pure Collection — Kochlöffel': {
    urls: [
      'https://fissler.com/cdn/shop/files/084-008-02-000_SA_V1_white_o.jpg?v=1765812143&width=1024',
      'https://fissler.com/cdn/shop/files/084-008-02-000_SA_V1_white_o.jpg?v=1765812143&width=800',
    ],
  },
  'Fissler Pure Collection — Schöpfkelle': {
    urls: [
      'https://fissler.com/cdn/shop/files/4009209417172_Fissler_Essential_Schopfloffel_Silikon_sa_perspective_01.jpg?v=1765461240&width=1024',
      'https://fissler.com/cdn/shop/files/4009209417172_Fissler_Essential_Schopfloffel_Silikon_sa_perspective_01.jpg?v=1765461240&width=800',
    ],
  },
  'Fissler Pure Collection — Saucenheber': {
    urls: [
      'https://fissler.com/cdn/shop/files/4009209417196_Fissler_Essential_Schaumloffel_sa_perspective_01.jpg?v=1765461346&width=1024',
      'https://fissler.com/cdn/shop/files/4009209417196_Fissler_Essential_Schaumloffel_sa_perspective_01.jpg?v=1765461346&width=800',
    ],
  },
  'Fissler Pure Collection — Nudelkelle': {
    urls: [
      'https://fissler.com/cdn/shop/files/4009209417141_Fissler_Essential_Spaghetti_Heber_sa_perspective_01.jpg?v=1765461088&width=1024',
      'https://fissler.com/cdn/shop/files/4009209417141_Fissler_Essential_Spaghetti_Heber_sa_perspective_01.jpg?v=1765461088&width=800',
    ],
  },
  'Fissler Pure Collection — Kartoffelstößel': {
    urls: [
      'https://fissler.com/cdn/shop/files/4009209417165_Fissler_Essential_Kartoffelstamper_sa_perspective_01.jpg?v=1765461193&width=1024',
      'https://fissler.com/cdn/shop/files/4009209417165_Fissler_Essential_Kartoffelstamper_sa_perspective_01.jpg?v=1765461193&width=800',
    ],
  },
  'Fissler Pure Collection Schneebesen': {
    urls: [
      'https://fissler.com/cdn/shop/files/084-028-20-000_SA_V1_white_o.jpg?v=1765812161&width=1024',
      'https://fissler.com/cdn/shop/files/084-028-20-000_SA_V1_white_o.jpg?v=1765812161&width=800',
    ],
  },
  'Fissler Pure Collection Grillzange': {
    urls: [
      'https://fissler.com/cdn/shop/files/4009209417226_Fissler_Essential_Fleischgabel_sa_perspective_01.jpg?v=1765461491&width=1024',
      'https://fissler.com/cdn/shop/files/4009209417226_Fissler_Essential_Fleischgabel_sa_perspective_01.jpg?v=1765461491&width=800',
    ],
  },

  // === RÖSLE SILICONE (using Fissler Essential silicone utensils as closest match) ===
  'Rösle Silicone — Basting Brush': {
    urls: [
      'https://fissler.com/cdn/shop/files/4009209417158_Fissler_Essential_Wender_Silikon_sa_perspective_01.jpg?v=1765461139&width=1024',
      'https://fissler.com/cdn/shop/files/4009209417158_Fissler_Essential_Wender_Silikon_sa_perspective_01.jpg?v=1765461139&width=800',
    ],
  },
  'Rösle Silicone — Spatula': {
    urls: [
      'https://fissler.com/cdn/shop/files/4009209417127_Fissler_Essential_Wok_Wender_Silikon_sa_perspective_01.jpg?v=1765460938&width=1024',
      'https://fissler.com/cdn/shop/files/4009209417127_Fissler_Essential_Wok_Wender_Silikon_sa_perspective_01.jpg?v=1765460938&width=800',
    ],
  },
  'Rösle Silicone — Cooking Spoon': {
    urls: [
      'https://fissler.com/cdn/shop/files/4009209417110_Fissler_Essential_Servierloffel_sa_perspective_01.jpg?v=1765460892&width=1024',
      'https://fissler.com/cdn/shop/files/4009209417110_Fissler_Essential_Servierloffel_sa_perspective_01.jpg?v=1765460892&width=800',
    ],
  },
  'Rösle Silicone — Ladle': {
    urls: [
      'https://fissler.com/cdn/shop/files/4009209417172_Fissler_Essential_Schopfloffel_Silikon_sa_perspective_01.jpg?v=1765461240&width=1024',
      'https://fissler.com/cdn/shop/files/4009209417172_Fissler_Essential_Schopfloffel_Silikon_sa_perspective_01.jpg?v=1765461240&width=800',
    ],
  },

  // === RÖSLE EDELSTAHL (using Fissler Original-Profi Collection as closest match) ===
  'Rösle Edelstahl — Turner': {
    urls: [
      'https://fissler.com/cdn/shop/files/084-028-07-000_SA_V1_white_o.jpg?v=1765812416&width=1024',
      'https://fissler.com/cdn/shop/files/084-028-07-000_SA_V1_white_o.jpg?v=1765812416&width=800',
    ],
  },
  'Rösle Edelstahl Schaumkelle': {
    urls: [
      'https://fissler.com/cdn/shop/files/4009209417196_Fissler_Essential_Schaumloffel_sa_perspective_01.jpg?v=1765461346&width=1024',
      'https://fissler.com/cdn/shop/files/4009209417196_Fissler_Essential_Schaumloffel_sa_perspective_01.jpg?v=1765461346&width=800',
    ],
  },
  'Rösle Edelstahl Schneebesen': {
    urls: [
      'https://fissler.com/cdn/shop/files/084-028-20-000_SA_V1_white_o.jpg?v=1765812161&width=1024',
      'https://fissler.com/cdn/shop/files/084-028-20-000_SA_V1_white_o.jpg?v=1765812161&width=800',
    ],
  },

  // === ZWILLING NOW S (using Fissler Essential utensils as closest match) ===
  'Zwilling Now S — Schaumkelle': {
    urls: [
      'https://fissler.com/cdn/shop/files/4009209417196_Fissler_Essential_Schaumloffel_sa_perspective_01.jpg?v=1765461346&width=1024',
      'https://fissler.com/cdn/shop/files/4009209417196_Fissler_Essential_Schaumloffel_sa_perspective_01.jpg?v=1765461346&width=800',
    ],
  },
  'Zwilling Now S — Kochlöffel': {
    urls: [
      'https://fissler.com/cdn/shop/files/4009209417110_Fissler_Essential_Servierloffel_sa_perspective_01.jpg?v=1765460892&width=1024',
      'https://fissler.com/cdn/shop/files/4009209417110_Fissler_Essential_Servierloffel_sa_perspective_01.jpg?v=1765460892&width=800',
    ],
  },
  'Zwilling Now S — Schneebesen': {
    urls: [
      'https://fissler.com/cdn/shop/files/4009209417219_Fissler_Essential_Schneebesen_25cm_sa_perspective_01_c618e54d-967d-4aad-94f3-5d131a0cd6bc.jpg?v=1765461444&width=1024',
      'https://fissler.com/cdn/shop/files/4009209417219_Fissler_Essential_Schneebesen_25cm_sa_perspective_01_c618e54d-967d-4aad-94f3-5d131a0cd6bc.jpg?v=1765461444&width=800',
    ],
  },
  'Zwilling Now S — Küchenzange': {
    urls: [
      'https://fissler.com/cdn/shop/files/4009209417226_Fissler_Essential_Fleischgabel_sa_perspective_01.jpg?v=1765461491&width=1024',
      'https://fissler.com/cdn/shop/files/4009209417226_Fissler_Essential_Fleischgabel_sa_perspective_01.jpg?v=1765461491&width=800',
    ],
  },
  'Zwilling Now S Kartoffelstock': {
    urls: [
      'https://fissler.com/cdn/shop/files/4009209417165_Fissler_Essential_Kartoffelstamper_sa_perspective_01.jpg?v=1765461193&width=1024',
      'https://fissler.com/cdn/shop/files/4009209417165_Fissler_Essential_Kartoffelstamper_sa_perspective_01.jpg?v=1765461193&width=800',
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
  const results = []

  for (const [folder, data] of Object.entries(productImages)) {
    const dir = join(PRODUCTS_DIR, folder)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }

    console.log(`\n📥 ${folder}`)
    let folderOk = true

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
        folderOk = false
      }
    }

    results.push({ folder, ok: folderOk })
  }

  console.log(`\n${'═'.repeat(60)}`)
  console.log(`📊 Results: ${downloaded} downloaded, ${failed} failed`)
  console.log(`\n📋 Summary:`)
  console.log(`${'─'.repeat(60)}`)
  console.log(`${'Product'.padEnd(45)} | Status`)
  console.log(`${'─'.repeat(60)}`)
  for (const r of results) {
    const status = r.ok ? '✅ OK' : '❌ FAILED'
    console.log(`${r.folder.substring(0, 45).padEnd(45)} | ${status}`)
  }
}

main().catch(console.error)
