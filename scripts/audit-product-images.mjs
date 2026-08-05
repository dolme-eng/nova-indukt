/**
 * Interactive CLI to validate and apply product images.
 *
 * Workflow:
 *   1. Place generated images in scripts/generated-images/{slug}.jpg
 *   2. Run: node scripts/audit-product-images.mjs
 *   3. For each product, review the generated image
 *   4. Accept (y) → upload to Cloudinary + update DB
 *   5. Reject (n) → skip
 *   6. Quit (q) → stop
 *
 * Options:
 *   --start=N       Start at product N (0-indexed)
 *   --limit=N       Process only N products
 *   --slug=XXX      Process only this slug
 *   --dry-run       Show what would be done without uploading
 *   --delete-old    Delete old ProductImage rows after replacing
 */
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
require('dotenv').config({ path: '.env.local', override: true })

import { PrismaClient } from '@prisma/client'
import { v2 as cloudinary } from 'cloudinary'
import { readdirSync, existsSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createInterface } from 'readline'

const __dirname = dirname(fileURLToPath(import.meta.url))
const GENERATED_DIR = join(__dirname, 'generated-images')
const prisma = new PrismaClient()

// Parse CLI args
const args = process.argv.slice(2)
const getArg = (name) => {
  const arg = args.find((a) => a.startsWith(`--${name}=`))
  return arg ? arg.split('=')[1] : null
}
const hasFlag = (name) => args.includes(`--${name}`)

const START = parseInt(getArg('start') || '0', 10)
const LIMIT = parseInt(getArg('limit') || '999', 10)
const SLUG_FILTER = getArg('slug')
const DRY_RUN = hasFlag('dry-run')
const DELETE_OLD = hasFlag('delete-old')

// Configure Cloudinary
if (!DRY_RUN) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error('❌ CLOUDINARY_CLOUD_NAME not set')
    process.exit(1)
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

function detectMime(buffer) {
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return 'image/jpeg'
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return 'image/png'
  if (buffer[0] === 0x52 && buffer[1] === 0x49) return 'image/webp'
  if (buffer[0] === 0x47 && buffer[1] === 0x49) return 'image/gif'
  return 'image/png'
}

async function uploadToCloudinary(buffer, slug) {
  const mime = detectMime(buffer)
  const base64 = `data:${mime};base64,${buffer.toString('base64')}`

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      base64,
      {
        folder: 'nova-indukt/products',
        public_id: slug,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ quality: 'auto:good' }, { fetch_format: 'auto' }],
        overwrite: true,
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
  })
}

function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, resolve)
  })
}

async function main() {
  // Check generated images directory
  if (!existsSync(GENERATED_DIR)) {
    console.error(`❌ Generated images directory not found: ${GENERATED_DIR}`)
    console.error(`   Create it and place images named {slug}.jpg inside.`)
    process.exit(1)
  }

  const generatedFiles = readdirSync(GENERATED_DIR).filter((f) =>
    /\.(jpg|jpeg|png|webp)$/i.test(f)
  )

  if (generatedFiles.length === 0) {
    console.error('❌ No images found in generated-images/')
    process.exit(1)
  }

  console.log(`📁 Found ${generatedFiles.length} generated images\n`)

  // Get products from DB
  let products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(SLUG_FILTER ? { slug: SLUG_FILTER } : {}),
    },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      category: true,
    },
    orderBy: { nameDe: 'asc' },
  })

  // Filter to only products with generated images
  products = products.filter((p) => {
    const file = generatedFiles.find((f) => f.startsWith(p.slug))
    return !!file
  })

  // Apply start/limit
  products = products.slice(START, START + LIMIT)

  console.log(`📋 Processing ${products.length} products\n`)

  const rl = createInterface({ input: process.stdin, output: process.stdout })
  let accepted = 0
  let rejected = 0
  let errors = 0

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    const generatedFile = generatedFiles.find((f) => f.startsWith(product.slug))
    const imagePath = join(GENERATED_DIR, generatedFile)
    const imageData = readFileSync(imagePath)

    console.log('─'.repeat(60))
    console.log(`[${i + 1}/${products.length}] ${product.nameDe}`)
    console.log(`  Brand: ${product.brand || 'N/A'}`)
    console.log(`  Category: ${product.category?.nameDe || 'N/A'}`)
    console.log(`  Material: ${product.material || 'N/A'}`)
    console.log(`  Dimensions: ${product.dimensions || 'N/A'}`)
    console.log(`  Slug: ${product.slug}`)
    console.log(`  Current images: ${product.images.length}`)
    if (product.images.length > 0) {
      console.log(`  Main image: ${product.images[0].url}`)
    }
    console.log(`  Generated: ${generatedFile} (${(imageData.length / 1024).toFixed(1)} KB)`)
    console.log('')

    const answer = await askQuestion(
      rl,
      `  Accept image? (y=yes, n=no, s=skip, q=quit, v=view): `
    )
    const action = answer.trim().toLowerCase()

    if (action === 'q') {
      console.log('\n👋 Stopped by user.')
      break
    }

    if (action === 'v') {
      // Open image in default viewer
      const { execSync } = await import('child_process')
      try {
        execSync(`start "" "${imagePath}"`, { stdio: 'ignore' })
      } catch {
        console.log(`  Open manually: ${imagePath}`)
      }
      // Ask again after viewing
      const retry = await askQuestion(rl, `  Accept after viewing? (y/n/s): `)
      if (retry.trim().toLowerCase() === 'y') {
        await applyImage(product, imageData, i)
        accepted++
      } else if (retry.trim().toLowerCase() === 'q') {
        console.log('\n👋 Stopped by user.')
        break
      } else {
        console.log('  ⏭️  Skipped')
        rejected++
      }
      continue
    }

    if (action === 's') {
      console.log('  ⏭️  Skipped')
      continue
    }

    if (action === 'y') {
      await applyImage(product, imageData, i)
      accepted++
    } else {
      console.log('  ❌ Rejected')
      rejected++
    }
  }

  rl.close()

  console.log('\n' + '='.repeat(60))
  console.log(`📊 Results: ${accepted} accepted, ${rejected} rejected, ${errors} errors`)
  console.log('='.repeat(60))

  await prisma.$disconnect()

  async function applyImage(product, imageData, index) {
    try {
      if (DRY_RUN) {
        console.log('  🔍 [DRY RUN] Would upload to Cloudinary and update DB')
        return
      }

      // Upload to Cloudinary
      console.log('  ⬆️  Uploading to Cloudinary...')
      const result = await uploadToCloudinary(imageData, product.slug)
      console.log(`  ✅ Uploaded: ${result.secure_url}`)

      // Delete old images if flag set
      if (DELETE_OLD) {
        await prisma.productImage.deleteMany({ where: { productId: product.id } })
        console.log('  🗑️  Old images deleted')
      }

      // Check if main image already exists
      const existingMain = product.images.find((img) => img.isMain)

      if (existingMain && !DELETE_OLD) {
        // Update existing main image URL
        await prisma.productImage.update({
          where: { id: existingMain.id },
          data: {
            url: result.secure_url,
            alt: product.nameDe,
          },
        })
        console.log('  🔄 Main image URL updated')
      } else {
        // Create new main image
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: result.secure_url,
            alt: product.nameDe,
            sortOrder: 0,
            isMain: true,
          },
        })
        console.log('  ➕ New main image created')
      }
    } catch (e) {
      console.error(`  ❌ Error: ${e.message}`)
      errors++
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
