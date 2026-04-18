import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    // Vérification admin simplifiée pour l'exemple
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

    const post = await prisma.blogPost.create({
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
        publishedAt: isPublished ? new Date() : null
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
