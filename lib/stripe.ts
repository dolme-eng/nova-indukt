import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia', // Latest API version
  typescript: true,
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
