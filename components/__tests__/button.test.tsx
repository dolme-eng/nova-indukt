import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Clicke mich</Button>)
    expect(screen.getByRole('button', { name: /clicke mich/i })).toBeInTheDocument()
  })

  it('applies primary variant by default', () => {
    render(<Button>Test</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-[#4ECCA3]')
  })

  it('applies secondary variant', () => {
    render(<Button variant="secondary">Test</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-gray-900')
  })

  it('applies outline variant', () => {
    render(<Button variant="outline">Test</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('border-2')
  })

  it('applies danger variant', () => {
    render(<Button variant="danger">Test</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-red-500')
  })

  it('applies size classes', () => {
    render(<Button size="lg">Test</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('px-6')
    expect(button.className).toContain('py-3')
  })

  it('shows loading spinner when isLoading', () => {
    render(<Button isLoading>Laden</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('disables button when isLoading', () => {
    render(<Button isLoading>Laden</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Deaktiviert</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls onClick handler', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Klick</Button>)
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders leftIcon', () => {
    render(<Button leftIcon={<span data-testid="icon">+</span>}>Text</Button>)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('hides leftIcon when loading', () => {
    render(
      <Button isLoading leftIcon={<span data-testid="icon">+</span>}>
        Text
      </Button>
    )
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>)
    expect(screen.getByRole('button').className).toContain('custom-class')
  })
})
