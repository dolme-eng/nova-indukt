import { NextResponse } from 'next/server'
import { getBankDetails } from '@/lib/data/bank-details'

/**
 * Public endpoint — returns current bank details for checkout display.
 * No auth required; data is already publicly visible on the /informations-de-paiement page.
 */
export async function GET() {
  try {
    const data = await getBankDetails()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
