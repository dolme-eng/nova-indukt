import { PrismaClient } from '@prisma/client'
import { categoriesConfig } from '../../lib/data/categories'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Purge de la base de données en cours...')

  // Delete all order items, orders, product images, products, and categories
  // Note: deleting a product cascades to its images if configured, but we do it safely.
  
  // To avoid foreign key issues, we delete in order (if schema restricts it):
  // Since we don't know if Orders are present and cascade, let's delete ProductImages first, then Products, then Categories.
  
  await prisma.productImage.deleteMany({})
  console.log('  🗑️  Images de produits supprimées')
  
  // Optional: delete cart items related to products
  // await prisma.cartItem.deleteMany({}) 
  
  await prisma.product.deleteMany({})
  console.log('  🗑️  Produits supprimés')

  await prisma.category.deleteMany({})
  console.log('  🗑️  Catégories supprimées')

  console.log('\n🏗️  Création des nouvelles catégories 100% induction...')
  
  for (const cat of categoriesConfig) {
    await prisma.category.create({
      data: {
        id: cat.id,
        slug: cat.slug,
        nameDe: cat.nameDe,
        image: cat.image,
        isActive: cat.isActive,
        sortOrder: cat.sortOrder,
      }
    })
    console.log(`  ✓ Catégorie créée: ${cat.nameDe}`)
  }

  console.log('\n✅ Base de données prête pour les nouveaux produits !')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de la purge:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
