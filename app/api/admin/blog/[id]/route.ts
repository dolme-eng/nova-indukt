import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"
import { updateBlogPostSchema } from "@/lib/validations/admin"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = await rateLimit(createRateLimitKey(getIP(request), 'admin:blog:put'), { windowMs: 60_000, maxRequests: 15 })
  if (!rl.success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

    const { id } = await params

    const body = await request.json()
    const parsed = updateBlogPostSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Daten", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const currentPost = await prisma.blogPost.findUnique({ where: { id } })
    if (!currentPost) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const data = parsed.data
    let publishedAt = currentPost.publishedAt
    if (data.isPublished && !currentPost.isPublished) {
      publishedAt = new Date()
    }

    const post = await prisma.blogPost.update({
      where: { id },
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
        publishedAt,
      }
    })

    await auditLog({
      action: "UPDATE",
      entityType: "BlogPost",
      entityId: post.id,
      userId: authz.session.user.id,
      oldValues: currentPost,
      newValues: post,
      ipAddress: request.headers.get("x-forwarded-for"),
      userAgent: request.headers.get("user-agent"),
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = await rateLimit(createRateLimitKey(getIP(request), 'admin:blog:delete'), { windowMs: 60_000, maxRequests: 15 })
  if (!rl.success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

    const { id } = await params

    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 })

    await prisma.blogPost.delete({ where: { id } })

    await auditLog({
      action: "DELETE",
      entityType: "BlogPost",
      entityId: id,
      userId: authz.session.user.id,
      oldValues: post,
      ipAddress: request.headers.get("x-forwarded-for"),
      userAgent: request.headers.get("user-agent"),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
