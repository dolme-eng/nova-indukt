import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { buildPageItems, buildQueryUrl } from '@/lib/utils/pagination'

/**
 * Admin pagination bar. Server-rendered so the links are crawlable and the
 * current page is announced via aria-current.
 */
export function AdminPagination({
  basePath,
  currentParams,
  page,
  totalPages,
  totalCount,
  itemLabel = 'Einträge',
}: {
  basePath: string
  currentParams: Record<string, string | string[] | undefined>
  page: number
  totalPages: number
  totalCount: number
  itemLabel?: string
}) {
  if (totalPages <= 1) {
    return (
      <p className="text-sm text-slate-500">
        {totalCount} {itemLabel}
      </p>
    )
  }

  const href = (p: number) => buildQueryUrl(basePath, currentParams, { page: p })

  return (
    <nav
      aria-label="Seitennavigation"
      className="flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
      <p className="text-sm text-slate-500">
        Seite {page} von {totalPages} · {totalCount} {itemLabel}
      </p>

      <div className="flex items-center gap-1">
        {page > 1 && (
          <Link
            href={href(page - 1)}
            rel="prev"
            aria-label="Vorherige Seite"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50"
          >
            <ChevronLeft size={16} />
          </Link>
        )}

        {buildPageItems(page, totalPages).map((item, index) =>
          item === '…' ? (
            <span
              key={`gap-${index}`}
              aria-hidden="true"
              className="px-1 text-sm text-slate-400"
            >
              …
            </span>
          ) : (
            <Link
              key={item}
              href={href(item)}
              aria-current={item === page ? 'page' : undefined}
              aria-label={`Seite ${item}`}
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-semibold transition-colors ${
                item === page
                  ? 'bg-primary text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item}
            </Link>
          )
        )}

        {page < totalPages && (
          <Link
            href={href(page + 1)}
            rel="next"
            aria-label="Nächste Seite"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50"
          >
            <ChevronRight size={16} />
          </Link>
        )}
      </div>
    </nav>
  )
}
