import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/footer'

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />
  },
}))

describe('Footer', () => {
  it('renders site footer element', () => {
    render(<Footer />)
    expect(screen.getByTestId('site-footer')).toBeInTheDocument()
  })

  it('renders feature bar with 4 items', () => {
    render(<Footer />)
    expect(screen.getByText('Kostenfreier Versand')).toBeInTheDocument()
    expect(screen.getAllByText('Sichere Zahlung').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('30 Tage Rückgaberecht')).toBeInTheDocument()
    expect(screen.getByText('Flexible Zahlung')).toBeInTheDocument()
  })

  it('renders company links with correct hrefs', () => {
    render(<Footer />)
    const footer = screen.getByTestId('site-footer')
    expect(footer.querySelector('a[href="/uber-uns"]')).toBeInTheDocument()
    expect(footer.querySelector('a[href="/blog"]')).toBeInTheDocument()
    expect(footer.querySelector('a[href="/technologie"]')).toBeInTheDocument()
    expect(footer.querySelector('a[href="/karriere"]')).toBeInTheDocument()
  })

  it('renders support links with correct hrefs', () => {
    render(<Footer />)
    const footer = screen.getByTestId('site-footer')
    expect(footer.querySelector('a[href="/kontakt"]')).toBeInTheDocument()
    expect(footer.querySelector('a[href="/faq"]')).toBeInTheDocument()
    expect(footer.querySelector('a[href="/bestellung-verfolgen"]')).toBeInTheDocument()
    expect(footer.querySelector('a[href="/lieferung"]')).toBeInTheDocument()
    expect(footer.querySelector('a[href="/rueckgabe"]')).toBeInTheDocument()
    expect(footer.querySelector('a[href="/informationen-zur-zahlung"]')).toBeInTheDocument()
  })

  it('renders legal links with correct hrefs', () => {
    render(<Footer />)
    const footer = screen.getByTestId('site-footer')
    expect(footer.querySelector('a[href="/impressum"]')).toBeInTheDocument()
    expect(footer.querySelector('a[href="/agb"]')).toBeInTheDocument()
    expect(footer.querySelector('a[href="/datenschutz"]')).toBeInTheDocument()
    expect(footer.querySelector('a[href="/widerruf"]')).toBeInTheDocument()
  })

  it('renders payment method', () => {
    render(<Footer />)
    expect(screen.getByText('Banküberweisung')).toBeInTheDocument()
  })

  it('renders shipping partners', () => {
    render(<Footer />)
    expect(screen.getByText('DHL')).toBeInTheDocument()
    expect(screen.getByText('DPD')).toBeInTheDocument()
    expect(screen.getByText('UPS')).toBeInTheDocument()
    expect(screen.getByText('GLS')).toBeInTheDocument()
    expect(screen.getByText('Hermes')).toBeInTheDocument()
  })

  it('renders trust badges', () => {
    render(<Footer />)
    expect(screen.getByText('SSL-Verschlüsselt')).toBeInTheDocument()
    expect(screen.getByText('Premium Qualität')).toBeInTheDocument()
    expect(screen.getByText('2 Jahre Garantie')).toBeInTheDocument()
    expect(screen.getAllByText('Sichere Zahlung').length).toBeGreaterThanOrEqual(1)
  })

  it('renders copyright with current year', () => {
    render(<Footer />)
    const year = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`${year}.*NOVA INDUKT`))).toBeInTheDocument()
  })

  it('renders social media links', () => {
    render(<Footer />)
    const facebook = screen.getByLabelText('Facebook')
    expect(facebook).toHaveAttribute('target', '_blank')
    const instagram = screen.getByLabelText('Instagram')
    expect(instagram).toHaveAttribute('target', '_blank')
  })

  it('renders WhatsApp link', () => {
    render(<Footer />)
    const whatsapp = screen.getByText('WhatsApp')
    expect(whatsapp.closest('a')).toHaveAttribute('target', '_blank')
  })

  it('renders email link with mailto', () => {
    render(<Footer />)
    const emailLinks = screen.getAllByText(/@/)
    const mailtoLink = emailLinks.find((el) =>
      el.closest('a')?.getAttribute('href')?.startsWith('mailto:')
    )
    expect(mailtoLink).toBeInTheDocument()
  })
})
