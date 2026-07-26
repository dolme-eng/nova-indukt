import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Breadcrumbs } from '@/components/breadcrumbs'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('framer-motion', () => ({
  motion: {
    li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li {...props}>{children}</li>
    ),
  },
}))

describe('Breadcrumbs', () => {
  it('renders home link', () => {
    render(<Breadcrumbs items={[]} />)
    expect(screen.getByLabelText('Startseite')).toBeInTheDocument()
  })

  it('renders breadcrumb items', () => {
    render(<Breadcrumbs items={[{ label: 'Produkte', href: '/produkte' }, { label: 'Pfannen' }]} />)
    expect(screen.getByText('Produkte')).toBeInTheDocument()
    expect(screen.getByText('Pfannen')).toBeInTheDocument()
  })

  it('marks last item as current page', () => {
    render(<Breadcrumbs items={[{ label: 'Produkte', href: '/produkte' }, { label: 'Pfannen' }]} />)
    expect(screen.getByText('Pfannen')).toHaveAttribute('aria-current', 'page')
  })

  it('renders links for items with href', () => {
    render(<Breadcrumbs items={[{ label: 'Produkte', href: '/produkte' }]} />)
    const link = screen.getByText('Produkte')
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/produkte')
  })

  it('renders plain text for items without href', () => {
    render(<Breadcrumbs items={[{ label: 'Aktuelle Seite' }]} />)
    const text = screen.getByText('Aktuelle Seite')
    expect(text.tagName).toBe('SPAN')
  })

  it('renders nav with aria-label', () => {
    render(<Breadcrumbs items={[]} />)
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument()
  })
})
