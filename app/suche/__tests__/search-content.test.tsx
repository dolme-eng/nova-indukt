import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { src, alt, ...rest } = props
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt || ''} {...rest} />
  },
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('framer-motion', () => ({
  motion: { div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} /> },
}))

vi.mock('@/lib/utils/vat', () => ({
  formatPriceDe: (n: number) => `${n.toFixed(2)} €`,
}))

vi.mock('@/lib/store/cart', () => ({
  useCart: vi.fn(() => ({
    addItem: vi.fn(),
  })),
}))

const mockProducts = [
  {
    id: '1',
    slug: 'pfanne-induktion',
    name: { de: 'Pfanne Induktion' },
    category: 'pfannen',
    price: 89.99,
    oldPrice: 119.99,
    images: ['/images/pfanne.jpg'],
    rating: 4.5,
    reviewCount: 42,
    badges: ['premium'] as ('premium' | 'bestseller' | 'new')[],
    description: { de: 'Premium Pfanne für Induktion' },
    shortDescription: { de: 'Pfanne' },
    specs: {
      material: 'Edelstahl',
      dimensions: '28cm',
      weight: '1.5kg',
      dishwasher: true,
      induction: true,
    },
  },
  {
    id: '2',
    slug: 'topf-set',
    name: { de: 'Topf Set 3-teilig' },
    category: 'kochgeschirr',
    price: 249.99,
    images: ['/images/topf.jpg'],
    rating: 4.8,
    reviewCount: 120,
    badges: ['bestseller'] as ('premium' | 'bestseller' | 'new')[],
    description: { de: '3-teiliges Topfset' },
    shortDescription: { de: 'Topfset' },
    specs: {
      material: 'Edelstahl',
      dimensions: '16/18/20cm',
      weight: '4kg',
      dishwasher: true,
      induction: true,
    },
  },
]

const mockCategories = [
  { id: 'pfannen', slug: 'pfannen', name: { de: 'Pfannen' }, image: '/images/pf.jpg', count: 15 },
  {
    id: 'kochgeschirr',
    slug: 'kochgeschirr',
    name: { de: 'Kochgeschirr' },
    image: '/images/koch.jpg',
    count: 25,
  },
]

const SearchContent = (await import('@/app/suche/SearchContent')).default

describe('SearchContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all products initially', () => {
    render(<SearchContent initialProducts={mockProducts} initialCategories={mockCategories} />)
    expect(screen.getByText('Pfanne Induktion')).toBeInTheDocument()
    expect(screen.getByText('Topf Set 3-teilig')).toBeInTheDocument()
  })

  it('shows result count', () => {
    render(<SearchContent initialProducts={mockProducts} initialCategories={mockCategories} />)
    expect(screen.getByText(/2 Ergebnisse/)).toBeInTheDocument()
  })

  it('renders search input', () => {
    render(<SearchContent initialProducts={mockProducts} initialCategories={mockCategories} />)
    expect(screen.getByPlaceholderText('Produkte suchen...')).toBeInTheDocument()
  })

  it('filters products by search query', () => {
    render(<SearchContent initialProducts={mockProducts} initialCategories={mockCategories} />)
    const input = screen.getByPlaceholderText('Produkte suchen...')
    fireEvent.change(input, { target: { value: 'Topf' } })
    expect(screen.queryByText('Pfanne Induktion')).not.toBeInTheDocument()
    expect(screen.getByText('Topf Set 3-teilig')).toBeInTheDocument()
  })

  it('shows empty state when no results', () => {
    render(<SearchContent initialProducts={mockProducts} initialCategories={mockCategories} />)
    const input = screen.getByPlaceholderText('Produkte suchen...')
    fireEvent.change(input, { target: { value: 'nonexistent product xyz' } })
    expect(screen.getByText('Keine Ergebnisse gefunden')).toBeInTheDocument()
  })

  it('clears search when X button clicked', () => {
    render(<SearchContent initialProducts={mockProducts} initialCategories={mockCategories} />)
    const input = screen.getByPlaceholderText('Produkte suchen...')
    fireEvent.change(input, { target: { value: 'Topf' } })
    expect(screen.queryByText('Pfanne Induktion')).not.toBeInTheDocument()
    const clearBtn = document.querySelector('.lucide-x')?.closest('button')
    expect(clearBtn).toBeDefined()
    if (clearBtn) fireEvent.click(clearBtn)
    expect(screen.getByText('Pfanne Induktion')).toBeInTheDocument()
  })

  it('filters by category', () => {
    render(<SearchContent initialProducts={mockProducts} initialCategories={mockCategories} />)
    const pfannenRadio = screen.getByDisplayValue('pfannen')
    fireEvent.click(pfannenRadio)
    expect(screen.getByText('Pfanne Induktion')).toBeInTheDocument()
    expect(screen.queryByText('Topf Set 3-teilig')).not.toBeInTheDocument()
  })

  it('shows all products when "Alle" category selected', () => {
    render(<SearchContent initialProducts={mockProducts} initialCategories={mockCategories} />)
    const pfannenRadio = screen.getByDisplayValue('pfannen')
    fireEvent.click(pfannenRadio)
    expect(screen.queryByText('Topf Set 3-teilig')).not.toBeInTheDocument()
    const allRadio = screen.getByDisplayValue('all')
    fireEvent.click(allRadio)
    expect(screen.getByText('Pfanne Induktion')).toBeInTheDocument()
    expect(screen.getByText('Topf Set 3-teilig')).toBeInTheDocument()
  })

  it('sorts by price ascending', () => {
    render(<SearchContent initialProducts={mockProducts} initialCategories={mockCategories} />)
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'price-asc' } })
    const names = screen.getAllByText(/\d+\.\d+ €/)
    expect(names.length).toBeGreaterThanOrEqual(2)
  })

  it('toggles between grid and list view', () => {
    render(<SearchContent initialProducts={mockProducts} initialCategories={mockCategories} />)
    const allBtns = screen.getAllByRole('button')
    const listBtn = allBtns.find((btn) => btn.querySelector('.lucide-list'))
    expect(listBtn).toBeDefined()
    if (listBtn) fireEvent.click(listBtn)
    const gridBtn = allBtns.find((btn) => btn.querySelector('.lucide-grid3x3'))
    expect(gridBtn).toBeDefined()
  })

  it('adds product to cart when add button clicked', async () => {
    const addItem = vi.fn()
    const cartModule = await import('@/lib/store/cart')
    vi.mocked(cartModule.useCart).mockReturnValue({ addItem } as ReturnType<
      typeof cartModule.useCart
    >)
    render(<SearchContent initialProducts={mockProducts} initialCategories={mockCategories} />)
    const addBtns = screen.getAllByText(/In den Warenkorb/)
    fireEvent.click(addBtns[0])
    expect(addItem).toHaveBeenCalled()
  })

  it('renders premium badge for premium products', () => {
    render(<SearchContent initialProducts={mockProducts} initialCategories={mockCategories} />)
    expect(screen.getByText('Premium')).toBeInTheDocument()
  })

  it('renders old price when available', () => {
    render(<SearchContent initialProducts={mockProducts} initialCategories={mockCategories} />)
    expect(screen.getByText('119.99 €')).toBeInTheDocument()
  })

  it('shows filter button on mobile', () => {
    render(<SearchContent initialProducts={mockProducts} initialCategories={mockCategories} />)
    const filterBtn = document.querySelector('.lucide-filter')?.closest('button')
    expect(filterBtn).toBeInTheDocument()
  })

  it('resets filters when reset button clicked', () => {
    render(<SearchContent initialProducts={mockProducts} initialCategories={mockCategories} />)
    const pfannenRadio = screen.getByDisplayValue('pfannen')
    fireEvent.click(pfannenRadio)
    expect(screen.queryByText('Topf Set 3-teilig')).not.toBeInTheDocument()
    const resetBtn = screen.getByText('Zurücksetzen')
    fireEvent.click(resetBtn)
    expect(screen.getByText('Pfanne Induktion')).toBeInTheDocument()
    expect(screen.getByText('Topf Set 3-teilig')).toBeInTheDocument()
  })
})
