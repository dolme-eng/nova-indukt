import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/require-admin'
import { auditLog } from '@/lib/admin/audit'
import { prisma } from '@/lib/prisma'
import { uploadImage } from '@/lib/cloudinary'
import { rateLimit, getIP, createRateLimitKey } from '@/lib/rate-limit'
import { logError } from '@/lib/logger'
import { validateCsrfToken } from '@/lib/csrf'

/**
 * Single admin upload endpoint.
 *
 * It replaces two divergent routes:
 *   - /api/upload         (folder whitelist, { success, image }, no MediaAsset row)
 *   - /api/admin/upload   (fixed folder, { url, publicId }, no MediaAsset row)
 *
 * Both reported a successful upload without indexing the asset, so images
 * uploaded through the product form were invisible in the media library.
 */
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 10 * 1024 * 1024
const ALLOWED_FOLDERS = [
  'nova-indukt/uploads',
  'nova-indukt/products',
  'nova-indukt/banners',
  'nova-indukt/categories',
  'nova-indukt/blog',
]
const DEFAULT_FOLDER = 'nova-indukt/uploads'

export async function POST(request: NextRequest) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: authz.status })
    }

    const csrfError = validateCsrfToken(request)
    if (csrfError) return csrfError

    const rl = await rateLimit(createRateLimitKey(getIP(request), 'admin:upload'), {
      windowMs: 60_000,
      maxRequests: 15,
    })
    if (!rl.success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })

    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Keine Datei angegeben' }, { status: 400 })
    }

    const folder = formData.get('folder')
    const targetFolder = typeof folder === 'string' && folder ? folder : DEFAULT_FOLDER
    if (!ALLOWED_FOLDERS.includes(targetFolder)) {
      return NextResponse.json({ error: 'Ungültiger Ordner' }, { status: 400 })
    }

    // `file.type` is declared by the client, so it is a filter, not proof.
    // The real check is Cloudinary's own format validation after upload
    // (lib/cloudinary.ts pins allowed_formats + resource_type: 'image').
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Ungültiger Dateityp. Erlaubt: JPG, PNG, WebP, GIF' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Datei zu groß. Maximum: 10MB' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await uploadImage(buffer, targetFolder)

    // Index the asset so it shows up in the media library. A failure here must
    // not fail the upload itself — log it and carry on.
    try {
      await prisma.mediaAsset.create({
        data: {
          publicId: result.public_id,
          url: result.secure_url,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
          format: result.format,
          folder: targetFolder,
          uploadedByUserId: authz.session.user.id,
        },
      })
    } catch (indexError) {
      logError('[UPLOAD] Could not index MediaAsset:', indexError)
    }

    await auditLog({
      action: 'CREATE',
      entityType: 'MediaAsset',
      entityId: result.public_id,
      userId: authz.session.user.id,
      newValues: {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
        folder: targetFolder,
      },
      ipAddress: getIP(request),
      userAgent: request.headers.get('user-agent'),
    })

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      folder: targetFolder,
    })
  } catch (error) {
    logError('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
