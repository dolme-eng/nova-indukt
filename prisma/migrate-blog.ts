import { PrismaClient } from '@prisma/client'
import { blogPosts } from '../lib/data/products'

const prisma = new PrismaClient()

async function main() {
  console.log('Migrating blog posts...')

  // Clean existing posts (optional)
  await prisma.blogPost.deleteMany()

  for (const post of blogPosts) {
    // Note: On utilise le contenu statique existant pour initialiser la DB
    // On pourrait enrichir cela si on avait le contenu complet ici
    await prisma.blogPost.create({
      data: {
        slug: post.slug,
        titleDe: post.title.de,
        excerptDe: post.excerpt.de,
        contentDe: "Inhalt wird bald aktualisiert...", // Placeholder car non présent dans products.ts global
        image: post.image,
        author: post.author,
        category: post.category,
        readTime: post.readTime,
        isPublished: true,
        publishedAt: new Date(post.date)
      }
    })
  }

  console.log('Blog migration completed!')
}

main()
  .catch((e) => {
    console.error('Blog migration failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
