import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"
import { createBlogPostSchema } from "@/lib/validations/admin"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { logError } from "@/lib/logger"
import { validateCsrfToken } from "@/lib/csrf"

export async function POST(request: NextRequest) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Nicht autorisiert" }, { status: authz.status })

    const rl = await rateLimit(createRateLimitKey(getIP(request), 'admin:blog:post'), { windowMs: 60_000, maxRequests: 15 })
    if (!rl.success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })

    const csrfError = validateCsrfToken(request)
    if (csrfError) return csrfError

    const body = await request.json()
    const parsed = createBlogPostSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Daten", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Slug collision → 409 (was: raw Prisma P2002 → 500)
    const existing = await prisma.blogPost.findUnique({
      where: { slug: data.slug },
      select: { id: true },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Ein Artikel mit diesem Slug existiert bereits' },
        { status: 409 }
      )
    }

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
      newValues: { titleDe: post.titleDe, slug: post.slug, isPublished: post.isPublished },
      ipAddress: getIP(request),
      userAgent: request.headers.get("user-agent"),
    })

    revalidatePath('/blog')
    revalidatePath('/')

    return NextResponse.json(post)
  } catch (error) {
    logError("Error creating blog post:", error)
    return NextResponse.json({ error: "Interner Fehler" }, { status: 500 })
  }
}
