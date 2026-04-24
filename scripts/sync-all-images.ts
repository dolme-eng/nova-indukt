/**
 * Synchronisation complète : Met la DB à jour avec TOUTES les images locales
 * Exécuter avec: npx tsx scripts/sync-all-images.ts
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()
const PRODUCTS_DIR = path.join(process.cwd(), 'public', 'images', 'products')

function normalize(str: string): string {
  return str.toLowerCase()
    .replace(/[äöüß]/g, m => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }[m] || m))
    .replace(/[^a-z0-9]/g, '')
}

async function syncAllImages() {
  console.log('\n🔄 SYNCHRONISATION COMPLÈTE\n')
  console.log('============================\n')

  // 1. Lire tous les dossiers avec leurs images
  const folders = fs.readdirSync(PRODUCTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())

  const folderMap = new Map<string, {name: string, images: string[]}>()

  for (const folder of folders) {
    const folderPath = path.join(PRODUCTS_DIR, folder.name)
    const files = fs.readdirSync(folderPath)
      .filter(f => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(f))
      .sort()

    if (files.length > 0) {
      folderMap.set(normalize(folder.name), {
        name: folder.name,
        images: files
      })
    }
  }

  console.log(`📁 Dossiers avec images trouvés: ${folderMap.size}\n`)

  // 2. Récupérer tous les produits de la DB
  const products = await prisma.product.findMany()

  let synced = 0
  let created = 0
  let errors = 0
  let notFound = 0

  // 3. Pour chaque produit, synchroniser ses images
  for (const product of products) {
    const normalizedName = normalize(product.nameDe)
    const folderData = folderMap.get(normalizedName)

    if (!folderData) {
      console.log(`❌ Pas de dossier pour: ${product.nameDe.substring(0, 50)}`)
      notFound++
      continue
    }

    console.log(`\n📦 ${product.nameDe.substring(0, 50)}`)

    // Supprimer les anciennes images du produit
    await prisma.productImage.deleteMany({
      where: { productId: product.id }
    })

    // Créer les nouvelles entrées d'images
    for (let i = 0; i < folderData.images.length; i++) {
      const imageFile = folderData.images[i]
      const imageUrl = `/images/products/${folderData.name}/${imageFile}`

      try {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: imageUrl,
            alt: `${product.nameDe} - Image ${i + 1}`,
            sortOrder: i,
            isMain: i === 0 // Première image = principale
          }
        })
        console.log(`   ✅ ${imageFile}`)
        created++
      } catch (error) {
        console.log(`   ❌ ${imageFile}: ${error}`)
        errors++
      }
    }

    synced++
  }

  console.log(`\n\n📊 RÉSULTATS\n`)
  console.log(`============================\n`)
  console.log(`✅ Produits synchronisés: ${synced}/${products.length}`)
  console.log(`📷 Images créées en DB: ${created}`)
  console.log(`❌ Non trouvés: ${notFound}`)
  console.log(`❌ Erreurs: ${errors}`)

  // 4. Statistiques finales
  const finalCount = await prisma.productImage.count()
  console.log(`\n📈 Total images en DB: ${finalCount}`)

  if (synced === products.length) {
    console.log(`\n🎉 PARFAIT ! Tous les produits ont leurs images synchronisées !`)
  } else {
    console.log(`\n⚠️  ${notFound} produits n'ont pas de dossier correspondant`)
  }

  await prisma.$disconnect()
}

syncAllImages().catch(console.error)
