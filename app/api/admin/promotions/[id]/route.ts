import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Récupérer une promotion spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const promotion = await prisma.promotion.findUnique({
      where: { id }
    })

    if (!promotion) {
      return NextResponse.json(
        { error: 'Promotion not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(promotion)
  } catch (error) {
    console.error('Error fetching promotion:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promotion' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour une promotion
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    const promotion = await prisma.promotion.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        code: data.code,
        isCoupon: data.isCoupon ?? false,
        discountType: data.discountType,
        discountValue: data.discountValue,
        isGlobal: data.isGlobal,
        productIds: data.productIds || [],
        categoryIds: data.categoryIds || [],
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        minOrderAmount: data.minOrderAmount,
        maxDiscount: data.maxDiscount,
        usageLimit: data.usageLimit,
        badge: data.badge,
        bannerText: data.bannerText,
        highlightColor: data.highlightColor,
        isActive: data.isActive
      }
    })

    return NextResponse.json(promotion)
  } catch (error) {
    console.error('Error updating promotion:', error)
    return NextResponse.json(
      { error: 'Failed to update promotion' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une promotion
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.promotion.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting promotion:', error)
    return NextResponse.json(
      { error: 'Failed to delete promotion' },
      { status: 500 }
    )
  }
}
