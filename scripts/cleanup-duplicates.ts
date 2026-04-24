/**
 * Script de suppression des doublons exacts
 * Exécuter avec: npx tsx scripts/cleanup-duplicates.ts
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()
const PRODUCTS_DIR = 'public/images/products'

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, '')
}

async function cleanupDuplicates() {
  console.log('🗑️  SUPPRESSION DES DOUBLONS\n')
  
  const products = await prisma.product.findMany({
    include: {
      category: { select: { slug: true, nameDe: true } },
      images: true,
      _count: { select: { orderItems: true, cartItems: true, wishlistItems: true } }
    },
    orderBy: { nameDe: 'asc' }
  })
  
  console.log(`📊 Total produits avant: ${products.length}\n`)
  
  // Trouver les doublons exacts
  const exactDuplicates: Array<{keep: typeof products[0], remove: typeof products[0]}> = []
  const processed = new Set<string>()
  
  for (let i = 0; i < products.length; i++) {
    if (processed.has(products[i].id)) continue
    
    const normalized1 = normalizeString(products[i].nameDe)
    
    for (let j = i + 1; j < products.length; j++) {
      if (processed.has(products[j].id)) continue
      
      const normalized2 = normalizeString(products[j].nameDe)
      
      if (normalized1 === normalized2) {
        // Comparer le nombre d'images et d'utilisation
        const prod1Score = products[i].images.length + products[i]._count.orderItems + products[i]._count.wishlistItems
        const prod2Score = products[j].images.length + products[j]._count.orderItems + products[j]._count.wishlistItems
        
        if (prod1Score >= prod2Score) {
          exactDuplicates.push({ keep: products[i], remove: products[j] })
        } else {
          exactDuplicates.push({ keep: products[j], remove: products[i] })
        }
        processed.add(products[i].id)
        processed.add(products[j].id)
        break
      }
    }
  }
  
  console.log(`📋 ${exactDuplicates.length} doublons trouvés:\n`)
  
  // Supprimer les doublons
  let deleted = 0
  let errors = 0
  
  for (const dup of exactDuplicates) {
    try {
      console.log(`  Suppression: ${dup.remove.nameDe.substring(0, 50)}...`)
      console.log(`    ID: ${dup.remove.id}`)
      console.log(`    Images: ${dup.remove.images.length}`)
      console.log(`    Commandes: ${dup.remove._count.orderItems}`)
      
      // Supprimer le produit (les images seront supprimées en cascade par Prisma)
      await prisma.product.delete({
        where: { id: dup.remove.id }
      })
      
      console.log(`    ✅ Supprimé\n`)
      deleted++
      
    } catch (error) {
      console.log(`    ❌ Erreur: ${error instanceof Error ? error.message : 'Inconnue'}\n`)
      errors++
    }
  }
  
  // Vérifier le résultat
  const remainingCount = await prisma.product.count()
  
  console.log('========================================')
  console.log('   RÉSULTAT')
  console.log('========================================')
  console.log(`Produits supprimés: ${deleted}`)
  console.log(`Erreurs: ${errors}`)
  console.log(`Produits restants: ${remainingCount}`)
  console.log('')
  
  if (remainingCount === 182) {
    console.log('✅ PARFAIT: Exactement 182 produits restants !')
  } else if (remainingCount > 182) {
    console.log(`⚠️  Encore ${remainingCount - 182} produits en trop`)
  } else {
    console.log(`ℹ️  ${182 - remainingCount} produits de moins que prévu`)
  }
  
  await prisma.$disconnect()
}

cleanupDuplicates().catch(console.error)
