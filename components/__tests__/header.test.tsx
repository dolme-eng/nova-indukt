import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { src, alt, ...rest } = props
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
  motion: {
    div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
    span: (props: React.HTMLAttributes<HTMLSpanElement>) => <span {...props} />,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('@/lib/store/cart', () => ({
  useCart: vi.fn(() => ({
    totalItems: 0,
    items: [],
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    totalPrice: 0,
    isHydrated: true,
  })),
}))

vi.mock('@/lib/hooks/use-debounce', () => ({
  useDebounce: (val: unknown) => val,
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/produkte',
}))

vi.mock('@/lib/constants/company', () => ({
  COMPANY: {
    whatsapp: { url: 'https://wa.me/123' },
    email: { support: 'support@nova.de', info: 'info@nova.de', datenschutz: 'dp@nova.de' },
  },
}))

vi.mock('@/lib/constants/shop', () => ({
  FREE_SHIPPING_THRESHOLD: 500,
}))

vi.mock('./header-mega-menu', () => ({
  MegaMenu: () => <div data-testid="mega-menu" />,
}))

vi.mock('./header-search-overlay', () => ({
  SearchOverlay: () => <div data-testid="search-overlay" />,
}))

vi.mock('./header-cart-drawer', () => ({
  CartDrawer: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="cart-drawer" /> : null,
}))

vi.mock('./header-mobile-menu', () => ({
  MobileMenu: () => <div data-testid="mobile-menu" />,
}))

const { Header } = await import('@/components/layout/header')

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the header element', () => {
    render(<Header />)
    expect(screen.getByTestId('site-header')).toBeInTheDocument()
  })

  it('renders the logo', () => {
    render(<Header />)
    const logo = screen.getByTestId('site-logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('href', '/')
  })

  it('renders main navigation', () => {
    render(<Header />)
    const nav = screen.getByTestId('main-navigation')
    expect(nav).toBeInTheDocument()
    expect(nav.textContent).toContain('Produkte')
    expect(nav.textContent).toContain('Technologie')
    expect(nav.textContent).toContain('Über uns')
    expect(nav.textContent).toContain('Blog')
    expect(nav.textContent).toContain('Kontakt')
  })

  it('renders search button', () => {
    render(<Header />)
    expect(screen.getByTestId('search-button')).toBeInTheDocument()
  })

  it('renders cart button', () => {
    render(<Header />)
    expect(screen.getByTestId('cart-button')).toBeInTheDocument()
  })

  it('renders mobile menu button', () => {
    render(<Header />)
    expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument()
  })

  it('renders top bar with shipping info', () => {
    render(<Header />)
    expect(screen.getByText(/Kostenlose Lieferung ab 500/)).toBeInTheDocument()
    expect(screen.getByText(/2 Jahre Garantie/)).toBeInTheDocument()
    expect(screen.getByText(/Inkl.*19% MwSt/)).toBeInTheDocument()
  })

  it('renders WhatsApp link', () => {
    render(<Header />)
    const whatsappLink = screen.getByText('Kundenservice').closest('a')
    expect(whatsappLink).toBeInTheDocument()
    expect(whatsappLink).toHaveAttribute('target', '_blank')
  })

  it('renders account link', () => {
    render(<Header />)
    const accountLink = screen.getByLabelText('Mein Konto')
    expect(accountLink).toHaveAttribute('href', '/mein-konto')
  })

  it('does not show cart count when cart is empty', () => {
    render(<Header />)
    expect(screen.queryByTestId('cart-count')).not.toBeInTheDocument()
  })

  it('toggles mobile menu on button click', () => {
    render(<Header />)
    const menuBtn = screen.getByTestId('mobile-menu-button')
    fireEvent.click(menuBtn)
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument()
  })

  it('has search button with correct aria-label', () => {
    render(<Header />)
    expect(screen.getByLabelText('Suchen')).toBeInTheDocument()
  })
})
