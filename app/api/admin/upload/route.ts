import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { uploadImage } from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to base64
    const buffer = Buffer.from(await file.arrayBuffer())
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`
    
    // Upload to Cloudinary
    const result = await uploadImage(base64File, "nova-indukt/products")

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
