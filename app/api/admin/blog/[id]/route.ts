import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { 
      titleDe, 
      slug, 
      excerptDe, 
      contentDe, 
      image, 
      category, 
      author, 
      readTime, 
      isPublished 
    } = body

    // Récupérer l'état actuel pour gérer la date de publication
    const currentPost = await prisma.blogPost.findUnique({ where: { id } })
    
    let publishedAt = currentPost?.publishedAt
    if (isPublished && !currentPost?.isPublished) {
      publishedAt = new Date()
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        titleDe,
        slug,
        excerptDe,
        contentDe,
        image,
        category,
        author,
        readTime,
        isPublished,
        publishedAt
      }
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
  try {
    const session = await auth()
    const { id } = await params
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.blogPost.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
