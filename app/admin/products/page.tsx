import React from "react"
import Link from "next/link"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  ArrowUpDown,
  Image as ImageIcon,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { prisma } from "@/lib/prisma"
import Image from "next/image"

async function getProducts() {
  return await prisma.product.findMany({
    include: {
      category: true,
      images: {
        where: { isMain: true },
        take: 1
      }
    },
    orderBy: { createdAt: "desc" }
  })
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Produits</h1>
          <p className="text-slate-500 text-sm">Gérez votre catalogue de produits ({products.length} articles)</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="inline-flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Ajouter un produit
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un produit (Nom, SKU, EAN...)" 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            Catégorie
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <ArrowUpDown size={18} />
            Trier par
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                <th className="px-6 py-4">Produit</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Prix</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-slate-100 flex-shrink-0 relative overflow-hidden border border-slate-200">
                        {product.images[0] ? (
                          <Image 
                            src={product.images[0].url} 
                            alt={product.nameDe} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full">
                            <ImageIcon className="text-slate-300" size={20} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate max-w-[200px]">{product.nameDe}</p>
                        <p className="text-xs text-slate-500 truncate">SKU: {product.supplierSku || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                      {product.category.nameDe}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{Number(product.price).toFixed(2)} €</span>
                      {product.oldPrice && (
                        <span className="text-xs text-slate-400 line-through">{Number(product.oldPrice).toFixed(2)} €</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`text-sm font-medium ${
                        product.stock <= product.stockAlertAt ? "text-red-600 font-bold" : "text-slate-700"
                      }`}>
                        {product.stock} en stock
                      </span>
                      {product.stock <= product.stockAlertAt && (
                        <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">Alerte</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.isActive ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        <CheckCircle2 size={12} />
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                        <XCircle size={12} />
                        Inactif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/produkt/${product.slug}`} 
                        target="_blank"
                        className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
                        title="Voir sur le site"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link 
                        href={`/admin/products/${product.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-all"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </Link>
                      <button 
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-all"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Aucun produit trouvé dans le catalogue.
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
