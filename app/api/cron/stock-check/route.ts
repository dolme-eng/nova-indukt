import { NextRequest, NextResponse } from 'next/server'
import { checkStockAndAlert } from '@/lib/email/automated-emails'

/**
 * GET: Check stock levels and send alerts
 * Cron: 0 9 * * * (Every day at 9 AM)
 * 
 * This checks for low stock and out of stock products
 * and sends email alerts to admin
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const result = await checkStockAndAlert()
    
    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in stock check cron:', error)
    return NextResponse.json(
      { error: 'Failed to check stock levels' },
      { status: 500 }
    )
  }
}
