import { v2 as cloudinary } from 'cloudinary'

// Lazy initialization flag
let _isConfigured = false

function ensureConfigured() {
  if (_isConfigured) return

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error('Cloudinary environment variables are not defined')
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })

  _isConfigured = true
}

export { cloudinary }

export interface UploadResult {
  public_id: string
  secure_url: string
  url: string
  width: number
  height: number
  format: string
  bytes: number
}

export async function uploadImage(
  file: string | Buffer,
  folder: string = 'nova-indukt/products',
  options: Record<string, string | number | boolean | undefined> = {}
): Promise<UploadResult> {
  ensureConfigured()
  let fileToUpload: string | Buffer = file
  if (Buffer.isBuffer(file)) {
    // Detect MIME type from magic bytes
    const mime = file[0] === 0xFF && file[1] === 0xD8 ? 'image/jpeg'
      : file[0] === 0x89 && file[1] === 0x50 ? 'image/png'
      : file[0] === 0x52 && file[1] === 0x49 ? 'image/webp'
      : file[0] === 0x47 && file[1] === 0x49 ? 'image/gif'
      : 'image/png'
    fileToUpload = `data:${mime};base64,${file.toString('base64')}`
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileToUpload as string,
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        max_bytes: 10 * 1024 * 1024, // 10MB max
        transformation: [{ quality: 'auto:good' }, { fetch_format: 'auto' }],
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else if (result) {
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            url: result.url,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          })
        } else {
          reject(new Error('Upload failed'))
        }
      }
    )
  })
}

export async function deleteImage(publicId: string): Promise<void> {
  ensureConfigured()
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

export function getOptimizedUrl(
  publicId: string,
  width?: number,
  height?: number,
  crop: string = 'fill'
): string {
  ensureConfigured()
  const options: string[] = [
    'f_auto', // Auto format
    'q_auto', // Auto quality
  ]

  if (width) options.push(`w_${width}`)
  if (height) options.push(`h_${height}`)
  if (width || height) options.push(`c_${crop}`)

  return cloudinary.url(publicId, {
    transformation: [options.join(',')],
    secure: true,
  })
}

export function getPlaceholderUrl(publicId: string): string {
  ensureConfigured()
  return cloudinary.url(publicId, {
    transformation: [{ width: 50, crop: 'scale' }, { quality: 1 }, { blur: 1000 }],
    secure: true,
  })
}
