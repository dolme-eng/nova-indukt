import { useMemo } from 'react'

interface CloudinaryImageOptions {
  width?: number
  height?: number
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'thumb'
  quality?: 'auto' | number
  format?: 'auto' | 'webp' | 'jpg' | 'png'
  effect?: string
}

/**
 * Pure function to build a Cloudinary URL (no hooks – safe to call anywhere).
 */
function buildCloudinaryUrl(
  publicId: string | undefined,
  options: CloudinaryImageOptions = {}
): string | null {
  if (!publicId) return null

  // If already a full URL, return as is
  if (publicId.startsWith('http')) {
    return publicId
  }

  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    effect,
  } = options

  const transformations: string[] = []

  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  if (width || height) transformations.push(`c_${crop}`)
  if (quality === 'auto') transformations.push('q_auto')
  else if (quality) transformations.push(`q_${quality}`)
  if (format === 'auto') transformations.push('f_auto')
  else if (format) transformations.push(`f_${format}`)
  if (effect) transformations.push(`e_${effect}`)

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  if (!cloudName) {
    // Cloudinary not configured - return null to use local fallback
    return null
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations.join(',')}/${publicId}`
}

/**
 * React hook for a single Cloudinary image URL.
 */
export function useCloudinaryUrl(
  publicId: string | undefined,
  options: CloudinaryImageOptions = {}
) {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    effect,
  } = options

  return useMemo(() => {
    return buildCloudinaryUrl(publicId, { width, height, crop, quality, format, effect })
  }, [publicId, width, height, crop, quality, format, effect])
}

// Hook for generating placeholder/blur URL
export function useCloudinaryPlaceholder(publicId: string | undefined) {
  return useCloudinaryUrl(publicId, {
    width: 50,
    quality: 1,
    effect: 'blur:1000',
  })
}

/**
 * Hook for responsive images — uses the pure function internally
 * instead of calling useCloudinaryUrl inside a callback (which violated
 * the Rules of Hooks).
 */
export function useResponsiveCloudinaryUrl(
  publicId: string | undefined,
  sizes: number[] = [400, 800, 1200]
) {
  return useMemo(() => {
    if (!publicId) return []

    return sizes.map(width => ({
      width,
      url: buildCloudinaryUrl(publicId, { width, format: 'auto', quality: 'auto' }),
    }))
  }, [publicId, sizes])
}
