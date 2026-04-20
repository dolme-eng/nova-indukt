import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function syncImages() {
  const productsDir = path.join(process.cwd(), 'public', 'images', 'products')
  
  if (!fs.existsSync(productsDir)) {
    console.error(`Directory not found: ${productsDir}`)
    return
  }

  try {
    // 1. Get all directories in public/images/products
    const localFolders = fs.readdirSync(productsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    console.log(`Found ${localFolders.length} folders in public/images/products`)

    // 2. Get all products from DB
    const dbProducts = await prisma.product.findMany({
      include: { images: true }
    })

    let updatedCount = 0

    for (const product of dbProducts) {
      // Find the folder that starts with the product brand/model or matches closely
      // We try to find a folder that contains the product name or parts of it
      const productNameClean = product.nameDe.split('–')[0].split('-')[0].trim()
      
      const matchingFolder = localFolders.find(folder => 
        folder.toLowerCase().includes(productNameClean.toLowerCase()) ||
        productNameClean.toLowerCase().includes(folder.toLowerCase())
      )

      if (matchingFolder) {
        const folderPath = path.join(productsDir, matchingFolder)
        const files = fs.readdirSync(folderPath)
          .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))

        if (files.length > 0) {
          console.log(`Matching Product: "${product.nameDe}" -> Folder: "${matchingFolder}"`)
          
          // Delete old image records for this product
          await prisma.productImage.deleteMany({
            where: { productId: product.id }
          })

          // Create new image records based on actual files
          const newImages = files.map((file, index) => ({
            productId: product.id,
            url: `/images/products/${matchingFolder}/${file}`,
            alt: `${product.nameDe} - Image ${index + 1}`,
            sortOrder: index,
            isMain: index === 0
          }))

          await prisma.productImage.createMany({
            data: newImages
          })

          updatedCount++
        }
      } else {
        console.warn(`No matching folder found for product: "${product.nameDe}" (Cleaned name: "${productNameClean}")`)
      }
    }

    console.log(`\n--- SYNC SUMMARY ---`)
    console.log(`Total Products: ${dbProducts.length}`)
    console.log(`Updated Products: ${updatedCount}`)
    console.log(`--------------------`)

  } catch (error) {
    console.error('Error during image sync:', error)
  } finally {
    await prisma.$disconnect()
  }
}

syncImages()
