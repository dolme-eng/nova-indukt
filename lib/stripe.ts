import Stripe from 'stripe'

// Lazy singleton – do not throw at module-load time so Next.js build
// (static page collection) doesn't fail without env vars.
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined')
  }
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-03-25.dahlia',
      typescript: true,
    })
  }
  return _stripe
}

/** @deprecated Use getStripe() for lazy access */
export const stripe = new Proxy({} as Stripe, {
  get(_t, prop) {
    return getStripe()[prop as keyof Stripe]
  },
})

export function getStripePublishableKey(): string {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined')
  }
  return key
}

// Convert amount to cents (Stripe uses smallest currency unit)
export function toStripeAmount(amount: number): number {
  return Math.round(amount * 100)
}

// Format amount from cents
export function fromStripeAmount(amount: number): number {
  return amount / 100
}
