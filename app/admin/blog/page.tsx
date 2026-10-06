import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { BlogTable } from './blog-table'
import { AdminPagination } from '../_components/admin-pagination'
import { DEFAULT_PAGE_SIZE, parsePageParam } from '@/lib/utils/pagination'

const PAGE_SIZE = DEFAULT_PAGE_SIZE

type SearchParams = Promise<{
  q?: string
  status?: string
  category?: string
  page?: string
}>

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const resolved = await searchParams
  const page = parsePageParam(resolved.page)
  const q = resolved.q?.trim()

  const where: Prisma.BlogPostWhereInput = {}
  if (q) {
    where.OR = [
      { titleDe: { contains: q, mode: 'insensitive' } },
      { excerptDe: { contains: q, mode: 'insensitive' } },
      { slug: { contains: q, mode: 'insensitive' } },
    ]
  }
  if (resolved.status === 'published') where.isPublished = true
  if (resolved.status === 'draft') where.isPublished = false
  if (resolved.category) where.category = resolved.category

  // Totals via count(), not by filtering the current page in the browser.
  const [posts, totalCount, publishedCount, draftCount, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.blogPost.count({ where }),
    prisma.blogPost.count({ where: { ...where, isPublished: true } }),
    prisma.blogPost.count({ where: { ...where, isPublished: false } }),
    prisma.blogPost.findMany({
      where: { category: { not: null } },
      distinct: ['category'],
      select: { category: true },
      orderBy: { category: 'asc' },
    }),
  ])

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const currentParams = {
    q: resolved.q,
    status: resolved.status,
    category: resolved.category,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog / Magazin</h1>
          <p className="text-slate-500">Verwalten Sie Ihre Magazinartikel ({totalCount} Artikel)</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-primary/90"
        >
          <Plus size={18} />
          Neuer Artikel
        </Link>
      </div>

      <BlogTable
        posts={posts}
        currentParams={currentParams}
        stats={{
          total: totalCount,
          published: publishedCount,
          draft: draftCount,
        }}
        categories={categories
          .map((c) => c.category)
          .filter((c): c is string => Boolean(c))}
        hasFilters={Boolean(q) || Boolean(resolved.status) || Boolean(resolved.category)}
      />

      <AdminPagination
        basePath="/admin/blog"
        currentParams={currentParams}
        page={safePage}
        totalPages={totalPages}
        totalCount={totalCount}
        itemLabel="Artikel"
      />
    </div>
  )
}
