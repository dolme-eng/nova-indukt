import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET as productsHandler } from '@/app/api/products/route'
import { GET as productDetailHandler } from '@/app/api/products/[slug]/route'
import { prisma } from '@/lib/prisma'

describe('Products API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockProducts = [
    {
      id: 'prod-1',
      nameDe: 'Induktionskochfeld 60cm',
      nameEn: 'Induction Cooktop 60cm',
      slug: 'induktionskochfeld-60cm',
      price: 499.99,
      oldPrice: null,
      costPrice: null,
      stock: 15,
      category: { id: 'cat-1', slug: 'kochfelder' },
      images: [{ id: 'img-1', url: '/product1.jpg', productId: 'prod-1' }],
    },
    {
      id: 'prod-2',
      nameDe: 'Induktionskochfeld 80cm',
      nameEn: 'Induction Cooktop 80cm',
      slug: 'induktionskochfeld-80cm',
      price: 699.99,
      oldPrice: 799.99,
      costPrice: 400,
      stock: 8,
      category: { id: 'cat-1', slug: 'kochfelder' },
      images: [{ id: 'img-2', url: '/product2.jpg', productId: 'prod-2' }],
    },
  ]

  describe('GET /api/products', () => {
    it('should return all products with pagination', async () => {
      vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any)
      vi.mocked(prisma.product.count).mockResolvedValue(2)

      const request = new Request('http://localhost:3000/api/products')
      const response = await productsHandler(request as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.products).toHaveLength(2)
      expect(data.products[0].price).toBe(499.99)
      expect(data.products[1].price).toBe(699.99)
      expect(data.pagination.total).toBe(2)
      expect(data.pagination.totalPages).toBe(1)
    })

    it('should filter by category', async () => {
      vi.mocked(prisma.product.findMany).mockResolvedValue([mockProducts[0]] as any)
      vi.mocked(prisma.product.count).mockResolvedValue(1)

      const request = new Request('http://localhost:3000/api/products?category=kochfelder')
      const response = await productsHandler(request as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.products).toHaveLength(1)
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: { slug: 'kochfelder' },
          }),
        })
      )
    })

    it('should filter by search query', async () => {
      vi.mocked(prisma.product.findMany).mockResolvedValue([mockProducts[0]] as any)
      vi.mocked(prisma.product.count).mockResolvedValue(1)

      const request = new Request('http://localhost:3000/api/products?search=60cm')
      const response = await productsHandler(request as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.products).toHaveLength(1)
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ nameDe: expect.any(Object) }),
              expect.objectContaining({ descriptionDe: expect.any(Object) }),
            ]),
          }),
        })
      )
    })

    it('should filter by price range', async () => {
      vi.mocked(prisma.product.findMany).mockResolvedValue([mockProducts[0]] as any)
      vi.mocked(prisma.product.count).mockResolvedValue(1)

      const request = new Request('http://localhost:3000/api/products?minPrice=100&maxPrice=500')
      const response = await productsHandler(request as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.products).toHaveLength(1)
    })

    it('should sort products by price ascending', async () => {
      vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any)
      vi.mocked(prisma.product.count).mockResolvedValue(2)

      const request = new Request('http://localhost:3000/api/products?sortBy=price-asc')
      const response = await productsHandler(request as any)
      
      expect(response.status).toBe(200)
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { price: 'asc' },
        })
      )
    })

    it('should sort products by name', async () => {
      vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any)
      vi.mocked(prisma.product.count).mockResolvedValue(2)

      const request = new Request('http://localhost:3000/api/products?sortBy=name')
      const response = await productsHandler(request as any)
      
      expect(response.status).toBe(200)
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { nameDe: 'asc' },
        })
      )
    })

    it('should paginate results', async () => {
      vi.mocked(prisma.product.findMany).mockResolvedValue([mockProducts[0]] as any)
      vi.mocked(prisma.product.count).mockResolvedValue(15)

      const request = new Request('http://localhost:3000/api/products?page=2&limit=10')
      const response = await productsHandler(request as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.pagination.page).toBe(2)
      expect(data.pagination.limit).toBe(10)
      expect(data.pagination.totalPages).toBe(2)
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        })
      )
    })

    it('should handle database errors gracefully', async () => {
      vi.mocked(prisma.product.findMany).mockRejectedValue(new Error('DB Error'))

      const request = new Request('http://localhost:3000/api/products')
      const response = await productsHandler(request as any)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch products')
    })
  })

  describe('GET /api/products/[slug]', () => {
    it('should return product details with reviews', async () => {
      const mockProductWithReviews = {
        ...mockProducts[0],
        reviews: [
          {
            id: 'rev-1',
            rating: 5,
            comment: 'Super Produkt!',
            user: { name: 'Max Mustermann' },
            createdAt: new Date(),
          },
        ],
      }

      vi.mocked(prisma.product.findUnique).mockResolvedValue(mockProductWithReviews as any)

      const request = new Request('http://localhost:3000/api/products/induktionskochfeld-60cm')
      const params = Promise.resolve({ slug: 'induktionskochfeld-60cm' })
      const response = await productDetailHandler(request as any, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.slug).toBe('induktionskochfeld-60cm')
      expect(data.price).toBe(499.99)
      expect(data.reviews).toHaveLength(1)
    })

    it('should return 404 for non-existent product', async () => {
      vi.mocked(prisma.product.findUnique).mockResolvedValue(null)

      const request = new Request('http://localhost:3000/api/products/non-existent')
      const params = Promise.resolve({ slug: 'non-existent' })
      const response = await productDetailHandler(request as any, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Product not found')
    })

    it('should handle database errors', async () => {
      vi.mocked(prisma.product.findUnique).mockRejectedValue(new Error('DB Error'))

      const request = new Request('http://localhost:3000/api/products/test')
      const params = Promise.resolve({ slug: 'test' })
      const response = await productDetailHandler(request as any, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch product')
    })
  })
})
