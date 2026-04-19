import { NextRequest, NextResponse } from 'next/server'
import { checkAndCreateRandomPromotion, cleanupExpiredPromotions } from '@/lib/promotions/random-promotions'

// API Route: Check and create random promotions
// Should be called by a cron job (e.g., Vercel Cron, GitHub Actions)
// 
// Cron: 0 9 * * * (Every day at 9 AM)
// Or: Every 30 minutes (30 * * * *) for more frequent checks
export async function GET(request: NextRequest) {
  try {
    // Optional: Verify cron secret for security
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Cleanup expired promotions first
    const cleanedCount = await cleanupExpiredPromotions()
    
    // Try to create a new random promotion
    const created = await checkAndCreateRandomPromotion()
    
    return NextResponse.json({
      success: true,
      cleanedCount,
      promotionCreated: created,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in promotion check:', error)
    return NextResponse.json(
      { error: 'Failed to check promotions' },
      { status: 500 }
    )
  }
}
