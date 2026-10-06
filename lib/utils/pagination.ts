/**
 * Shared pagination helpers for the admin lists.
 *
 * Two problems this removes:
 *  - `Math.max(1, parseInt(x))` returns NaN for `?page=abc`, which Prisma turns
 *    into `skip: NaN` → HTTP 500 instead of a 400.
 *  - Building page links by string interpolation breaks on any value containing
 *    `&`, `#`, `+` or a space (e.g. a search query).
 */

export const DEFAULT_PAGE_SIZE = 50

/** Parse a `?page=` value into a usable 1-based page number. */
export function parsePageParam(value: string | undefined, totalPages?: number): number {
  const parsed = Number.parseInt(value ?? '1', 10)
  if (!Number.isFinite(parsed) || parsed < 1) return 1
  if (totalPages !== undefined && parsed > totalPages && totalPages >= 1) {
    return totalPages
  }
  return parsed
}

/**
 * Build a URL preserving the current query string, overriding some params.
 * `resetPage` drops the current page (call it when a filter changes).
 */
export function buildQueryUrl(
  basePath: string,
  current: Record<string, string | string[] | undefined>,
  overrides: Record<string, string | number | undefined | null> = {},
  options: { resetPage?: boolean } = {}
): string {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(current)) {
    if (value === undefined || value === '') continue
    if (Array.isArray(value)) {
      for (const v of value) if (v !== '') params.append(key, v)
    } else {
      params.set(key, value)
    }
  }

  if (options.resetPage) params.delete('page')

  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined || value === null || value === '') params.delete(key)
    else params.set(key, String(value))
  }

  const qs = params.toString()
  return `${basePath}${qs ? `?${qs}` : ''}`
}

/**
 * Render a page range with ellipses: 1 … 4 5 [6] 7 8 … 20
 * `null` marks the current page.
 */
export function buildPageItems(
  currentPage: number,
  totalPages: number,
  window = 1
): Array<number | '…'> {
  if (totalPages <= 1) return [1]

  // Short lists read better complete than with ellipses.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const items = new Set<number | '…'>([1, totalPages, currentPage])
  for (let d = 1; d <= window; d++) {
    if (currentPage - d > 1) items.add(currentPage - d)
    if (currentPage + d < totalPages) items.add(currentPage + d)
  }

  const sorted = [...items].sort((a, b) => {
    if (a === '…') return -1
    if (b === '…') return 1
    return a - b
  })

  const out: Array<number | '…'> = []
  let prev = 0
  for (const item of sorted) {
    if (typeof item === 'number') {
      if (prev && item - prev > 1) out.push('…')
      out.push(item)
      prev = item
    }
  }
  return out
}
