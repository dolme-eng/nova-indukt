/**
 * Script Phase 2A: Création des 15 produits manquants
 * Exécuter avec: npx tsx scripts/seed-missing-products.ts
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()
const PRODUCTS_DIR = 'public/images/products'

// Mapping des mots-clés pour déterminer la catégorie
const categoryMapping: Record<string, string> = {
  // Herde
  'herd': 'herde',
  'induktionsherd': 'herde',
  'gasherd': 'herde',
  'mischherd': 'herde',
  'backofen': 'herde',
  'kochfeld': 'herde',
  'range': 'herde',
  
  // Küchenmaschinen
  'küchenmaschine': 'kuechenmaschinen',
  'kuechenmaschine': 'kuechenmaschinen',
  'mixer': 'kuechenmaschinen',
  'standmixer': 'kuechenmaschinen',
  'handrührer': 'kuechenmaschinen',
  'kaffeevollautomat': 'kuechenmaschinen',
  'kaffeemühle': 'kuechenmaschinen',
  'vakuumierer': 'kuechenmaschinen',
  'airfryer': 'kuechenmaschinen',
  'heissluftfritteuse': 'kuechenmaschinen',
  'waffeleisen': 'kuechenmaschinen',
  'dampfgarer': 'kuechenmaschinen',
  
  // Geschirrspüler
  'geschirrspüler': 'geschirrspueler',
  'geschirrspueler': 'geschirrspueler',
  
  // Waschmaschinen
  'waschmaschine': 'waschmaschinen',
  'waschmaschinen': 'waschmaschinen',
  
  // Trockner
  'trockner': 'trockner',
  'wärmepumpentrockner': 'trockner',
  
  // Staubsauger
  'staubsauger': 'staubsauger',
  'saugroboter': 'staubsauger',
  'akkustaubsauger': 'staubsauger',
  
  // Kühlschränke
  'kühlschrank': 'kuehlschraenke',
  'kuehlschrank': 'kuehlschraenke',
  'kühl-gefrier': 'kuehlschraenke',
  'gefrier': 'kuehlschraenke',
  
  // Kochen & Braten
  'pfanne': 'kochen-braten',
  'topf': 'kochen-braten',
  'bräter': 'kochen-braten',
  'schnellkochtopf': 'kochen-braten',
  'wok': 'kochen-braten',
  'kasserolle': 'kochen-braten',
  'grillpfanne': 'kochen-braten',
  
  // Vorbereitung
  'messer': 'vorbereitung',
  'schneidebrett': 'vorbereitung',
  'mörser': 'vorbereitung',
  'gemüsehobel': 'vorbereitung',
  'mühle': 'vorbereitung',
  
  // Küchenzubehör
  'küchenhelfer': 'kuechenzubehoer',
  'kuechenhelfer': 'kuechenzubehoer',
  'küchenwaage': 'kuechenzubehoer',
  'kuechenwaage': 'kuechenzubehoer',
  'thermoskanne': 'kuechenzubehoer',
  'untersetzer': 'kuechenzubehoer',
  'handschuhe': 'kuechenzubehoer',
  
  // Tisch & Servier
  'servier': 'tisch-servier',
  'geschirr': 'tisch-servier',
  'besteck': 'tisch-servier',
  'teeservice': 'tisch-servier',
  
  // Sets
  'set': 'sets',
  'starterset': 'sets',
}

function detectCategory(folderName: string): string {
  const lowerName = folderName.toLowerCase()
  
  for (const [keyword, category] of Object.entries(categoryMapping)) {
    if (lowerName.includes(keyword.toLowerCase())) {
      return category
    }
  }
  
  // Par défaut : kochen-braten pour la plupart des articles de cuisine
  return 'kochen-braten'
}

function extractProductInfo(folderName: string): { name: string; brand: string; description: string } {
  // Extraction de la marque (premier mot avant le tiret ou le premier mot)
  const parts = folderName.split(' - ')
  const brandPart = parts[0].split(' ')[0]
  const brand = brandPart
  
  // Nom du produit complet
  const name = folderName
    .replace(/\/+$/, '') // Enlever les slashes finaux
    .substring(0, 100) // Limiter la longueur
  
  // Description simple
  const description = `Hochwertiges ${folderName.split(' - ')[1] || 'Produkt'} von ${brand}`
  
  return { name, brand, description }
}

function generatePrice(folderName: string): number {
  const lowerName = folderName.toLowerCase()
  
  // Prix basés sur le type de produit
  if (lowerName.includes('herd') || lowerName.includes('range')) {
    return Math.floor(Math.random() * (3000 - 800) + 800)
  }
  if (lowerName.includes('küchenmaschine') || lowerName.includes('kuechenmaschine')) {
    return Math.floor(Math.random() * (800 - 300) + 300)
  }
  if (lowerName.includes('geschirrspüler') || lowerName.includes('geschirrspueler')) {
    return Math.floor(Math.random() * (1200 - 500) + 500)
  }
  if (lowerName.includes('waschmaschine') || lowerName.includes('waschmaschinen')) {
    return Math.floor(Math.random() * (1000 - 400) + 400)
  }
  if (lowerName.includes('kühlschrank') || lowerName.includes('kuehlschrank')) {
    return Math.floor(Math.random() * (2000 - 600) + 600)
  }
  if (lowerName.includes('staubsauger') || lowerName.includes('saugroboter')) {
    return Math.floor(Math.random() * (800 - 200) + 200)
  }
  if (lowerName.includes('trockner')) {
    return Math.floor(Math.random() * (900 - 400) + 400)
  }
  
  // Par défaut pour ustensiles
  return Math.floor(Math.random() * (200 - 50) + 50)
}

async function seedMissingProducts() {
  console.log('🌱 PHASE 2A: Création des produits manquants\n')
  
  // 1. Récupérer tous les dossiers
  const folders = fs.readdirSync(PRODUCTS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
  
  console.log(`📁 Total dossiers images: ${folders.length}`)
  
  // 2. Récupérer tous les produits de la base
  const dbProducts = await prisma.product.findMany({
    select: { nameDe: true, id: true }
  })
  
  console.log(`🗄️  Total produits en DB: ${dbProducts.length}`)
  
  // 3. Trouver les dossiers sans produit correspondant
  const missingProducts: string[] = []
  
  for (const folder of folders) {
    const normalizedFolder = folder.toLowerCase().replace(/[^a-z0-9]/g, '')
    
    const existsInDb = dbProducts.some(dbProd => {
      const normalizedDb = dbProd.nameDe.toLowerCase().replace(/[^a-z0-9]/g, '')
      return normalizedFolder.includes(normalizedDb) || 
             normalizedDb.includes(normalizedFolder) ||
             // Vérification plus souple
             folder.toLowerCase().includes(dbProd.nameDe.toLowerCase().substring(0, 20)) ||
             dbProd.nameDe.toLowerCase().includes(folder.toLowerCase().substring(0, 20))
    })
    
    if (!existsInDb) {
      missingProducts.push(folder)
    }
  }
  
  console.log(`\n⚠️  Produits manquants trouvés: ${missingProducts.length}`)
  
  if (missingProducts.length === 0) {
    console.log('\n✅ Tous les produits sont déjà en base de données !')
    await prisma.$disconnect()
    return
  }
  
  // 4. Afficher les produits manquants
  console.log('\n📋 Liste des produits à créer:')
  missingProducts.forEach((name, i) => {
    const category = detectCategory(name)
    console.log(`  ${i + 1}. ${name.substring(0, 70)}...`)
    console.log(`     → Catégorie: ${category}`)
  })
  
  // 5. Créer les produits
  console.log('\n🔧 Création des produits...\n')
  
  let created = 0
  let errors = 0
  
  for (const folderName of missingProducts) {
    try {
      const folderPath = path.join(PRODUCTS_DIR, folderName)
      const images = fs.readdirSync(folderPath)
        .filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i))
        .sort()
      
      if (images.length === 0) {
        console.log(`  ⚠️  ${folderName}: Pas d'images, ignoré`)
        continue
      }
      
      // Extraire les infos
      const { name, brand, description } = extractProductInfo(folderName)
      const categorySlug = detectCategory(folderName)
      const price = generatePrice(folderName)
      
      // Trouver la catégorie en DB
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug }
      })
      
      if (!category) {
        console.log(`  ❌ ${folderName}: Catégorie ${categorySlug} introuvable`)
        errors++
        continue
      }
      
      // Créer le produit avec transaction
      const result = await prisma.$transaction(async (tx) => {
        // Créer le produit
        const product = await tx.product.create({
          data: {
            nameDe: name,
            nameEn: name,
            slug: name.toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .substring(0, 50) + '-' + Math.random().toString(36).substring(2, 7),
            descriptionDe: description,
            descriptionEn: description,
            price: price,
            oldPrice: Math.round(price * 1.2),
            brand: brand,
            supplierSku: 'SKU-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
            stock: Math.floor(Math.random() * 50) + 10,
            isActive: true,
            inductionSafe: folderName.toLowerCase().includes('induktion'),
            weightKg: Math.floor(Math.random() * 5) + 1,
            categoryId: category.id,
          }
        })
        
        // Créer les images
        for (let i = 0; i < images.length; i++) {
          const imageUrl = `/images/products/${folderName}/${images[i]}`.replace(/\\/g, '/')
          await tx.productImage.create({
            data: {
              url: imageUrl,
              alt: `${name} - Image ${i + 1}`,
              sortOrder: i,
              productId: product.id,
            }
          })
        }
        
        return product
      })
      
      console.log(`  ✅ ${result.nameDe.substring(0, 50)}... (${images.length} images, ${price}€, ${categorySlug})`)
      created++
      
    } catch (error) {
      console.log(`  ❌ ${folderName}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
      errors++
    }
  }
  
  // 6. Résumé
  console.log('\n')
  console.log('========================================')
  console.log('   RÉSUMÉ PHASE 2A')
  console.log('========================================')
  console.log(`Produits créés: ${created}`)
  console.log(`Erreurs: ${errors}`)
  console.log(`Total avant: ${dbProducts.length}`)
  console.log(`Total après: ${dbProducts.length + created}`)
  
  if (dbProducts.length + created === 171) {
    console.log('\n🎉 OBJECTIF ATTEINT: 171 produits en base !')
  } else if (dbProducts.length + created < 171) {
    const remaining = 171 - (dbProducts.length + created)
    console.log(`\n⚠️  Il manque encore ${remaining} produits`)
  }
  
  await prisma.$disconnect()
}

seedMissingProducts().catch(console.error)
