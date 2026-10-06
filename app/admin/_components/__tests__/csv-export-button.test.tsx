// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

vi.mock('lucide-react', () => ({
  Download: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="icon-download" {...props} />
  ),
}))

const { CsvExportButton } = await import('@/app/admin/_components/csv-export-button')

describe('CsvExportButton', () => {
  const mockData = [
    { id: '1', name: 'Max Mustermann', email: 'max@test.de', role: 'USER' },
    { id: '2', name: 'Anna Schmidt', email: 'anna@test.de', role: 'ADMIN' },
  ]

  const mockColumns = [
    { header: 'ID', accessor: (row: Record<string, unknown>) => row.id as string },
    { header: 'Name', accessor: (row: Record<string, unknown>) => row.name as string },
    { header: 'E-Mail', accessor: (row: Record<string, unknown>) => row.email as string },
  ]

  let createObjectURLSpy: ReturnType<typeof vi.fn>
  let revokeObjectURLSpy: ReturnType<typeof vi.fn>
  let origCreateObjectURL: typeof URL.createObjectURL
  let origRevokeObjectURL: typeof URL.revokeObjectURL

  beforeEach(() => {
    createObjectURLSpy = vi.fn().mockReturnValue('blob:test')
    revokeObjectURLSpy = vi.fn().mockImplementation(() => {})
    origCreateObjectURL = URL.createObjectURL
    origRevokeObjectURL = URL.revokeObjectURL
    URL.createObjectURL = createObjectURLSpy as typeof URL.createObjectURL
    URL.revokeObjectURL = revokeObjectURLSpy as typeof URL.revokeObjectURL
  })

  afterEach(() => {
    URL.createObjectURL = origCreateObjectURL
    URL.revokeObjectURL = origRevokeObjectURL
  })

  it('renders with default label', () => {
    render(<CsvExportButton data={mockData} columns={mockColumns} filename="test.csv" />)
    expect(screen.getByText('CSV Exportieren')).toBeInTheDocument()
  })

  it('renders with custom label', () => {
    render(
      <CsvExportButton
        data={mockData}
        columns={mockColumns}
        filename="test.csv"
        label="Als CSV herunterladen"
      />
    )
    expect(screen.getByText('Als CSV herunterladen')).toBeInTheDocument()
  })

  it('renders download icon', () => {
    render(<CsvExportButton data={mockData} columns={mockColumns} filename="test.csv" />)
    expect(screen.getByTestId('icon-download')).toBeInTheDocument()
  })

  it('creates blob URL on click', () => {
    render(<CsvExportButton data={mockData} columns={mockColumns} filename="test.csv" />)
    fireEvent.click(screen.getByText('CSV Exportieren'))
    expect(createObjectURLSpy).toHaveBeenCalled()
    expect(createObjectURLSpy.mock.calls[0][0]).toBeInstanceOf(Blob)
  })

  it('revokes blob URL after download (deferred, not synchronous)', async () => {
    render(<CsvExportButton data={mockData} columns={mockColumns} filename="test.csv" />)
    fireEvent.click(screen.getByText('CSV Exportieren'))
    // Revoking synchronously right after .click() cancels the download in some
    // browsers, so the revocation is deferred to a macrotask.
    expect(revokeObjectURLSpy).not.toHaveBeenCalled()
    await waitFor(() => expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:test'))
  })

  it('removes the temporary anchor element from the DOM', () => {
    render(<CsvExportButton data={mockData} columns={mockColumns} filename="test.csv" />)
    fireEvent.click(screen.getByText('CSV Exportieren'))
    expect(document.querySelectorAll('a[download]')).toHaveLength(0)
  })

  describe('formula-injection guard', () => {
    /** jsdom's Blob has no .text(); read it through FileReader instead. */
    function readBlob(blob: Blob): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(reader.error)
        reader.readAsText(blob)
      })
    }

    async function exportAndRead(data: Record<string, unknown>[], columns: typeof mockColumns) {
      render(<CsvExportButton data={data} columns={columns} filename="x.csv" />)
      fireEvent.click(screen.getByText('CSV Exportieren'))
      const blob = createObjectURLSpy.mock.calls[0][0] as Blob
      const csv = await readBlob(blob)
      return csv.startsWith('﻿') ? csv.slice(1) : csv
    }

    const nameCol = [{ header: 'Name', accessor: (r: Record<string, unknown>) => r.name as string }]

    // The field is prefixed with `'` (forcing text) and then, if it contains a
    // separator or a quote, wrapped in double quotes with those quotes doubled.
    it.each([
      ['= 1+1', "'= 1+1"],
      ['+cmd|\'/c calc\'!A0', '"\'+cmd|\'/c calc\'!A0"'],
      ['-2+3+cmd|\'/c calc\'!A0', '"\'-2+3+cmd|\'/c calc\'!A0"'],
      ['@SUM(1+9)*cmd|\'/c calc\'!A0', '"\'@SUM(1+9)*cmd|\'/c calc\'!A0"'],
      [
        '=HYPERLINK("http://evil.test","click")',
        '"\'=HYPERLINK(""http://evil.test"",""click"")"',
      ],
    ])('neutralises %s', async (input, expected) => {
      const csv = await exportAndRead([{ name: input }], nameCol)
      expect(csv).toContain(expected)
      // The dangerous leading character is never the first byte of the field
      expect(csv).not.toMatch(/^=/m)
    })

    it('leaves harmless values untouched', async () => {
      const csv = await exportAndRead([{ name: 'Max Mustermann' }], nameCol)
      expect(csv).toContain('Max Mustermann')
      expect(csv).not.toContain("'Max")
    })

    it('still quotes separators and quotes', async () => {
      const csv = await exportAndRead([{ name: 'Müller, "Max"' }], nameCol)
      expect(csv).toContain('"Müller, ""Max"""')
    })

    it('flattens newlines into a single-line field', async () => {
      const csv = await exportAndRead([{ name: 'line1\nline2' }], nameCol)
      expect(csv).toContain('line1 line2')
    })
  })

  it('handles empty data', () => {
    render(<CsvExportButton data={[]} columns={mockColumns} filename="empty.csv" />)
    fireEvent.click(screen.getByText('CSV Exportieren'))
    expect(createObjectURLSpy).toHaveBeenCalled()
    const blob = createObjectURLSpy.mock.calls[0][0] as Blob
    expect(blob.size).toBeGreaterThanOrEqual(0)
  })

  it('produces a blob with CSV content type', () => {
    render(<CsvExportButton data={mockData} columns={mockColumns} filename="test.csv" />)
    fireEvent.click(screen.getByText('CSV Exportieren'))
    const blob = createObjectURLSpy.mock.calls[0][0] as Blob
    expect(blob.type).toBe('text/csv;charset=utf-8;')
  })
})
