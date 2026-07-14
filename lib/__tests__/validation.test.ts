import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '@/lib/validations/auth'
import { createProductSchema, productImageSchema, updateProductSchema } from '@/lib/validations/product'
import { contactFormSchema } from '@/lib/validations/contact'
import { newsletterSubscribeSchema, newsletterUnsubscribeSchema } from '@/lib/validations/newsletter'

// ─── Auth ──────────────────────────────────────────────────────────────────────

describe('loginSchema', () => {
  it('accepts valid email and password', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: 'secret123' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'secret123' })
    expect(result.success).toBe(false)
  })

  it('rejects empty email', () => {
    const result = loginSchema.safeParse({ email: '', password: 'secret123' })
    expect(result.success).toBe(false)
  })

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '' })
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  const validUser = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Strong1Pass',
  }

  it('accepts a valid registration', () => {
    expect(registerSchema.safeParse(validUser).success).toBe(true)
  })

  it('rejects name shorter than 2 characters', () => {
    const result = registerSchema.safeParse({ ...validUser, name: 'J' })
    expect(result.success).toBe(false)
  })

  it('rejects name longer than 100 characters', () => {
    const result = registerSchema.safeParse({ ...validUser, name: 'A'.repeat(101) })
    expect(result.success).toBe(false)
  })

  it('rejects password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({ ...validUser, password: 'Ab1c' })
    expect(result.success).toBe(false)
  })

  it('rejects password without uppercase', () => {
    const result = registerSchema.safeParse({ ...validUser, password: 'lowercase1' })
    expect(result.success).toBe(false)
  })

  it('rejects password without lowercase', () => {
    const result = registerSchema.safeParse({ ...validUser, password: 'UPPERCASE1' })
    expect(result.success).toBe(false)
  })

  it('rejects password without number', () => {
    const result = registerSchema.safeParse({ ...validUser, password: 'NoNumberHere' })
    expect(result.success).toBe(false)
  })
})

describe('forgotPasswordSchema', () => {
  it('accepts a valid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'test@example.com' }).success).toBe(true)
  })

  it('rejects invalid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'bad' }).success).toBe(false)
  })
})

describe('resetPasswordSchema', () => {
  const valid = { token: 'abc123', password: 'Strong1Pass' }

  it('accepts valid token and password', () => {
    expect(resetPasswordSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects empty token', () => {
    expect(resetPasswordSchema.safeParse({ ...valid, token: '' }).success).toBe(false)
  })

  it('rejects weak password', () => {
    expect(resetPasswordSchema.safeParse({ ...valid, password: 'weak' }).success).toBe(false)
  })
})

// ─── Product ───────────────────────────────────────────────────────────────────

describe('productImageSchema', () => {
  it('accepts a valid image object', () => {
    expect(productImageSchema.safeParse({ url: 'https://example.com/img.jpg', alt: 'Photo' }).success).toBe(true)
  })

  it('accepts image without alt', () => {
    expect(productImageSchema.safeParse({ url: 'https://example.com/img.jpg' }).success).toBe(true)
  })

  it('rejects invalid URL', () => {
    expect(productImageSchema.safeParse({ url: 'not-a-url' }).success).toBe(false)
  })
})

describe('createProductSchema', () => {
  const validProduct = {
    nameDe: 'Testprodukt',
    slug: 'testprodukt',
    price: 99.99,
    categoryId: 'clx0abc123def456',
    isActive: true,
    images: [{ url: 'https://example.com/img.jpg' }],
  }

  it('accepts a valid product', () => {
    expect(createProductSchema.safeParse(validProduct).success).toBe(true)
  })

  it('accepts minimal product with required fields only', () => {
    const min = {
      nameDe: 'A',
      slug: 'a',
      price: 1,
      categoryId: 'clx0abc123def456',
      images: [{ url: 'https://example.com/img.jpg' }],
    }
    expect(createProductSchema.safeParse(min).success).toBe(true)
  })

  it('rejects missing nameDe', () => {
    const { nameDe, ...rest } = validProduct
    expect(createProductSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects slug with uppercase letters', () => {
    expect(createProductSchema.safeParse({ ...validProduct, slug: 'BadSlug' }).success).toBe(false)
  })

  it('rejects slug with spaces', () => {
    expect(createProductSchema.safeParse({ ...validProduct, slug: 'bad slug' }).success).toBe(false)
  })

  it('rejects negative price', () => {
    expect(createProductSchema.safeParse({ ...validProduct, price: -10 }).success).toBe(false)
  })

  it('rejects zero price', () => {
    expect(createProductSchema.safeParse({ ...validProduct, price: 0 }).success).toBe(false)
  })

  it('rejects empty images array', () => {
    expect(createProductSchema.safeParse({ ...validProduct, images: [] }).success).toBe(false)
  })
})

describe('updateProductSchema', () => {
  it('requires an id field', () => {
    const result = updateProductSchema.safeParse({
      id: 'clx0abc123def456',
      nameDe: 'Updated',
      slug: 'updated',
      price: 10,
      categoryId: 'clx0abc123def456',
      images: [{ url: 'https://example.com/img.jpg' }],
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing id', () => {
    const result = updateProductSchema.safeParse({
      nameDe: 'Updated',
      slug: 'updated',
      price: 10,
      categoryId: 'clx0abc123def456',
      images: [{ url: 'https://example.com/img.jpg' }],
    })
    expect(result.success).toBe(false)
  })
})

// ─── Contact ───────────────────────────────────────────────────────────────────

describe('contactFormSchema', () => {
  const validContact = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    subject: 'Question',
    message: 'This is a test message that is long enough.',
    privacyAccepted: true,
  }

  it('accepts a valid contact form', () => {
    expect(contactFormSchema.safeParse(validContact).success).toBe(true)
  })

  it('rejects missing firstName', () => {
    const { firstName, ...rest } = validContact
    expect(contactFormSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects missing email', () => {
    const { email, ...rest } = validContact
    expect(contactFormSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects invalid email', () => {
    expect(contactFormSchema.safeParse({ ...validContact, email: 'bad' }).success).toBe(false)
  })

  it('rejects short message', () => {
    expect(contactFormSchema.safeParse({ ...validContact, message: 'Hi' }).success).toBe(false)
  })

  it('rejects privacy not accepted', () => {
    expect(contactFormSchema.safeParse({ ...validContact, privacyAccepted: false }).success).toBe(false)
  })

  it('accepts optional phone', () => {
    expect(contactFormSchema.safeParse({ ...validContact, phone: '+49 30 12345' }).success).toBe(true)
  })

  it('accepts null phone', () => {
    expect(contactFormSchema.safeParse({ ...validContact, phone: null }).success).toBe(true)
  })
})

// ─── Newsletter ────────────────────────────────────────────────────────────────

describe('newsletterSubscribeSchema', () => {
  it('accepts valid email only', () => {
    const result = newsletterSubscribeSchema.safeParse({ email: 'user@example.com' })
    expect(result.success).toBe(true)
  })

  it('sets default source to "website"', () => {
    const result = newsletterSubscribeSchema.safeParse({ email: 'user@example.com' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.source).toBe('website')
    }
  })

  it('accepts custom source', () => {
    const result = newsletterSubscribeSchema.safeParse({ email: 'user@example.com', source: 'footer' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.source).toBe('footer')
    }
  })

  it('rejects invalid email', () => {
    expect(newsletterSubscribeSchema.safeParse({ email: 'bad' }).success).toBe(false)
  })

  it('accepts optional name fields', () => {
    const result = newsletterSubscribeSchema.safeParse({
      email: 'user@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
    })
    expect(result.success).toBe(true)
  })
})

describe('newsletterUnsubscribeSchema', () => {
  it('accepts valid email', () => {
    expect(newsletterUnsubscribeSchema.safeParse({ email: 'user@example.com' }).success).toBe(true)
  })

  it('rejects invalid email', () => {
    expect(newsletterUnsubscribeSchema.safeParse({ email: 'bad' }).success).toBe(false)
  })
})
