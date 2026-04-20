import React from "react"
import ReviewsList from "./_components/reviews-list"
import { prisma } from "@/lib/prisma"

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: {
          nameDe: true,
          images: {
            where: { isMain: true },
            take: 1
          }
        }
      },
      user: {
        select: {
          name: true,
          email: true,
          image: true
        }
      }
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Kundenbewertungen</h1>
        <p className="text-slate-500 text-sm">Moderieren und verwalten Sie Kundenmeinungen zu Ihren Produkten ({reviews.length} Bewertungen)</p>
      </div>
      <ReviewsList initialReviews={reviews} />
    </div>
  )
}
