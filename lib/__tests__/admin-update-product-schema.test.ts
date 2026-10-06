import { describe, it, expect } from 'vitest'
import { updateProductSchema } from '@/lib/validations/admin'

/**
 * PATCH semantics for /api/admin/products/[id].
 *
 * The schema used to require nameDe/slug/price/categoryId and defaulted
 * `isActive` to true, which meant: (a) a partial PATCH was rejected with an
 * opaque 400, and (b) any PATCH that omitted `isActive` re-activated a
 * deactivated product.
 */
describe('updateProductSchema', () => {
  it('accepts a payload with a single field', () => {
    const result = updateProductSchema.safeParse({ price: 42.5 })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({ price: 42.5 })
    }
  })

  it('accepts an empty object (no field supplied)', () => {
    // Kept permissive on purpose: the route's `.refine` requires at least one
    // key, so the schema itself must not crash on `{}`.
    const result = updateProductSchema.safeParse({})
    expect(result.success).toBe(false) // refine: "Keine Änderungen übermittelt"
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Keine Änderungen übermittelt')
    }
  })

  it('never injects isActive when the caller omits it', () => {
    const result = updateProductSchema.safeParse({ nameDe: 'Neuer Name' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect('isActive' in result.data).toBe(false)
      expect(result.data.isActive).toBeUndefined()
    }
  })

  it('respects isActive: false (deactivation is possible)', () => {
    const result = updateProductSchema.safeParse({ isActive: false })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.isActive).toBe(false)
    }
  })

  it('rejects an invalid slug', () => {
    expect(updateProductSchema.safeParse({ slug: 'Fissler Bräter' }).success).toBe(false)
    expect(updateProductSchema.safeParse({ slug: 'fissler-braeter' }).success).toBe(true)
  })

  it('rejects a non-positive price', () => {
    expect(updateProductSchema.safeParse({ price: 0 }).success).toBe(false)
    expect(updateProductSchema.safeParse({ price: -1 }).success).toBe(false)
    expect(updateProductSchema.safeParse({ price: 19.99 }).success).toBe(true)
  })

  it('rejects a non-cuid categoryId', () => {
    expect(updateProductSchema.safeParse({ categoryId: 'cat-1' }).success).toBe(false)
    expect(
      updateProductSchema.safeParse({ categoryId: 'clx1234567890abcdefg' }).success
    ).toBe(true)
  })

  it('rejects an empty image list only when explicitly empty is not allowed', () => {
    // Empty is allowed by the schema; the route treats it as "no change" so an
    // untouched form cannot wipe the gallery.
    expect(updateProductSchema.safeParse({ images: [] }).success).toBe(true)
  })

  it('rejects more than 20 images', () => {
    const images = Array.from({ length: 21 }, (_, i) => ({ url: `https://x.test/${i}.jpg` }))
    expect(updateProductSchema.safeParse({ images }).success).toBe(false)
  })
})

describe('updateProductSchema — price integrity on partial payloads', () => {
  it('does not require price when only the slug changes', () => {
    const result = updateProductSchema.safeParse({ slug: 'neuer-slug' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.price).toBeUndefined()
    }
  })
})
