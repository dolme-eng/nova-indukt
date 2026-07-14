import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"
import { createBlogPostSchema } from "@/lib/validations/admin"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { logError } from "@/lib/logger"

export async function POST(request: NextRequest) {
  const rl = await rateLimit(createRateLimitKey(getIP(request), 'admin:blog:post'), { windowMs: 60_000, maxRequests: 15 })
  if (!rl.success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

    const body = await request.json()
    const parsed = createBlogPostSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Daten", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data
    const post = await prisma.blogPost.create({
      data: {
        titleDe: data.titleDe,
        slug: data.slug,
        contentDe: data.contentDe,
        isPublished: data.isPublished,
        excerptDe: data.excerptDe ?? null,
        image: data.image ?? null,
        category: data.category ?? null,
        author: data.author ?? undefined,
        readTime: data.readTime != null ? String(data.readTime) : null,
        publishedAt: data.isPublished ? new Date() : null,
      }
    })

    await auditLog({
      action: "CREATE",
      entityType: "BlogPost",
      entityId: post.id,
      userId: authz.session.user.id,
      newValues: post,
      ipAddress: request.headers.get("x-forwarded-for"),
      userAgent: request.headers.get("user-agent"),
    })

    return NextResponse.json(post)
  } catch (error) {
    logError("Error creating blog post:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
