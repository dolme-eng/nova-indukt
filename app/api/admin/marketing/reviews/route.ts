import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { id, isPublished, isVerified, action } = body

    if (action === "toggle-publish") {
      const review = await prisma.review.update({
        where: { id },
        data: { isPublished }
      })
      return NextResponse.json(review)
    }

    if (action === "toggle-verify") {
      const review = await prisma.review.update({
        where: { id },
        data: { isVerified }
      })
      return NextResponse.json(review)
    }

    return new NextResponse("Invalid action", { status: 400 })
  } catch (error) {
    console.error("[MARKETING_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return new NextResponse("Missing ID", { status: 400 })
    }

    await prisma.review.delete({
      where: { id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[MARKETING_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
