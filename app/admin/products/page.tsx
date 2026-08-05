import Link from 'next/link'
import { Plus, Edit, Eye, Image as ImageIcon, CheckCircle2, XCircle } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
export const dynamic = 'force-dynamic'
import Image from 'next/image'

import { ProductsFilter } from './_components/products-filter'
import { DeleteProductButton } from './_components/delete-product-button'

async function getProducts(search?: string, category?: string, sort?: string) {
  const where: Prisma.ProductWhereInput = {}

  if (category) {
    where.categoryId = category
  }

  if (search) {
    where.OR = [
      { nameDe: { contains: search, mode: 'insensitive' } },
      { ean: { contains: search, mode: 'insensitive' } },
    ]
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }
  if (sort) {
    switch (sort) {
      case 'name-asc':
        orderBy = { nameDe: 'asc' }
        break
      case 'name-desc':
        orderBy = { nameDe: 'desc' }
        break
      case 'price-asc':
        orderBy = { price: 'asc' }
        break
      case 'price-desc':
        orderBy = { price: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
    }
  }

  return await prisma.product.findMany({
    where,
    include: {
      category: true,
      images: {
        where: { isMain: true },
        take: 1,
      },
    },
    orderBy,
  })
}

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { nameDe: 'asc' },
  })
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>
}) {
  const resolvedParams = await searchParams
  const [products, categories] = await Promise.all([
    getProducts(resolvedParams.q, resolvedParams.category, resolvedParams.sort),
    getCategories(),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Produkte</h1>
          <p className="text-sm text-slate-500">
            Verwalten Sie Ihren Produktkatalog ({products.length} Artikel)
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary/90"
        >
          <Plus size={18} />
          Produkt hinzufügen
        </Link>
      </div>

      {/* Filters & Search */}
      <ProductsFilter categories={categories} />

      {/* Products Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Produkt</th>
                <th className="px-6 py-4">Kategorie</th>
                <th className="px-6 py-4">Preis</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="group transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.nameDe}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon className="text-slate-300" size={20} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="max-w-[200px] truncate font-semibold text-slate-900">
                          {product.nameDe}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-sm text-slate-600">
                      {product.category.nameDe}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">
                        {Number(product.price).toFixed(2)} €
                      </span>
                      {product.oldPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {Number(product.oldPrice).toFixed(2)} €
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.isActive ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        <CheckCircle2 size={12} />
                        Aktiv
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-500">
                        <XCircle size={12} />
                        Inaktiv
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/produkt/${product.slug}`}
                        target="_blank"
                        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-primary"
                        title="Auf der Website ansehen"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-blue-600"
                        title="Bearbeiten"
                      >
                        <Edit size={18} />
                      </Link>
                      <DeleteProductButton productId={product.id} productName={product.nameDe} />
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Keine Produkte im Katalog gefunden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
