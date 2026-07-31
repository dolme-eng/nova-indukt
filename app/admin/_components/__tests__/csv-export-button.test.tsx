import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

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

  it('revokes blob URL after download', () => {
    render(<CsvExportButton data={mockData} columns={mockColumns} filename="test.csv" />)
    fireEvent.click(screen.getByText('CSV Exportieren'))
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:test')
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
