import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react'
import { ShareButtons } from './share-buttons'

// Sanitize text for safe HTML rendering
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug: resolvedParams.slug }
  })
  
  if (!post) {
    return {
      title: 'Artikel nicht gefunden',
    }
  }

  const title = post.titleDe
  const description = post.excerptDe || ''

  return {
    title: `${title} | Blog`,
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

function renderInlineMarkdown(text: string): string {
  let safe = escapeHtml(text)
  safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  safe = safe.replace(/\*(.+?)\*/g, '<em>$1</em>')
  safe = safe.replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
  safe = safe.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, linkText, url) => {
    // Only allow http/https/relative URLs — block javascript: URIs
    if (/^(https?:\/\/|\/|#)/.test(url)) {
      return `<a href="${url}" class="text-[#4ECCA3] hover:underline" target="_blank" rel="noopener noreferrer">${linkText}</a>`
    }
    return linkText
  })
  return safe
}

function renderContent(content: string): JSX.Element {
  const lines = content.split('\n')
  const elements: JSX.Element[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Headings
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4">{renderInlineMarkdown(line.replace('## ', ''))}</h2>)
      i++
      continue
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-xl font-semibold text-gray-900 mt-6 mb-3">{renderInlineMarkdown(line.replace('### ', ''))}</h3>)
      i++
      continue
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].replace('> ', ''))
        i++
      }
      elements.push(
        <blockquote key={i} className="border-l-4 border-[#4ECCA3] pl-4 py-2 my-4 bg-gray-50 rounded-r-lg">
          <p className="text-gray-600 italic" dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(quoteLines.join(' ')) }} />
        </blockquote>
      )
      continue
    }

    // Unordered list
    if (line.startsWith('- ')) {
      const listItems: string[] = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        listItems.push(lines[i].replace('- ', ''))
        i++
      }
      elements.push(
        <ul key={i} className="list-disc list-inside space-y-1 my-4 text-gray-700">
          {listItems.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item) }} />
          ))}
        </ul>
      )
      continue
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const listItems: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\.\s/, ''))
        i++
      }
      elements.push(
        <ol key={i} className="list-decimal list-inside space-y-1 my-4 text-gray-700">
          {listItems.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item) }} />
          ))}
        </ol>
      )
      continue
    }

    // Table
    if (line.includes('|') && i + 1 < lines.length && lines[i + 1]?.includes('---')) {
      const headers = line.split('|').map(h => h.trim()).filter(Boolean)
      i += 2 // skip header + separator
      const rows: string[][] = []
      while (i < lines.length && lines[i].includes('|')) {
        rows.push(lines[i].split('|').map(c => c.trim()).filter(Boolean))
        i++
      }
      elements.push(
        <div key={i} className="overflow-x-auto my-6">
          <table className="w-full border-collapse border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                {headers.map((h, j) => (
                  <th key={j} className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">{renderInlineMarkdown(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, j) => (
                <tr key={j} className="border-b border-gray-100 hover:bg-gray-50">
                  {row.map((cell, k) => (
                    <td key={k} className="px-4 py-3 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(cell) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    // Empty line
    if (line.trim() === '') {
      i++
      continue
    }

    // Image
    if (line.startsWith('![')) {
      const match = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
      if (match) {
        elements.push(
          <div key={i} className="my-6">
            <Image src={match[2]} alt={match[1]} width={800} height={450} className="rounded-xl w-full" />
            {match[1] && <p className="text-center text-sm text-gray-500 mt-2">{match[1]}</p>}
          </div>
        )
        i++
        continue
      }
    }

    // Regular paragraph — collect consecutive non-empty lines
    const paraLines: string[] = []
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('#') && !lines[i].startsWith('- ') && !/^\d+\.\s/.test(lines[i]) && !lines[i].startsWith('> ') && !lines[i].startsWith('![')) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length > 0) {
      elements.push(
        <p key={i} className="text-gray-700 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(paraLines.join(' ')) }} />
      )
    }
  }

  return <>{elements}</>
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
              <ShareButtons slug={resolvedParams.slug} title={post.titleDe} />
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
