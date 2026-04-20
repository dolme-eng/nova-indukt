import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, Clock, Calendar, User, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'

// Sanitize HTML content to prevent XSS attacks
function sanitizeHtml(html: string): string {
  return html
    .replace(/&lt;strong&gt;/g, '<strong>')
    .replace(/&lt;\/strong&gt;/g, '</strong>')
    .replace(/&lt;br\s*\/?&gt;/g, '<br />')
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug: resolvedParams.slug }
  })
  
  if (!post) {
    return {
      title: 'Artikel nicht gefunden | NOVA INDUKT',
    }
  }

  const title = post.titleDe
  const description = post.excerptDe || ''

  return {
    title: `${title} | Blog | NOVA INDUKT`,
    description,
    alternates: {
      canonical: `/blog/${resolvedParams.slug}`,
    },
    openGraph: {
      title,
      description,
      images: post.image ? [{ url: post.image }] : [],
      type: 'article',
      publishedTime: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
      authors: [post.author],
    },
  }
}

function renderContent(content: string): JSX.Element {
  // Simple markdown-like renderer for the DB content
  const paragraphs = content.split('\n\n')
  
  return (
    <>
      {paragraphs.map((paragraph, index) => {
        if (paragraph.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-10 mb-4">{paragraph.replace('## ', '')}</h2>
        }
        if (paragraph.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">{paragraph.replace('### ', '')}</h3>
        }
        
        return (
          <p 
            key={index} 
            className="text-gray-700 leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ 
              __html: sanitizeHtml(paragraph
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br />')
              )
            }}
          />
        )
      })}
    </>
  )
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug: resolvedParams.slug }
  })
  
  if (!post || !post.isPublished) {
    notFound()
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      category: post.category,
      id: { not: post.id },
      isPublished: true
    },
    take: 2,
    orderBy: { publishedAt: 'desc' }
  })

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.titleDe,
    "image": post.image ? [post.image] : [],
    "datePublished": post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    "dateModified": post.updatedAt.toISOString(),
    "author": [{
      "@type": "Person",
      "name": post.author
    }],
    "publisher": {
      "@type": "Organization",
      "name": "NOVA INDUKT",
      "logo": {
        "@type": "ImageObject",
        "url": "https://nova-indukt.de/favicon.svg"
      }
    },
    "description": post.excerptDe
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-white">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <Link 
                href="/blog" 
                className="inline-flex items-center gap-2 text-gray-500 hover:text-[#4ECCA3] transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Blog
              </Link>
              
              <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-8">
                {post.image && (
                  <Image
                    src={post.image}
                    alt={post.titleDe}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-3 py-1 bg-[#4ECCA3] text-white text-sm font-bold rounded-full mb-3 inline-block">
                    {post.category}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{post.titleDe}</h1>
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
              </div>

              {/* Share */}
              <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-200">
                <span className="text-sm text-gray-500">Teilen:</span>
                <button className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Facebook className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 bg-sky-500 text-white rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors">
                  <Twitter className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 bg-blue-700 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                {renderContent(post.contentDe)}
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Verwandte Artikel
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link 
                      key={relatedPost.id} 
                      href={`/blog/${relatedPost.slug}`}
                      className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative aspect-video">
                        {relatedPost.image && (
                          <Image
                            src={relatedPost.image}
                            alt={relatedPost.titleDe}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <span className="text-xs text-[#4ECCA3] font-medium">{relatedPost.category}</span>
                        <h3 className="font-semibold text-gray-900 mt-1 group-hover:text-[#4ECCA3] transition-colors">
                          {relatedPost.titleDe}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </>
  )
}
