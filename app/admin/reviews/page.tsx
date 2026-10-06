import ReviewsList from './_components/reviews-list'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { AdminPagination } from '../_components/admin-pagination'
import { DEFAULT_PAGE_SIZE, parsePageParam } from '@/lib/utils/pagination'
export const dynamic = 'force-dynamic'

const PAGE_SIZE = DEFAULT_PAGE_SIZE

type SearchParams = Promise<{
  q?: string
  rating?: string
  status?: string
  page?: string
}>

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const resolved = await searchParams
  const page = parsePageParam(resolved.page)
  const q = resolved.q?.trim()

  const where: Prisma.ReviewWhereInput = {}
  if (q) {
    where.OR = [
      { content: { contains: q, mode: 'insensitive' } },
      { title: { contains: q, mode: 'insensitive' } },
      { user: { name: { contains: q, mode: 'insensitive' } } },
      { user: { email: { contains: q, mode: 'insensitive' } } },
      { product: { nameDe: { contains: q, mode: 'insensitive' } } },
    ]
  }
  const rating = Number.parseInt(resolved.rating ?? '', 10)
  if (Number.isFinite(rating) && rating >= 1 && rating <= 5) {
    where.rating = rating
  }
  if (resolved.status === 'published') where.isPublished = true
  if (resolved.status === 'draft') where.isPublished = false

  const [reviews, totalCount, pendingCount] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        product: {
          select: {
            nameDe: true,
            images: { where: { isMain: true }, take: 1 },
          },
        },
        user: { select: { name: true, email: true, image: true } },
      },
    }),
    prisma.review.count({ where }),
    prisma.review.count({ where: { ...where, isPublished: false } }),
  ])

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const currentParams = {
    q: resolved.q,
    rating: resolved.rating,
    status: resolved.status,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Kundenbewertungen</h1>
        <p className="text-sm text-slate-500">
          Moderieren und verwalten Sie Kundenmeinungen zu Ihren Produkten ({totalCount}{' '}
          Bewertungen, davon {pendingCount} unpublished)
        </p>
      </div>

      <ReviewsList
        reviews={reviews}
        currentParams={currentParams}
        hasFilters={
          Boolean(q) || where.rating !== undefined || Boolean(resolved.status)
        }
      />

      <AdminPagination
        basePath="/admin/reviews"
        currentParams={currentParams}
        page={safePage}
        totalPages={totalPages}
        totalCount={totalCount}
        itemLabel="Bewertungen"
      />
    </div>
  )
}
