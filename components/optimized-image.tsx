'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  containerClassName?: string
  priority?: boolean
  sizes?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
}

// Placeholder SVG tiny base64 pour images locales
const BLUR_DATA_URL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3C/svg%3E"

export function OptimizedImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  containerClassName,
  priority,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  objectFit = 'cover',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Détecter si c'est une URL externe
  const isExternal = src.startsWith('http')
  
  // Détecter si c'est un format webp/avif
  const isModernFormat = src.endsWith('.webp') || src.endsWith('.avif')

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Placeholder de chargement */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      
      {/* Image principale */}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={cn(
          "transition-all duration-500",
          objectFit === 'cover' && "object-cover",
          objectFit === 'contain' && "object-contain",
          isLoading ? "opacity-0 scale-105" : "opacity-100 scale-100",
          error && "opacity-50",
          className
        )}
        priority={priority}
        sizes={sizes}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        quality={75}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setError(true)
        }}
      />
      
      {/* Fallback en cas d'erreur */}
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Bild nicht verfügbar</span>
        </div>
      )}
    </div>
  )
}

// Composant spécifique pour les images produits
interface ProductImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

export function ProductImage({ src, alt, className, priority }: ProductImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      priority={priority}
      containerClassName={cn("relative w-full h-full", className)}
      className="object-contain p-2 sm:p-4"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  )
}
