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

vi.mock('framer-motion', () => ({
  motion: { div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} /> },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('@/lib/utils/vat', () => ({
  formatPriceDe: (n: number) => `${n.toFixed(2)} €`,
}))

vi.mock('@/lib/constants/shop', () => ({
  FREE_SHIPPING_THRESHOLD: 500,
}))

const { CartDrawer } = await import('@/components/layout/header-cart-drawer')

const mockItem = {
  product: {
    id: 'p1',
    slug: 'test-product',
    name: { de: 'Testprodukt' },
    category: 'test-category',
    price: 199.99,
    images: ['/images/test.jpg'],
    rating: 4.5,
    reviewCount: 10,
    description: { de: 'Test desc' },
    shortDescription: { de: 'Short test desc' },
    specs: {
      material: 'Steel',
      dimensions: '20cm',
      weight: '2kg',
      dishwasher: true,
      induction: true,
    },
  },
  quantity: 2,
}

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  items: [],
  totalItems: 0,
  totalPrice: 0,
  removeItem: vi.fn(),
  updateQuantity: vi.fn(),
}

describe('CartDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not render when closed', () => {
    render(<CartDrawer {...defaultProps} isOpen={false} />)
    expect(screen.queryByTestId('cart-drawer')).not.toBeInTheDocument()
  })

  it('renders when open', () => {
    render(<CartDrawer {...defaultProps} />)
    expect(screen.getByTestId('cart-drawer')).toBeInTheDocument()
  })

  it('shows empty cart state', () => {
    render(<CartDrawer {...defaultProps} />)
    expect(screen.getByText('Ihr Warenkorb ist leer')).toBeInTheDocument()
    expect(screen.getByText('Zum Shop')).toBeInTheDocument()
    expect(screen.getByText('Bestseller')).toBeInTheDocument()
  })

  it('shows cart items when items exist', () => {
    render(<CartDrawer {...defaultProps} items={[mockItem]} totalItems={2} totalPrice={399.98} />)
    expect(screen.getByText('Testprodukt')).toBeInTheDocument()
    expect(screen.getByTestId('cart-drawer').textContent).toContain('2')
  })

  it('shows item count in header', () => {
    render(<CartDrawer {...defaultProps} items={[mockItem]} totalItems={2} totalPrice={399.98} />)
    expect(screen.getByTestId('cart-drawer').textContent).toContain('Warenkorb (2)')
  })

  it('calls removeItem when delete button clicked', () => {
    const removeItem = vi.fn()
    render(
      <CartDrawer
        {...defaultProps}
        items={[mockItem]}
        totalItems={2}
        totalPrice={399.98}
        removeItem={removeItem}
      />
    )
    const deleteBtn = screen.getByLabelText('Testprodukt entfernen')
    fireEvent.click(deleteBtn)
    expect(removeItem).toHaveBeenCalledWith('p1')
  })

  it('calls updateQuantity when plus button clicked', () => {
    const updateQuantity = vi.fn()
    render(
      <CartDrawer
        {...defaultProps}
        items={[mockItem]}
        totalItems={2}
        totalPrice={399.98}
        updateQuantity={updateQuantity}
      />
    )
    const plusBtn = screen.getByLabelText('Menge erhöhen')
    fireEvent.click(plusBtn)
    expect(updateQuantity).toHaveBeenCalledWith('p1', 3)
  })

  it('calls updateQuantity with min 1 when minus button clicked', () => {
    const updateQuantity = vi.fn()
    render(
      <CartDrawer
        {...defaultProps}
        items={[mockItem]}
        totalItems={2}
        totalPrice={399.98}
        updateQuantity={updateQuantity}
      />
    )
    const minusBtn = screen.getByLabelText('Menge verringern')
    fireEvent.click(minusBtn)
    expect(updateQuantity).toHaveBeenCalledWith('p1', 1)
  })

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn()
    render(<CartDrawer {...defaultProps} onClose={onClose} />)
    const closeBtn = screen.getByLabelText('Warenkorb schließen')
    fireEvent.click(closeBtn)
    expect(onClose).toHaveBeenCalled()
  })

  it('shows checkout button when items exist', () => {
    render(<CartDrawer {...defaultProps} items={[mockItem]} totalItems={2} totalPrice={399.98} />)
    expect(screen.getByTestId('checkout-button')).toHaveAttribute('href', '/kasse')
  })

  it('shows free shipping progress when below threshold', () => {
    render(<CartDrawer {...defaultProps} items={[mockItem]} totalItems={2} totalPrice={199.99} />)
    expect(screen.getByText(/bis zum/)).toBeInTheDocument()
  })

  it('shows free shipping achieved when above threshold', () => {
    render(<CartDrawer {...defaultProps} items={[mockItem]} totalItems={2} totalPrice={600} />)
    expect(screen.getByText('GRATIS')).toBeInTheDocument()
    expect(screen.getByText('Wir schenken Ihnen die Versandkosten!')).toBeInTheDocument()
  })

  it('shows shipping calculated when below threshold', () => {
    render(<CartDrawer {...defaultProps} items={[mockItem]} totalItems={2} totalPrice={199.99} />)
    expect(screen.getByText('Berechnet')).toBeInTheDocument()
  })

  it('does not show footer when cart is empty', () => {
    render(<CartDrawer {...defaultProps} />)
    expect(screen.queryByTestId('checkout-button')).not.toBeInTheDocument()
  })
})
