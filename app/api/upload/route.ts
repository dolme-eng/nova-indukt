import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { uploadImage, deleteImage } from "@/lib/cloudinary"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { logError } from "@/lib/logger"

// POST - Upload image
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    // Only admins can upload images
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const rl = await rateLimit(createRateLimitKey(getIP(request), "upload:post"), { windowMs: 60_000, maxRequests: 15 })
    if (!rl.success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'nova-indukt/uploads'
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPG, PNG, WebP, GIF" },
        { status: 400 }
      )
    }
    
    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 }
      )
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Upload to Cloudinary
    const result = await uploadImage(buffer, folder)
    
    return NextResponse.json({
      success: true,
      image: {
        id: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
      }
    })
  } catch (error) {
    logError("Error uploading image:", error)
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    )
  }
}

// DELETE - Delete image
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    // Only admins can delete images
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const rl = await rateLimit(createRateLimitKey(getIP(request), "upload:delete"), { windowMs: 60_000, maxRequests: 15 })
    if (!rl.success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })
    
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('id')
    
    if (!publicId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      )
    }
    
    await deleteImage(publicId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    logError("Error deleting image:", error)
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    )
  }
}
