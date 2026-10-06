'use client'

import { Download } from 'lucide-react'

interface CsvColumn {
  header: string
  accessor: (row: Record<string, unknown>) => string | number
}

// Formula-injection guard: a cell starting with one of these characters is
// evaluated as a formula by Excel / LibreOffice / Google Sheets on open
// (=HYPERLINK("..."), +cmd|'/c calc'!A1, @SUM(...)). Prefixing with a single
// quote forces the spreadsheet engine to treat the value as text.
// \t (0x09) and \r (0x0D) are included because they are stripped by some
// spreadsheet parsers before the formula is evaluated.
const FORMULA_PREFIXES = ['=', '+', '-', '@', '\t', '\r']

/** Escape a single CSV field: neutralise formulas, then quote if needed. */
function escapeCsvField(value: unknown): string {
  let str = String(value ?? '').replace(/\r?\n/g, ' ')

  const firstChar = str[0]
  if (firstChar !== undefined && FORMULA_PREFIXES.includes(firstChar)) {
    str = `'${str}`
  }

  return str.includes(',') || str.includes('"') || str.includes("'")
    ? `"${str.replace(/"/g, '""')}"`
    : str
}

export function CsvExportButton({
  data,
  columns,
  filename,
  label = 'CSV Exportieren',
}: {
  data: Record<string, unknown>[]
  columns: CsvColumn[]
  filename: string
  label?: string
}) {
  function handleExport() {
    const headers = columns.map((c) => escapeCsvField(c.header))
    const rows = data.map((row) => columns.map((c) => escapeCsvField(c.accessor(row))))

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    // \uFEFF BOM so Excel detects UTF-8 (umlauts in customer/order data)
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    // Revoke on the next macrotask: revoking synchronously right after
    // .click() cancels the download in some browsers.
    // Capture the reference now — looking it up inside the timer would fail if
    // the environment tears the API down before the callback runs.
    const revoke = URL.revokeObjectURL
    if (typeof revoke === 'function') {
      setTimeout(() => revoke.call(URL, url), 0)
    }
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-50"
    >
      <Download className="h-4 w-4" />
      {label}
    </button>
  )
}
