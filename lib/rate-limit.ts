// Simple in-memory rate limiting for API routes
// For production, consider using Redis (Upstash) for distributed rate limiting

type RateLimitStore = {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

const defaultOptions: RateLimitOptions = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
}

export function rateLimit(
  identifier: string,
  options: Partial<RateLimitOptions> = {}
): { success: boolean; limit: number; remaining: number; resetTime: number } {
  const config = { ...defaultOptions, ...options }
  const now = Date.now()
  
  // Clean up old entries
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  }
  
  // Get or create entry
  if (!store[identifier] || store[identifier].resetTime < now) {
    store[identifier] = {
      count: 0,
      resetTime: now + config.windowMs,
    }
  }
  
  const entry = store[identifier]
  
  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetTime: entry.resetTime,
    }
  }
  
  // Increment counter
  entry.count++
  
  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  }
}

// Get IP address from request
export function getIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

// Create a rate limit key from IP and route
export function createRateLimitKey(ip: string, route: string): string {
  return `${ip}:${route}`
}
