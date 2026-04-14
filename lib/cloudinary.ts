import { v2 as cloudinary } from 'cloudinary'

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Cloudinary environment variables are not defined')
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

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
  options: Record<string, any> = {}
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file,
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        max_bytes: 10 * 1024 * 1024, // 10MB max
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ],
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
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
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
  return cloudinary.url(publicId, {
    transformation: [
      { width: 50, crop: 'scale' },
      { quality: 1 },
      { blur: 1000 }
    ],
    secure: true,
  })
}
