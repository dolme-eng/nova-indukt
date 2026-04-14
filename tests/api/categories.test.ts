import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET as categoriesHandler } from '@/app/api/categories/route'
import { prisma } from '@/lib/prisma'

describe('Categories API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockCategories = [
    {
      id: 'cat-1',
      nameDe: 'Kochfelder',
      nameEn: 'Cooktops',
      slug: 'kochfelder',
      descriptionDe: 'Moderne Kochfelder',
      descriptionEn: 'Modern cooktops',
      image: '/cat1.jpg',
      _count: { products: 25 },
    },
    {
      id: 'cat-2',
      nameDe: 'Töpfe & Pfannen',
      nameEn: 'Pots & Pans',
      slug: 'toepfe-pfannen',
      descriptionDe: 'Hochwertiges Kochgeschirr',
      descriptionEn: 'High-quality cookware',
      image: '/cat2.jpg',
      _count: { products: 45 },
    },
    {
      id: 'cat-3',
      nameDe: 'Zubehör',
      nameEn: 'Accessories',
      slug: 'zubehoer',
      descriptionDe: 'Praktisches Zubehör',
      descriptionEn: 'Practical accessories',
      image: '/cat3.jpg',
      _count: { products: 30 },
    },
  ]

  describe('GET /api/categories', () => {
    it('should return all categories with product counts', async () => {
      vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories as any)

      const response = await categoriesHandler()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveLength(3)
      expect(data[0].slug).toBe('kochfelder')
      expect(data[0].productCount).toBe(25)
      expect(data[0].name.de).toBe('Kochfelder')
      expect(data[0].name.en).toBe('Cooktops')
    })

    it('should return categories sorted by name ascending', async () => {
      vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories as any)

      await categoriesHandler()

      expect(prisma.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { nameDe: 'asc' },
        })
      )
    })

    it('should include category metadata', async () => {
      vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories as any)

      const response = await categoriesHandler()
      const data = await response.json()

      expect(data[0]).toHaveProperty('id')
      expect(data[0]).toHaveProperty('slug')
      expect(data[0]).toHaveProperty('name')
      expect(data[0]).toHaveProperty('description')
      expect(data[0]).toHaveProperty('image')
      expect(data[0]).toHaveProperty('productCount')
    })

    it('should handle database errors', async () => {
      vi.mocked(prisma.category.findMany).mockRejectedValue(new Error('DB Error'))

      const response = await categoriesHandler()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch categories')
    })

    it('should return empty array when no categories exist', async () => {
      vi.mocked(prisma.category.findMany).mockResolvedValue([])

      const response = await categoriesHandler()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual([])
    })

    it('should transform _count to productCount', async () => {
      vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories as any)

      const response = await categoriesHandler()
      const data = await response.json()

      expect(data[0].productCount).toBe(25)
      expect(data[1].productCount).toBe(45)
      expect(data[2].productCount).toBe(30)
      expect(data[0]).not.toHaveProperty('_count')
    })
  })
})
