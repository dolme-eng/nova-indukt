/**
 * Script de nettoyage des catégories pour garder uniquement 13 catégories
 * Exécuter avec: npx tsx prisma/cleanup-categories.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Les 13 catégories finales à conserver
const categoriesFinales = [
  'kochen-braten',      // 80 produits + fusion
  'kuechenzubehoer',    // 28 produits + fusion
  'vorbereitung',       // 12 produits + fusion
  'tisch-servier',      // 0 produits mais gardée (image existante)
  'spezial',            // 0 produits mais gardée (image existante)
  'sets',               // 0 produits mais gardée (image existante)
  'herde',              // 21 produits
  'kuehlschraenke',     // 0 produits mais gardée (image existante)
  'geschirrspueler',    // 0 produits mais gardée (image existante)
  'kuechenmaschinen',   // 0 produits mais gardée (image existante)
  'waschmaschinen',     // 0 produits mais gardée (image existante)
  'trockner',           // 0 produits mais gardée (image existante)
  'staubsauger',        // 0 produits mais gardée (image existante)
]

// Mapping des fusions
const fusionMap: Record<string, string> = {
  'messer-vorbereitung': 'vorbereitung',       // 3 produits → vorbereitung
  'kuechenhelfer-zubehoer': 'kuechenzubehoer', // 2 produits → kuechenzubehoer
  'tisch-servieren': 'tisch-servier',          // 0 produits → tisch-servier (doublon nom)
}

async function main() {
  console.log('🧹 Nettoyage des catégories pour garder 13 catégories...')
  console.log('')

  // Étape 1: Fusionner les catégories doublons
  console.log('🔗 Étape 1: Fusion des catégories doublons...')
  
  for (const [sourceSlug, targetSlug] of Object.entries(fusionMap)) {
    const sourceCat = await prisma.category.findUnique({
      where: { slug: sourceSlug },
      include: { _count: { select: { products: true } } }
    })
    
    if (!sourceCat) {
      console.log(`   ⚠️  ${sourceSlug} introuvable`)
      continue
    }

    const targetCat = await prisma.category.findUnique({
      where: { slug: targetSlug }
    })

    if (!targetCat) {
      console.log(`   ❌ ${targetSlug} introuvable, impossible de fusionner`)
      continue
    }

    // Migrer les produits
    const updated = await prisma.product.updateMany({
      where: { categoryId: sourceCat.id },
      data: { categoryId: targetCat.id }
    })

    console.log(`   🔄 ${updated.count} produits migrés de ${sourceSlug} → ${targetSlug}`)

    // Supprimer la catégorie source
    await prisma.category.delete({ where: { slug: sourceSlug } })
    console.log(`   🗑️  ${sourceSlug} supprimée`)
  }

  // Étape 2: Répartir les produits des catégories orphelines
  console.log('')
  console.log('📦 Étape 2: Répartition des produits orphelins...')

  // Électroappareils → Herde (le plus logique)
  const electro = await prisma.category.findUnique({
    where: { slug: 'elektrogeraete' },
    include: { products: { select: { id: true, nameDe: true } } }
  })

  if (electro && electro.products.length > 0) {
    const herde = await prisma.category.findUnique({ where: { slug: 'herde' } })
    if (herde) {
      await prisma.product.updateMany({
        where: { categoryId: electro.id },
        data: { categoryId: herde.id }
      })
      console.log(`   🔄 ${electro.products.length} produits de Elektrogeräte → Herde`)
    }
    await prisma.category.delete({ where: { slug: 'elektrogeraete' } })
    console.log(`   🗑️  elektronics supprimée`)
  }

  // Sonstiges (divers) → répartir selon le nom du produit ou tout mettre dans Küchenzubehör
  const sonstiges = await prisma.category.findUnique({
    where: { slug: 'autre' },
    include: { products: { select: { id: true, nameDe: true } } }
  })

  if (sonstiges && sonstiges.products.length > 0) {
    const kuechenzubehoer = await prisma.category.findUnique({ where: { slug: 'kuechenzubehoer' } })
    if (kuechenzubehoer) {
      await prisma.product.updateMany({
        where: { categoryId: sonstiges.id },
        data: { categoryId: kuechenzubehoer.id }
      })
      console.log(`   🔄 ${sonstiges.products.length} produits de Sonstiges → Küchenzubehör`)
    }
    await prisma.category.delete({ where: { slug: 'autre' } })
    console.log(`   🗑️  autre supprimée`)
  }

  // Backen & Patisserie → Kochen & Braten
  const backen = await prisma.category.findUnique({
    where: { slug: 'backen-patisserie' },
    include: { products: { select: { id: true } } }
  })

  if (backen && backen.products.length > 0) {
    const kochen = await prisma.category.findUnique({ where: { slug: 'kochen-braten' } })
    if (kochen) {
      await prisma.product.updateMany({
        where: { categoryId: backen.id },
        data: { categoryId: kochen.id }
      })
      console.log(`   🔄 ${backen.products.length} produit(s) de Backen → Kochen & Braten`)
    }
    await prisma.category.delete({ where: { slug: 'backen-patisserie' } })
    console.log(`   🗑️  backen-patisserie supprimée`)
  }

  // Étape 3: Vérification finale
  console.log('')
  console.log('✅ Étape 3: Vérification finale...')

  const finalCategories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } }
  })

  console.log(`\n📊 ${finalCategories.length} catégories finales:`)
  
  let totalProduits = 0
  for (const cat of finalCategories) {
    totalProduits += cat._count.products
    const status = categoriesFinales.includes(cat.slug) ? '✅' : '⚠️'
    console.log(`   ${status} ${cat.nameDe} (${cat.slug}) - ${cat._count.products} produits`)
  }

  console.log(`\n📦 Total: ${totalProduits} produits répartis dans ${finalCategories.length} catégories`)

  // Vérifier qu'on a bien 13 catégories
  if (finalCategories.length === 13) {
    console.log('\n🎉 SUCCÈS : Exactement 13 catégories !')
  } else if (finalCategories.length < 13) {
    console.log(`\n⚠️  ATTENTION : ${finalCategories.length} catégories seulement (objectif: 13)`)
  } else {
    console.log(`\n⚠️  ATTENTION : ${finalCategories.length} catégories (objectif: 13)`)
    console.log('   Certaines catégories doivent encore être supprimées ou fusionnées.')
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
