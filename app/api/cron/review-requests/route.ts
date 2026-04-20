import { NextRequest, NextResponse } from 'next/server'
import { sendReviewRequests } from '@/lib/email/automated-emails'

/**
 * GET: Send review request emails
 * Cron: 0 10 * * * (Every day at 10 AM)
 * 
 * This checks for orders delivered 7 days ago and sends review requests
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
    
    const result = await sendReviewRequests()
    
    return NextResponse.json({
      ...result,
      success: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in review requests cron:', error)
    return NextResponse.json(
      { error: 'Failed to process review requests' },
      { status: 500 }
    )
  }
}
