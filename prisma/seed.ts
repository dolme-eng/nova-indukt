// Seed script for NOVA INDUKT
// Migrates products from lib/data/products.ts to PostgreSQL database

import { PrismaClient, Prisma } from '@prisma/client'
import * as productData from '../lib/data/products'

const products = (productData as any).products || []
const categories = (productData as any).categories || []

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')
  console.log(`📦 Found ${products.length} products to migrate`)
  console.log(`📁 Found ${categories.length} categories to migrate`)

  // Step 1: Create categories first
  console.log('\n🏷️  Creating categories...')
  
  const categoryMap = new Map<string, string>() // slug -> id
  
  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.id },
      update: {
        nameDe: cat.name.de,
        image: cat.image,
        isActive: true,
      },
      create: {
        slug: cat.id,
        nameDe: cat.name.de,
        nameEn: cat.name.de, // Fallback to German
        image: cat.image,
        sortOrder: 0,
        isActive: true,
      },
    })
    categoryMap.set(cat.id, category.id)
    console.log(`  ✓ Category: ${cat.name.de} (${cat.id})`)
  }

  // Step 2: Create products
  console.log('\n🛍️  Creating products...')
  
  let successCount = 0
  let errorCount = 0
  
  for (const product of products) {
    try {
      const categoryId = categoryMap.get(product.category)
      
      if (!categoryId) {
        console.warn(`  ⚠️  Skipping ${product.name.de}: Category ${product.category} not found`)
        errorCount++
        continue
      }

      // Prepare images
      const images: Prisma.ProductImageCreateWithoutProductInput[] = product.images.map((url: string, index: number) => ({
        url,
        alt: `${product.name.de} - Image ${index + 1}`,
        sortOrder: index,
        isMain: index === 0,
      }))

      // Create or update product
      const createdProduct = await prisma.product.upsert({
        where: { slug: product.slug },
        update: {
          nameDe: product.name.de,
          descriptionDe: product.description.de,
          shortDescription: product.shortDescription.de,
          price: new Prisma.Decimal(product.price),
          oldPrice: product.oldPrice ? new Prisma.Decimal(product.oldPrice) : null,
          vatRatePercent: product.vatRatePercent ?? 19,
          priceIncludesVat: product.priceIncludesVat ?? true,
          stock: product.stock,
          rating: product.rating,
          reviewCount: product.reviewCount,
          badges: product.badges ?? [],
          brand: product.brand,
          ean: product.ean,
          supplierSku: product.supplierSku,
          material: product.specs.material,
          dimensions: product.specs.dimensions,
          dishwasherSafe: product.specs.dishwasher,
          inductionSafe: product.specs.induction,
          categoryId,
          isActive: true,
        },
        create: {
          slug: product.slug,
          supplierSku: product.supplierSku,
          ean: product.ean,
          nameDe: product.name.de,
          nameEn: product.name.de,
          descriptionDe: product.description.de,
          descriptionEn: product.description.de,
          shortDescription: product.shortDescription.de,
          price: new Prisma.Decimal(product.price),
          oldPrice: product.oldPrice ? new Prisma.Decimal(product.oldPrice) : null,
          vatRatePercent: product.vatRatePercent ?? 19,
          priceIncludesVat: product.priceIncludesVat ?? true,
          stock: product.stock,
          rating: product.rating,
          reviewCount: product.reviewCount,
          badges: product.badges ?? [],
          brand: product.brand,
          material: product.specs.material,
          dimensions: product.specs.dimensions,
          dishwasherSafe: product.specs.dishwasher,
          inductionSafe: product.specs.induction,
          categoryId,
          isActive: true,
          images: {
            create: images,
          },
        },
      })

      // If product was updated (not created), we need to handle images separately
      // since upsert doesn't support nested create for images in update case
      if (images.length > 0) {
        // Delete existing images and recreate them
        await prisma.productImage.deleteMany({
          where: { productId: createdProduct.id },
        })
        
        await prisma.productImage.createMany({
          data: images.map(img => ({
            ...img,
            productId: createdProduct.id,
          })),
        })
      }

      successCount++
      console.log(`  ✓ [${successCount}/${products.length}] ${product.name.de.substring(0, 50)}...`)
    } catch (error) {
      errorCount++
      console.error(`  ✗ Error with ${product.name.de}:`, error)
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 SEED SUMMARY')
  console.log('='.repeat(50))
  console.log(`✅ Categories: ${categories.length} created/updated`)
  console.log(`✅ Products: ${successCount}/${products.length} migrated successfully`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log('='.repeat(50))

  if (errorCount === 0) {
    console.log('\n🎉 Seed completed successfully!')
  } else {
    console.log(`\n⚠️  Seed completed with ${errorCount} errors.`)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
