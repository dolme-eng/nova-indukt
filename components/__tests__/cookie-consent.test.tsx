import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('lucide-react', () => ({
  X: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-x" {...props} />,
  Cookie: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-cookie" {...props} />,
  Shield: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-shield" {...props} />,
  Settings: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="icon-settings" {...props} />
  ),
  Check: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-check" {...props} />,
}))

vi.mock('@/components/google-analytics', () => ({
  setGAConsent: vi.fn(),
}))

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

const { CookieConsent } = await import('@/components/cookie-consent')

function openSettings() {
  render(<CookieConsent />)
  act(() => {
    vi.advanceTimersByTime(1000)
  })
  fireEvent.click(screen.getByText('Einstellungen'))
}

describe('CookieConsent', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows cookie settings button when no consent saved', () => {
    render(<CookieConsent />)
    expect(screen.getByTitle('Cookie-Einstellungen')).toBeInTheDocument()
  })

  it('does not show banner initially when consent exists', () => {
    localStorage.setItem(
      'cookie-consent',
      JSON.stringify({
        necessary: true,
        analytics: true,
        marketing: false,
        timestamp: new Date().toISOString(),
      })
    )
    render(<CookieConsent />)
    expect(screen.queryByText('Wir verwenden Cookies')).not.toBeInTheDocument()
    expect(screen.getByTitle('Cookie-Einstellungen')).toBeInTheDocument()
  })

  it('shows banner after 1 second when no consent saved', () => {
    render(<CookieConsent />)
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByText('Wir verwenden Cookies')).toBeInTheDocument()
  })

  it('hides banner and shows settings button when closed', () => {
    render(<CookieConsent />)
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    fireEvent.click(screen.getByLabelText('Schließen'))
    expect(screen.queryByText('Wir verwenden Cookies')).not.toBeInTheDocument()
    expect(screen.getByTitle('Cookie-Einstellungen')).toBeInTheDocument()
  })

  it('saves consent to localStorage when accepting all', () => {
    render(<CookieConsent />)
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    fireEvent.click(screen.getByText('Alle akzeptieren'))

    const saved = JSON.parse(localStorage.getItem('cookie-consent')!)
    expect(saved.necessary).toBe(true)
    expect(saved.analytics).toBe(true)
    expect(saved.marketing).toBe(true)
  })

  it('saves consent with only necessary when accepting necessary only', () => {
    render(<CookieConsent />)
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    fireEvent.click(screen.getByText('Nur notwendige'))

    const saved = JSON.parse(localStorage.getItem('cookie-consent')!)
    expect(saved.necessary).toBe(true)
    expect(saved.analytics).toBe(false)
    expect(saved.marketing).toBe(false)
  })

  it('opens settings detail view', () => {
    openSettings()
    expect(screen.getAllByText('Notwendig').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Analyse')).toBeInTheDocument()
    expect(screen.getByText('Marketing')).toBeInTheDocument()
  })

  it('toggles analytics preference and updates summary', () => {
    openSettings()
    fireEvent.click(screen.getByLabelText(/Analyse-Cookies/))

    const summary = document.querySelector('.bg-gray-100')?.textContent ?? ''
    expect(summary).toContain('Analyse')
    expect(summary).toContain('Notwendig')
  })

  it('toggles marketing preference and updates summary', () => {
    openSettings()
    fireEvent.click(screen.getByLabelText(/Marketing-Cookies/))

    const summary = document.querySelector('.bg-gray-100')?.textContent ?? ''
    expect(summary).toContain('Marketing')
    expect(summary).toContain('Notwendig')
  })

  it('saves custom preferences from settings', () => {
    openSettings()
    fireEvent.click(screen.getByLabelText(/Analyse-Cookies/))
    fireEvent.click(screen.getByText('Auswahl speichern'))

    const saved = JSON.parse(localStorage.getItem('cookie-consent')!)
    expect(saved.analytics).toBe(true)
    expect(saved.marketing).toBe(false)
  })

  it('has accessible privacy link', () => {
    render(<CookieConsent />)
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    const link = screen.getByText('Mehr erfahren')
    expect(link).toHaveAttribute('href', '/datenschutz')
  })
})
