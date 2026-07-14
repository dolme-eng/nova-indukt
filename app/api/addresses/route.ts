import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { logError } from "@/lib/logger"

const addressSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  company: z.string().max(100).optional().nullable(),
  street: z.string().min(3).max(200),
  street2: z.string().max(200).optional().nullable(),
  zipCode: z.string().min(3).max(20),
  city: z.string().min(2).max(100),
  country: z.string().default("DE"),
  phone: z.string().max(50).optional().nullable(),
  isDefault: z.boolean().default(false),
  type: z.enum(["SHIPPING", "BILLING", "BOTH"]).default("SHIPPING"),
})

const addressUpdateSchema = addressSchema.partial()

// GET - Fetch all addresses for user
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    })
    
    return NextResponse.json(addresses)
  } catch (error) {
    logError("Error fetching addresses:", error)
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    )
  }
}

// POST - Create new address
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const rl = await rateLimit(createRateLimitKey(getIP(request), "addresses:post"), { windowMs: 60_000, maxRequests: 10 })
    if (!rl.success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })
    
    const body = await request.json()
    const result = addressSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }
    
    const data = result.data
    
    // First address becomes default automatically
    const existingCount = await prisma.address.count({
      where: { userId: session.user.id }
    })
    
    const isFirstAddress = existingCount === 0
    const shouldBeDefault = data.isDefault || isFirstAddress

    // If setting as default, unset other defaults
    if (shouldBeDefault && !isFirstAddress) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      })
    }
    
    const address = await prisma.address.create({
      data: {
        ...data,
        userId: session.user.id,
        isDefault: shouldBeDefault,
      },
    })
    
    return NextResponse.json(address, { status: 201 })
  } catch (error) {
    logError("Error creating address:", error)
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    )
  }
}

// PUT - Update address
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const rl = await rateLimit(createRateLimitKey(getIP(request), "addresses:put"), { windowMs: 60_000, maxRequests: 10 })
    if (!rl.success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })
    
    const { searchParams } = new URL(request.url)
    const addressId = searchParams.get('id')
    
    if (!addressId) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      )
    }
    
    // Verify ownership
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId: session.user.id }
    })
    
    if (!existingAddress) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      )
    }
    
    const body = await request.json()
    const result = addressUpdateSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }
    
    const data = result.data
    
    // If setting as default, unset other defaults
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: session.user.id, 
          isDefault: true,
          id: { not: addressId }
        },
        data: { isDefault: false },
      })
    }
    
    const address = await prisma.address.update({
      where: { id: addressId },
      data,
    })
    
    return NextResponse.json(address)
  } catch (error) {
    logError("Error updating address:", error)
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    )
  }
}

// DELETE - Remove address
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const rl = await rateLimit(createRateLimitKey(getIP(request), "addresses:delete"), { windowMs: 60_000, maxRequests: 10 })
    if (!rl.success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })
    
    const { searchParams } = new URL(request.url)
    const addressId = searchParams.get('id')
    
    if (!addressId) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      )
    }
    
    // Verify ownership
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId: session.user.id }
    })
    
    if (!existingAddress) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      )
    }
    
    await prisma.address.delete({
      where: { id: addressId }
    })
    
    // If this was a default, set another as default if any remain
    if (existingAddress.isDefault) {
      const remaining = await prisma.address.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'asc' }
      })
      
      if (remaining) {
        await prisma.address.update({
          where: { id: remaining.id },
          data: {
            isDefault: true,
          }
        })
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    logError("Error deleting address:", error)
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    )
  }
}
