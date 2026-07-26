/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  experimental: {},
  compress: true,
  poweredByHeader: false,
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
    ]

    if (process.env.NODE_ENV === 'production') {
      securityHeaders.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      })
    }

    // CSP applied to ALL routes (not just middleware-matched ones)
    // NOTE: 'strict-dynamic' is intentionally NOT used because Next.js loads
    // chunks via static <script> tags, which strict-dynamic blocks (it disables
    // 'self' and 'unsafe-inline' per CSP3 spec). Instead we rely on 'self' +
    // 'unsafe-inline' which is the standard Next.js CSP pattern.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/client",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://nova-indukt.de https://api.resend.com https://api.cloudinary.com https://res.cloudinary.com",
      "frame-src 'self' https://accounts.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ')

    securityHeaders.push({
      key: 'Content-Security-Policy',
      value: csp,
    })

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/wartung',
        destination: '/',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
