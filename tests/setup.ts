import { vi } from 'vitest'

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  })),
  headers: vi.fn(() => new Map()),
}))

// Mock next-auth
vi.mock('next-auth', () => ({
  default: vi.fn(() => ({
    handlers: { GET: vi.fn(), POST: vi.fn() },
    auth: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  })),
  getServerSession: vi.fn(),
}))

// Mock auth config
vi.mock('@/lib/auth/auth.config', () => ({
  authConfig: {
    providers: [],
    pages: { signIn: '/anmelden', signOut: '/', error: '/anmelden' },
    callbacks: {},
    session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  },
}))

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  useSession: vi.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
  SessionProvider: vi.fn(({ children }) => children),
}))

// Mock crypto module for password hashing
vi.mock('crypto', () => ({
  createHash: vi.fn(() => ({
    update: vi.fn(() => ({
      digest: vi.fn(() => 'mocked_hash'),
    })),
  })),
  randomBytes: vi.fn(() => ({
    toString: vi.fn(() => 'mocked_salt'),
  })),
  timingSafeEqual: vi.fn(() => true),
}))

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock Prisma - Create mock object first
const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  product: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
  },
  category: {
    findMany: vi.fn(),
  },
  order: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
  },
  cart: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  cartItem: {
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  },
  orderItem: {
    createMany: vi.fn(),
  },
  $transaction: vi.fn((callback) => callback(mockPrisma)),
}

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}))

// Global test utilities
export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashed_password123',
  role: 'USER',
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockProduct = {
  id: 'prod-123',
  nameDe: 'Test Produkt',
  nameEn: 'Test Product',
  slug: 'test-produkt',
  descriptionDe: 'Beschreibung',
  descriptionEn: 'Description',
  shortDescription: 'Kurzbeschreibung',
  price: 99.99,
  oldPrice: null,
  costPrice: null,
  stock: 10,
  categoryId: 'cat-123',
  ean: '1234567890123',
  supplierSku: 'SUP-123',
  brand: 'Test Brand',
  vatRatePercent: 19,
  priceIncludesVat: true,
  rating: 4.5,
  reviewCount: 10,
  badges: [],
  isActive: true,
  images: [],
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockCategory = {
  id: 'cat-123',
  nameDe: 'Kategorie',
  nameEn: 'Category',
  slug: 'kategorie',
  descriptionDe: 'Beschreibung',
  descriptionEn: 'Description',
  image: '/cat.jpg',
}

export const mockOrder = {
  id: 'order-123',
  orderNumber: 'NOV-ABC123',
  userId: 'user-123',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  address: 'Teststraße 1',
  zipCode: '12345',
  city: 'Berlin',
  country: 'Deutschland',
  phone: '+49123456789',
  paymentMethod: 'paypal',
  status: 'pending',
  paymentStatus: 'pending',
  subtotal: 99.99,
  shipping: 9.99,
  total: 109.98,
  items: [],
  createdAt: new Date(),
  updatedAt: new Date(),
}
