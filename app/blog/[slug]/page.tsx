import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React, { cache } from 'react'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react'
import { ShareButtons } from './share-buttons'
import { safeJsonLd } from '@/lib/utils/json-ld'

export const revalidate = 600

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true },
  })
  return posts.map((p) => ({ slug: p.slug }))
}

const getBlogPostBySlug = cache(async (slug: string) => {
  return prisma.blogPost.findUnique({ where: { slug } })
})

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
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getBlogPostBySlug(resolvedParams.slug)

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

// Render inline markdown as safe React elements (no dangerouslySetInnerHTML)
function renderInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let key = 0

  let lastIndex = 0
  let match: RegExpExecArray | null

  const tokens: { type: string; text: string; url?: string; index: number }[] = []

  // Collect bold tokens
  const boldRegex = /\*\*(.+?)\*\*/g
  boldRegex.lastIndex = 0
  while ((match = boldRegex.exec(text)) !== null) {
    tokens.push({ type: 'bold', text: match[1], index: match.index })
  }

  // Collect italic tokens (only single *, not overlapping with bold)
  const italicRegex = /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g
  italicRegex.lastIndex = 0
  while ((match = italicRegex.exec(text)) !== null) {
    tokens.push({ type: 'italic', text: match[1], index: match.index })
  }

  // Collect code tokens
  const codeRegex = /`(.+?)`/g
  codeRegex.lastIndex = 0
  while ((match = codeRegex.exec(text)) !== null) {
    tokens.push({ type: 'code', text: match[1], index: match.index })
  }

  // Sort by position, break ties by length (longer first)
  tokens.sort((a, b) => a.index - b.index || b.text.length - a.text.length)

  // Build JSX from tokens
  lastIndex = 0
  for (const token of tokens) {
    // Skip if this token overlaps with a previous one
    if (token.index < lastIndex) continue

    // Add plain text before this token
    if (token.index > lastIndex) {
      parts.push(<span key={key++}>{escapeHtml(text.slice(lastIndex, token.index))}</span>)
    }

    if (token.type === 'bold') {
      parts.push(
        <strong key={key++} className="font-semibold">
          {token.text}
        </strong>
      )
    } else if (token.type === 'italic') {
      parts.push(<em key={key++}>{token.text}</em>)
    } else if (token.type === 'code') {
      parts.push(
        <code key={key++} className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm">
          {escapeHtml(token.text)}
        </code>
      )
    }

    lastIndex =
      token.index +
      token.text.length +
      (token.type === 'bold' ? 4 : token.type === 'italic' ? 2 : 2)
  }

  // Add remaining plain text
  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{escapeHtml(text.slice(lastIndex))}</span>)
  }

  return parts.length > 0 ? parts : escapeHtml(text)
}

// Render a link safely: [text](url)
function renderLink(text: string): React.ReactNode {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let key = 0
  let match: RegExpExecArray | null

  linkRegex.lastIndex = 0
  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={key++}>{renderInlineMarkdown(text.slice(lastIndex, match.index))}</span>
      )
    }
    const [, linkText, url] = match
    if (/^(https?:\/\/|\/|#)/.test(url)) {
      parts.push(
        <a
          key={key++}
          href={url}
          className="text-[#4ECCA3] hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkText}
        </a>
      )
    } else {
      parts.push(<span key={key++}>{linkText}</span>)
    }
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{renderInlineMarkdown(text.slice(lastIndex))}</span>)
  }

  return parts.length > 0 ? parts : renderInlineMarkdown(text)
}

function renderContent(content: string): React.JSX.Element {
  const lines = content.split('\n')
  const elements: React.JSX.Element[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Headings
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="mb-4 mt-10 text-2xl font-bold text-gray-900">
          {renderLink(line.replace('## ', ''))}
        </h2>
      )
      i++
      continue
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="mb-3 mt-6 text-xl font-semibold text-gray-900">
          {renderLink(line.replace('### ', ''))}
        </h3>
      )
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
        <blockquote
          key={i}
          className="my-4 rounded-r-lg border-l-4 border-[#4ECCA3] bg-gray-50 py-2 pl-4"
        >
          <p className="italic text-gray-600">{renderLink(quoteLines.join(' '))}</p>
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
        <ul key={i} className="my-4 list-inside list-disc space-y-1 text-gray-700">
          {listItems.map((item, j) => (
            <li key={j}>{renderLink(item)}</li>
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
        <ol key={i} className="my-4 list-inside list-decimal space-y-1 text-gray-700">
          {listItems.map((item, j) => (
            <li key={j}>{renderLink(item)}</li>
          ))}
        </ol>
      )
      continue
    }

    // Table
    if (line.includes('|') && i + 1 < lines.length && lines[i + 1]?.includes('---')) {
      const headers = line
        .split('|')
        .map((h) => h.trim())
        .filter(Boolean)
      i += 2 // skip header + separator
      const rows: string[][] = []
      while (i < lines.length && lines[i].includes('|')) {
        rows.push(
          lines[i]
            .split('|')
            .map((c) => c.trim())
            .filter(Boolean)
        )
        i++
      }
      elements.push(
        <div key={i} className="my-6 overflow-x-auto">
          <table className="w-full border-collapse rounded-lg border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                {headers.map((h, j) => (
                  <th
                    key={j}
                    className="border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {renderLink(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, j) => (
                <tr key={j} className="border-b border-gray-100 hover:bg-gray-50">
                  {row.map((cell, k) => (
                    <td key={k} className="px-4 py-3 text-sm text-gray-700">
                      {renderLink(cell)}
                    </td>
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
            <Image
              src={match[2]}
              alt={match[1]}
              width={800}
              height={450}
              className="w-full rounded-xl"
            />
            {match[1] && <p className="mt-2 text-center text-sm text-gray-500">{match[1]}</p>}
          </div>
        )
        i++
        continue
      }
    }

    // Regular paragraph — collect consecutive non-empty lines
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('- ') &&
      !/^\d+\.\s/.test(lines[i]) &&
      !lines[i].startsWith('> ') &&
      !lines[i].startsWith('![')
    ) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length > 0) {
      elements.push(
        <p key={i} className="mb-4 leading-relaxed text-gray-700">
          {renderLink(paraLines.join(' '))}
        </p>
      )
    }
  }

  return <>{elements}</>
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const post = await getBlogPostBySlug(resolvedParams.slug)

  if (!post || !post.isPublished) {
    notFound()
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      category: post.category,
      id: { not: post.id },
      isPublished: true,
    },
    take: 2,
    orderBy: { publishedAt: 'desc' },
  })

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.titleDe,
    image: post.image ? [post.image] : [],
    datePublished: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: [
      {
        '@type': 'Person',
        name: post.author,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'NOVA INDUKT',
      logo: {
        '@type': 'ImageObject',
        url: 'https://nova-indukt.de/favicon.svg',
      },
    },
    description: post.excerptDe,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }}
      />
      <article className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-white">
          <div className="container mx-auto px-4 py-8">
            <div className="mx-auto max-w-4xl">
              <Link
                href="/blog"
                className="mb-6 inline-flex items-center gap-2 text-gray-500 transition-colors hover:text-[#4ECCA3]"
              >
                <ArrowLeft className="h-4 w-4" />
                Blog
              </Link>

              <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-2xl">
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
                  <span className="mb-3 inline-block rounded-full bg-[#4ECCA3] px-3 py-1 text-sm font-bold text-white">
                    {post.category}
                  </span>
                  <h1 className="text-2xl font-bold text-white md:text-3xl">{post.titleDe}</h1>
                </div>
              </div>

              {/* Meta */}
              <div className="mb-8 flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
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
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl bg-white p-8 shadow-sm md:p-12">
              <div className="prose prose-lg max-w-none">{renderContent(post.contentDe)}</div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-6 text-xl font-bold text-gray-900">Verwandte Artikel</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="group overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="relative aspect-video">
                        {relatedPost.image && (
                          <Image
                            src={relatedPost.image}
                            alt={relatedPost.titleDe}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <span className="text-xs font-medium text-[#4ECCA3]">
                          {relatedPost.category}
                        </span>
                        <h3 className="mt-1 font-semibold text-gray-900 transition-colors group-hover:text-[#4ECCA3]">
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
