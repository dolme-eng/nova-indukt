import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlogContent from './BlogContent'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Nova Magazin',
  description: 'Entdecke Tipps, Rezepte und Neuigkeiten rund um die moderne Küche.',
  keywords: ['Blog', 'Magazin', 'Rezepte', 'Küche', 'Induktion', 'NOVA INDUKT'],
  alternates: {
    canonical: '/blog',
  },
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' }
  })

  // Adapter le format DB au format attendu par le composant
  const formattedPosts = posts.map(post => ({
    id: post.id,
    slug: post.slug,
    title: { de: post.titleDe },
    excerpt: { de: post.excerptDe || '' },
    image: post.image || '',
    date: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    readTime: post.readTime || '',
    category: post.category || '',
    author: post.author
  }))

  return <BlogContent initialPosts={formattedPosts} />
}
