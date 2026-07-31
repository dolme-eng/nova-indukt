'use client'

import { Download } from 'lucide-react'

interface CsvColumn {
  header: string
  accessor: (row: Record<string, unknown>) => string | number
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
    const headers = columns.map((c) => c.header)
    const rows = data.map((row) =>
      columns.map((c) => {
        const val = c.accessor(row)
        const str = String(val ?? '')
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str
      })
    )
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
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
