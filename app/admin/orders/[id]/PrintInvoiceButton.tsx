'use client'

import { Printer } from 'lucide-react'

/**
 * Extracted from the order details Server Component: `onClick` handlers cannot
 * be passed to (or declared in) a Server Component, so `window.print()` lived
 * in a file that never had 'use client' — it broke the RSC boundary.
 */
export function PrintInvoiceButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 print:hidden"
    >
      <Printer size={18} />
      Rechnung drucken
    </button>
  )
}
