import { NextResponse } from 'next/server'

/**
 * Stock management is handled externally.
 * This endpoint is deprecated and returns a no-op response.
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Stock management is handled externally.',
    timestamp: new Date().toISOString(),
  })
}
