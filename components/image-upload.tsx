'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, ImageIcon, Loader2, Check, AlertCircle } from 'lucide-react'

interface UploadedImage {
  id: string
  url: string
  width: number
  height: number
}

interface ImageUploadProps {
  onUpload: (images: UploadedImage[]) => void
  onRemove?: (imageId: string) => void
  initialImages?: UploadedImage[]
  maxFiles?: number
  folder?: string
  className?: string
}

export function ImageUpload({
  onUpload,
  onRemove,
  initialImages = [],
  maxFiles = 5,
  folder = 'nova-indukt/uploads',
  className = '',
}: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>(initialImages)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const uploadFile = async (file: File): Promise<UploadedImage | null> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      return data.image
    } catch (err) {
      console.error('Upload error:', err)
      throw err
    }
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setError(null)
    setIsUploading(true)

    const remainingSlots = maxFiles - images.length
    const filesToUpload = Array.from(files).slice(0, remainingSlots)

    if (files.length > remainingSlots) {
      setError(`Nur ${remainingSlots} Bilder können noch hinzugefügt werden`)
    }

    const newImages: UploadedImage[] = []

    for (const file of filesToUpload) {
      try {
        const image = await uploadFile(file)
        if (image) {
          newImages.push(image)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload fehlgeschlagen')
      }
    }

    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages]
      setImages(updatedImages)
      onUpload(updatedImages)
    }

    setIsUploading(false)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [images])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    // Reset input to allow uploading same file again
    e.target.value = ''
  }

  const handleRemove = async (imageId: string) => {
    try {
      // Delete from server
      const response = await fetch(`/api/upload?id=${encodeURIComponent(imageId)}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        console.error('Failed to delete image from server')
        // Continue with local removal even if server delete fails
      }

      // Remove from local state
      const updatedImages = images.filter(img => img.id !== imageId)
      setImages(updatedImages)
      onUpload(updatedImages)
      onRemove?.(imageId)
    } catch (err) {
      console.error('Remove error:', err)
    }
  }

  const canAddMore = images.length < maxFiles

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}

      {/* Image Grid */}
      <AnimatePresence mode="popLayout">
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          >
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
                className="relative group aspect-square"
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={image.url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <button
                      onClick={() => handleRemove(image.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      title="Bild entfernen"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dimensions badge */}
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                    {image.width}×{image.height}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Zone */}
      {canAddMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`relative border-2 border-dashed rounded-xl p-6 transition-colors ${
            isDragging
              ? 'border-[#4ECCA3] bg-[#4ECCA3]/5'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />

          <div className="text-center">
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-[#4ECCA3] animate-spin" />
                <p className="text-sm text-gray-600">Wird hochgeladen...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-[#4ECCA3]/10 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-[#4ECCA3]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Bilder hierher ziehen oder klicken
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, WebP, GIF (max. 10MB)
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  {images.length} / {maxFiles} Bildern
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Single image upload variant for profile photos, etc.
interface SingleImageUploadProps {
  onUpload: (image: UploadedImage | null) => void
  initialImage?: UploadedImage | null
  folder?: string
  aspectRatio?: string
  className?: string
}

export function SingleImageUpload({
  onUpload,
  initialImage = null,
  folder = 'nova-indukt/avatars',
  aspectRatio = '1 / 1',
  className = '',
}: SingleImageUploadProps) {
  const [image, setImage] = useState<UploadedImage | null>(initialImage)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError(null)
    setIsUploading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      setImage(data.image)
      onUpload(data.image)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload fehlgeschlagen')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = async () => {
    if (image) {
      try {
        await fetch(`/api/upload?id=${encodeURIComponent(image.id)}`, {
          method: 'DELETE',
        })
      } catch (err) {
        console.error('Failed to delete image:', err)
      }
    }
    setImage(null)
    onUpload(null)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-50 text-red-600 rounded-lg text-xs">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}

      <div
        className="relative overflow-hidden rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
        style={{ aspectRatio }}
      >
        {image ? (
          <>
            <img
              src={image.url}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center">
              <button
                onClick={handleRemove}
                className="opacity-0 hover:opacity-100 transition-opacity p-2 bg-red-500 text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-[#4ECCA3] animate-spin" />
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">Bild hochladen</span>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        )}
      </div>
    </div>
  )
}
