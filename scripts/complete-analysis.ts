/**
 * Analyse complète et profonde - Tous les aspects du projet
 * Exécuter avec: npx tsx scripts/complete-analysis.ts
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()
const PRODUCTS_DIR = path.join(process.cwd(), 'public', 'images', 'products')
const CATEGORIES_DIR = path.join(process.cwd(), 'public', 'images', 'Kategorien')

function normalize(str: string): string {
  return str.toLowerCase()
    .replace(/[äöüß]/g, m => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }[m] || m))
    .replace(/[^a-z0-9]/g, '')
}

async function completeAnalysis() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗')
  console.log('║           ANALYSE COMPLÈTE ET APPROFONDIE                     ║')
  console.log('║                  Nova Indukt - Inventaire                     ║')
  console.log('╚════════════════════════════════════════════════════════════════╝\n')

  // ═════════════════════════════════════════════════════════════════
  // 1. STRUCTURE DES DOSSIERS IMAGES
  // ═════════════════════════════════════════════════════════════════
  console.log('📁 SECTION 1: STRUCTURE DES DOSSIERS IMAGES\n')
  console.log('────────────────────────────────────────────────────────────────\n')

  const productFolders = fs.readdirSync(PRODUCTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())

  const folderStats = productFolders.map(f => {
    const folderPath = path.join(PRODUCTS_DIR, f.name)
    const files = fs.readdirSync(folderPath)
    const images = files.filter(file => /\.(jpg|jpeg|png|webp|gif|avif|svg)$/i.test(file))
    return {
      name: f.name,
      totalFiles: files.length,
      imageCount: images.length,
      otherFiles: files.length - images.length,
      images: images
    }
  })

  const foldersWithImages = folderStats.filter(f => f.imageCount > 0)
  const emptyFolders = folderStats.filter(f => f.imageCount === 0)
  const totalLocalImages = foldersWithImages.reduce((acc, f) => acc + f.imageCount, 0)

  console.log(`   📂 Total dossiers produits:     ${productFolders.length}`)
  console.log(`   ✅ Dossiers avec images:        ${foldersWithImages.length}`)
  console.log(`   ⚠️  Dossiers vides:             ${emptyFolders.length}`)
  console.log(`   📷 Total images locales:       ${totalLocalImages}`)
  console.log(`   📁 Fichiers non-images:         ${folderStats.reduce((acc, f) => acc + f.otherFiles, 0)}`)
  console.log('')

  // Top 20 des dossiers avec le plus d'images
  console.log('   🏆 TOP 20 DOSSIERS (plus d\'images):')
  console.log('   ──────────────────────────────────────────────────────────')
  foldersWithImages
    .sort((a, b) => b.imageCount - a.imageCount)
    .slice(0, 20)
    .forEach((f, i) => {
      console.log(`   ${String(i + 1).padStart(2)}. ${f.name.substring(0, 50).padEnd(50)} ${String(f.imageCount).padStart(3)} img`)
    })
  console.log('')

  // ═════════════════════════════════════════════════════════════════
  // 2. BASE DE DONNÉES - PRODUITS
  // ═════════════════════════════════════════════════════════════════
  console.log('🗄️  SECTION 2: BASE DE DONNÉES - PRODUITS\n')
  console.log('────────────────────────────────────────────────────────────────\n')

  const dbProducts = await prisma.product.findMany({
    include: { 
      images: true,
      category: true
    },
    orderBy: { nameDe: 'asc' }
  })

  const productsByCategory = dbProducts.reduce((acc, p) => {
    const catName = p.category?.nameDe || 'Sans catégorie'
    acc[catName] = acc[catName] || []
    acc[catName].push(p)
    return acc
  }, {} as Record<string, typeof dbProducts>)

  const activeProducts = dbProducts.filter(p => p.isActive)
  const inactiveProducts = dbProducts.filter(p => !p.isActive)
  const productsWithDbImages = dbProducts.filter(p => p.images.length > 0)
  const productsWithoutDbImages = dbProducts.filter(p => p.images.length === 0)

  const totalDbImages = dbProducts.reduce((acc, p) => acc + p.images.length, 0)
  const externalImages = dbProducts.reduce((acc, p) => 
    acc + p.images.filter(img => img.url.startsWith('http')).length, 0)
  const localImagesInDb = totalDbImages - externalImages

  console.log(`   📦 Total produits:              ${dbProducts.length}`)
  console.log(`   ✅ Produits actifs:            ${activeProducts.length}`)
  console.log(`   ⏸️  Produits inactifs:          ${inactiveProducts.length}`)
  console.log(`   📷 Avec images en DB:           ${productsWithDbImages.length}`)
  console.log(`   ❌ Sans images en DB:           ${productsWithoutDbImages.length}`)
  console.log(`   📸 Total images en DB:         ${totalDbImages}`)
  console.log(`   🌐 Images externes (URL):      ${externalImages}`)
  console.log(`   💾 Images locales en DB:       ${localImagesInDb}`)
  console.log('')

  // Répartition par catégorie
  console.log('   📊 RÉPARTITION PAR CATÉGORIE:')
  console.log('   ──────────────────────────────────────────────────────────')
  Object.entries(productsByCategory)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([cat, products]) => {
      const withImg = products.filter(p => p.images.length > 0).length
      console.log(`   • ${cat.substring(0, 40).padEnd(40)} ${String(products.length).padStart(3)} prod (${withImg} avec img)`)
    })
  console.log('')

  // ═════════════════════════════════════════════════════════════════
  // 3. VÉRIFICATION CROISÉE DB ↔ DOSSIERS
  // ═════════════════════════════════════════════════════════════════
  console.log('🔄 SECTION 3: VÉRIFICATION CROISÉE DB ↔ DOSSIERS\n')
  console.log('────────────────────────────────────────────────────────────────\n')

  let perfectMatch = 0
  let dbMissingFolder = 0
  let folderMissingDb = 0
  let pathErrors = 0
  let imagesMissingInDb = 0

  const detailedIssues: Array<{type: string, name: string, details: string}> = []

  // Vérifier chaque produit DB
  for (const product of dbProducts) {
    const normalizedName = normalize(product.nameDe)
    const matchingFolder = foldersWithImages.find(f => normalize(f.name) === normalizedName)

    if (!matchingFolder) {
      dbMissingFolder++
      detailedIssues.push({
        type: 'DB_SANS_DOSSIER',
        name: product.nameDe,
        details: 'Produit en DB mais pas de dossier avec images'
      })
      continue
    }

    // Vérifier que chaque image DB existe localement
    for (const dbImage of product.images) {
      if (dbImage.url.startsWith('http')) continue

      const localPath = path.join(process.cwd(), 'public', dbImage.url.replace(/^\//, ''))
      if (!fs.existsSync(localPath)) {
        pathErrors++
        detailedIssues.push({
          type: 'CHEMIN_INVALIDE',
          name: product.nameDe,
          details: `Image introuvable: ${path.basename(dbImage.url)}`
        })
      }
    }

    // Vérifier que chaque image locale est en DB
    const dbImageFiles = product.images
      .filter(img => !img.url.startsWith('http'))
      .map(img => path.basename(img.url))

    for (const localImg of matchingFolder.images) {
      if (!dbImageFiles.includes(localImg)) {
        imagesMissingInDb++
        detailedIssues.push({
          type: 'IMAGE_LOCALE_NON_DB',
          name: product.nameDe,
          details: `Image locale non référencée: ${localImg}`
        })
      }
    }

    if (product.images.length > 0 && matchingFolder.imageCount > 0) {
      perfectMatch++
    }
  }

  // Vérifier les dossiers orphelins
  for (const folder of foldersWithImages) {
    const normalizedFolder = normalize(folder.name)
    const matchingProduct = dbProducts.find(p => normalize(p.nameDe) === normalizedFolder)

    if (!matchingProduct) {
      folderMissingDb++
      detailedIssues.push({
        type: 'DOSSIER_ORPHELIN',
        name: folder.name,
        details: `Dossier avec ${folder.imageCount} images mais pas de produit en DB`
      })
    }
  }

  console.log(`   ✅ Correspondance parfaite:     ${perfectMatch}/${dbProducts.length}`)
  console.log(`   ❌ Produits sans dossier:       ${dbMissingFolder}`)
  console.log(`   ⚠️  Dossiers orphelins:         ${folderMissingDb}`)
  console.log(`   ❌ Chemins invalides:           ${pathErrors}`)
  console.log(`   ⚠️  Images locales non en DB:   ${imagesMissingInDb}`)
  console.log('')

  // ═════════════════════════════════════════════════════════════════
  // 4. IMAGES CATÉGORIES
  // ═════════════════════════════════════════════════════════════════
  console.log('📁 SECTION 4: IMAGES CATÉGORIES\n')
  console.log('────────────────────────────────────────────────────────────────\n')

  let categoryImages = 0
  if (fs.existsSync(CATEGORIES_DIR)) {
    const catFiles = fs.readdirSync(CATEGORIES_DIR)
    categoryImages = catFiles.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f)).length
  }

  const dbCategories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } }
  })

  console.log(`   📂 Dossier Kategorien:          ${fs.existsSync(CATEGORIES_DIR) ? 'EXISTE' : 'MANQUANT'}`)
  console.log(`   📷 Images catégories:           ${categoryImages}`)
  console.log(`   🗄️  Catégories en DB:           ${dbCategories.length}`)
  console.log('')

  // ═════════════════════════════════════════════════════════════════
  // 5. PROBLÈMES DÉTAILLÉS
  // ═════════════════════════════════════════════════════════════════
  if (detailedIssues.length > 0) {
    console.log('🔴 SECTION 5: PROBLÈMES DÉTECTÉS\n')
    console.log('────────────────────────────────────────────────────────────────\n')

    const grouped = detailedIssues.reduce((acc, issue) => {
      acc[issue.type] = acc[issue.type] || []
      acc[issue.type].push(issue)
      return acc
    }, {} as Record<string, typeof detailedIssues>)

    for (const [type, issues] of Object.entries(grouped)) {
      console.log(`   ${type} (${issues.length} problèmes):\n`)
      issues.slice(0, 5).forEach((issue, i) => {
        console.log(`      ${i + 1}. ${issue.name.substring(0, 45).padEnd(45)}`)
        console.log(`         └─ ${issue.details}`)
      })
      if (issues.length > 5) {
        console.log(`         ... et ${issues.length - 5} autres`)
      }
      console.log('')
    }
  }

  // ═════════════════════════════════════════════════════════════════
  // 6. SYNTHÈSE ET RECOMMANDATIONS
  // ═════════════════════════════════════════════════════════════════
  console.log('╔════════════════════════════════════════════════════════════════╗')
  console.log('║                    SYNTHÈSE FINALE                              ║')
  console.log('╚════════════════════════════════════════════════════════════════╝\n')

  const syncRate = dbProducts.length > 0 
    ? ((perfectMatch / dbProducts.length) * 100).toFixed(1)
    : '0.0'

  console.log('   📊 INDICATEURS CLÉS:\n')
  console.log(`      • Produits en DB:                    ${dbProducts.length}`)
  console.log(`      • Dossiers avec images:              ${foldersWithImages.length}`)
  console.log(`      • Images locales totales:            ${totalLocalImages}`)
  console.log(`      • Images référencées en DB:          ${localImagesInDb}`)
  console.log(`      • Taux de synchronisation:           ${syncRate}%`)
  console.log(`      • Problèmes détectés:                ${detailedIssues.length}`)
  console.log('')

  // Évaluation globale
  console.log('   🎯 ÉVALUATION GLOBALE:\n')
  if (parseFloat(syncRate) >= 95 && detailedIssues.length < 10) {
    console.log('      🟢 EXCELLENT - Le système est parfaitement synchronisé!')
  } else if (parseFloat(syncRate) >= 80 && detailedIssues.length < 30) {
    console.log('      🟢 BON - Quelques ajustements mineurs recommandés')
  } else if (parseFloat(syncRate) >= 60) {
    console.log('      🟡 MOYEN - Des corrections sont nécessaires')
  } else {
    console.log('      🔴 CRITIQUE - Action immédiate requise')
  }
  console.log('')

  // Recommandations
  if (detailedIssues.length > 0) {
    console.log('   📋 RECOMMANDATIONS PRIORITAIRES:\n')
    
    if (dbMissingFolder > 0) {
      console.log(`      1. Créer les dossiers images pour ${dbMissingFolder} produits`)
    }
    if (folderMissingDb > 0) {
      console.log(`      2. Créer les produits en DB pour ${folderMissingDb} dossiers orphelins`)
    }
    if (pathErrors > 0) {
      console.log(`      3. Corriger ${pathErrors} chemins d'images invalides`)
    }
    if (imagesMissingInDb > 0) {
      console.log(`      4. Ajouter ${imagesMissingInDb} images locales en base de données`)
    }
    if (emptyFolders.length > 50) {
      console.log(`      5. Nettoyer ${emptyFolders.length} dossiers vides inutilisés`)
    }
    console.log('')
  }

  console.log('╔════════════════════════════════════════════════════════════════╗')
  console.log('║                  ANALYSE TERMINÉE                             ║')
  console.log('╚════════════════════════════════════════════════════════════════╝\n')

  await prisma.$disconnect()
}

completeAnalysis().catch(console.error)
