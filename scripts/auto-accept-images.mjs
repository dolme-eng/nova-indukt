/**
 * Auto-accept ALL generated images (main + additional) and upload to Cloudinary.
 *
 * Handles files like:
 *   - {slug}.jpg (main image)
 *   - {slug}-2.jpg (2nd image)
 *   - {slug}-3.jpg (3rd image)
 *
 * Usage:
 *   node scripts/auto-accept-images.mjs                    # Process all
 *   node scripts/auto-accept-images.mjs --limit=10         # Process first 10
 *   node scripts/auto-accept-images.mjs --dry-run          # Show what would be done
 *   node scripts/auto-accept-images.mjs --delete-old       # Delete old ProductImage rows
 */
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
require('dotenv').config({ path: '.env.local', override: true })

import { PrismaClient } from '@prisma/client'
import { v2 as cloudinary } from 'cloudinary'
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const GENERATED_DIR = join(__dirname, 'generated-images')
const PRODUCTS_FILE = join(__dirname, 'products-for-images.json')
const UPLOAD_LOG_FILE = join(__dirname, 'upload-log.json')

// Load upload log
let uploadLog = {}
if (existsSync(UPLOAD_LOG_FILE)) {
  try { uploadLog = JSON.parse(readFileSync(UPLOAD_LOG_FILE, 'utf8')) } catch {}
}

// Parse CLI args
const args = process.argv.slice(2)
const getArg = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1]
const hasFlag = (name) => args.includes(`--${name}`)

const LIMIT = parseInt(getArg('limit') || '999', 10)
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

const prisma = new PrismaClient()

function detectMime(buffer) {
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return 'image/jpeg'
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return 'image/png'
  if (buffer[0] === 0x52 && buffer[1] === 0x49) return 'image/webp'
  if (buffer[0] === 0x47 && buffer[1] === 0x49) return 'image/gif'
  return 'image/png'
}

async function uploadToCloudinary(buffer, publicId) {
  const mime = detectMime(buffer)
  const base64 = `data:${mime};base64,${buffer.toString('base64')}`

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      base64,
      {
        folder: 'nova-indukt/products',
        public_id: publicId,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto:good' },
        ],
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
  })
}

// Scan generated-images folder for all image files
function scanGeneratedImages() {
  const files = readdirSync(GENERATED_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
  const bySlug = {}

  for (const file of files) {
    // Match: {slug}.jpg or {slug}-2.jpg or {slug}-3.jpg
    const match = file.match(/^(.+?)(?:-(\d+))?\.(jpg|jpeg|png|webp)$/i)
    if (!match) continue

    const slug = match[1]
    const index = match[2] ? parseInt(match[2]) : 1

    if (!bySlug[slug]) bySlug[slug] = []
    bySlug[slug].push({ file, index, path: join(GENERATED_DIR, file) })
  }

  // Sort by index
  for (const slug of Object.keys(bySlug)) {
    bySlug[slug].sort((a, b) => a.index - b.index)
  }

  return bySlug
}

async function main() {
  const products = JSON.parse(readFileSync(PRODUCTS_FILE, 'utf8'))
  const productMap = Object.fromEntries(products.map(p => [p.slug, p]))

  const allImages = scanGeneratedImages()
  const slugs = Object.keys(allImages)

  console.log(`\n${'═'.repeat(60)}`)
  console.log(`🔄 AUTO-ACCEPT IMAGES (multi-image)`)
  console.log(`${'═'.repeat(60)}`)
  console.log(`📊 Products with generated images: ${slugs.length}`)
  const totalFiles = slugs.reduce((sum, s) => sum + allImages[s].length, 0)
  console.log(`🖼️  Total image files: ${totalFiles}`)
  if (DRY_RUN) console.log(`⚠️  DRY RUN — no uploads will be made`)
  console.log(`${'─'.repeat(60)}\n`)

  let uploaded = 0
  let skipped = 0
  let failed = 0
  let count = 0

  for (const slug of slugs) {
    if (count >= LIMIT) break
    count++

    const product = productMap[slug]
    if (!product) {
      console.log(`⏭️  ${slug} — no matching product found`)
      continue
    }

    const images = allImages[slug]

    // Check how many already uploaded
    const logKey = slug
    const alreadyUploaded = uploadLog[logKey] || []
    const alreadyCount = Array.isArray(alreadyUploaded) ? alreadyUploaded.length : (alreadyUploaded ? 1 : 0)

    if (alreadyCount >= images.length) {
      console.log(`⏭️  ${product.name} — all ${alreadyCount} images already uploaded`)
      skipped++
      continue
    }

    console.log(`\n📦 ${product.name} (${images.length} files, ${alreadyCount} uploaded)`)

    for (const img of images) {
      const logEntryKey = `${slug}:${img.index}`

      // Skip if already uploaded
      if (uploadLog[logEntryKey]) {
        console.log(`  ⏭️  ${img.file} — already uploaded`)
        continue
      }

      if (DRY_RUN) {
        console.log(`  📋 Would upload: ${img.file}`)
        uploaded++
        continue
      }

      try {
        const buffer = readFileSync(img.path)
        const publicId = img.index === 1 ? slug : `${slug}-${img.index}`
        const result = await uploadToCloudinary(buffer, publicId)

        console.log(`  ✅ ${img.file} → ${result.secure_url}`)

        // Update database
        const imageIndex = img.index - 1

        // For main image (index 1), set isMain=true and sortOrder=0
        // For additional images, set isMain=false
        const isMain = img.index === 1

        if (isMain) {
          // Remove old main image flag
          await prisma.productImage.updateMany({
            where: { productId: product.id, isMain: true },
            data: { isMain: false },
          })
        }

        // Check if this image URL already exists in DB
        const existing = await prisma.productImage.findFirst({
          where: { productId: product.id, url: result.secure_url },
        })

        if (!existing) {
          await prisma.productImage.create({
            data: {
              productId: product.id,
              url: result.secure_url,
              alt: `${product.name} - Bild ${img.index}`,
              isMain,
              sortOrder: imageIndex,
            },
          })
        }

        // Save to log
        uploadLog[logEntryKey] = { url: result.secure_url, uploadedAt: new Date().toISOString() }
        writeFileSync(UPLOAD_LOG_FILE, JSON.stringify(uploadLog, null, 2))

        uploaded++

        // Rate limiting
        await new Promise(r => setTimeout(r, 500))
      } catch (err) {
        console.error(`  ❌ ${img.file}: ${err.message}`)
        failed++
      }
    }
  }

  // Summary
  console.log(`\n${'═'.repeat(60)}`)
  console.log(`📊 Results`)
  console.log(`${'═'.repeat(60)}`)
  console.log(`  ✅ Uploaded: ${uploaded}`)
  console.log(`  ⏭️  Skipped: ${skipped}`)
  console.log(`  ❌ Failed: ${failed}`)
  console.log(`\n💡 Next: Run the site to verify images look correct`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
