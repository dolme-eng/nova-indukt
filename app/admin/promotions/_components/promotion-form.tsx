'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, X, Percent, Euro, Tag, Calendar, Package, Folder } from 'lucide-react'

interface Category {
  id: string
  nameDe: string
}

interface Product {
  id: string
  nameDe: string
  price: number
}

interface PromotionFormProps {
  promotion?: {
    id: string
    name: string
    description: string | null
    discountType: 'PERCENTAGE' | 'FIXED_AMOUNT'
    discountValue: number
    isGlobal: boolean
    productIds: string[]
    categoryIds: string[]
    startDate: string
    endDate: string
    minOrderAmount: number | null
    maxDiscount: number | null
    usageLimit: number | null
    badge: string | null
    bannerText: string | null
    highlightColor: string | null
    isActive: boolean
  }
}

export default function PromotionForm({ promotion }: PromotionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  
  const [formData, setFormData] = useState({
    name: promotion?.name || '',
    description: promotion?.description || '',
    discountType: promotion?.discountType || 'PERCENTAGE',
    discountValue: promotion?.discountValue.toString() || '10',
    isGlobal: promotion?.isGlobal || false,
    productIds: promotion?.productIds || [],
    categoryIds: promotion?.categoryIds || [],
    startDate: promotion?.startDate 
      ? new Date(promotion.startDate).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
    endDate: promotion?.endDate 
      ? new Date(promotion.endDate).toISOString().split('T')[0] 
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    minOrderAmount: promotion?.minOrderAmount || '',
    maxDiscount: promotion?.maxDiscount || '',
    usageLimit: promotion?.usageLimit || '',
    badge: promotion?.badge || '-20%',
    bannerText: promotion?.bannerText || '',
    highlightColor: promotion?.highlightColor || '#4ECCA3',
    isActive: promotion?.isActive ?? true
  })

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products?limit=100')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = promotion?.id 
        ? `/api/admin/promotions/${promotion.id}` 
        : '/api/admin/promotions'
      const method = promotion?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          discountValue: Number(formData.discountValue),
          minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : null,
          maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
          usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null
        })
      })

      if (response.ok) {
        router.push('/admin/promotions')
      } else {
        const error = await response.json()
        alert(error.error || 'Une erreur est survenue')
      }
    } catch (error) {
      console.error('Error saving promotion:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-[#2A2A2A] rounded-xl p-6 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-4">Informations générales</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nom de la promotion</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4ECCA3]"
              placeholder="Ex: Flash Deal -20%"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4ECCA3]"
              placeholder="Description de la promotion..."
            />
          </div>
        </div>
      </div>

      {/* Discount Settings */}
      <div className="bg-[#2A2A2A] rounded-xl p-6 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-4">Paramètres de réduction</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Type de réduction</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, discountType: 'PERCENTAGE' })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  formData.discountType === 'PERCENTAGE'
                    ? 'bg-[#4ECCA3]/20 border-[#4ECCA3] text-[#4ECCA3]'
                    : 'bg-[#1A1A1A] border-white/10 text-gray-400'
                }`}
              >
                <Percent className="w-4 h-4" />
                Pourcentage
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, discountType: 'FIXED_AMOUNT' })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  formData.discountType === 'FIXED_AMOUNT'
                    ? 'bg-[#4ECCA3]/20 border-[#4ECCA3] text-[#4ECCA3]'
                    : 'bg-[#1A1A1A] border-white/10 text-gray-400'
                }`}
              >
                <Euro className="w-4 h-4" />
                Montant fixe
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Valeur {formData.discountType === 'PERCENTAGE' ? '(%)' : '(€)'}
            </label>
            <input
              type="number"
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })} 
              required
              min="0"
              max={formData.discountType === 'PERCENTAGE' ? '100' : undefined}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4ECCA3]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Montant minimum de commande (€)</label>
            <input
              type="number"
              value={formData.minOrderAmount}
              onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
              min="0"
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4ECCA3]"
              placeholder="Optionnel"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Remise maximale (€)</label>
            <input
              type="number"
              value={formData.maxDiscount}
              onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
              min="0"
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4ECCA3]"
              placeholder="Optionnel"
            />
          </div>
        </div>
      </div>

      {/* Scope */}
      <div className="bg-[#2A2A2A] rounded-xl p-6 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-4">Portée de la promotion</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isGlobal"
              checked={formData.isGlobal}
              onChange={(e) => setFormData({ ...formData, isGlobal: e.target.checked })}
              className="w-4 h-4 rounded border-white/10 bg-[#1A1A1A] text-[#4ECCA3] focus:ring-[#4ECCA3]"
            />
            <label htmlFor="isGlobal" className="text-white">Appliquer à tous les produits (promotion globale)</label>
          </div>

          {!formData.isGlobal && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  Catégories concernées
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-[#1A1A1A] rounded-lg border border-white/10">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center gap-2 p-2 hover:bg-white/5 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.categoryIds.includes(category.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, categoryIds: [...formData.categoryIds, category.id] })
                          } else {
                            setFormData({ ...formData, categoryIds: formData.categoryIds.filter(id => id !== category.id) })
                          }
                        }}
                        className="w-4 h-4 rounded border-white/10 bg-[#2A2A2A] text-[#4ECCA3]"
                      />
                      <span className="text-sm text-gray-300">{category.nameDe}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Produits spécifiques
                </label>
                <select
                  multiple
                  value={formData.productIds}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions).map(o => o.value)
                    setFormData({ ...formData, productIds: selected })
                  }}
                  className="w-full h-40 px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4ECCA3]"
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.nameDe} ({product.price}€)
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Maintenez Ctrl/Cmd pour sélectionner plusieurs produits</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Duration */}
      <div className="bg-[#2A2A2A] rounded-xl p-6 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Durée de la promotion
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Date de début</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4ECCA3]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Date de fin</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4ECCA3]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Limite d'utilisation</label>
            <input
              type="number"
              value={formData.usageLimit}
              onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
              min="0"
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4ECCA3]"
              placeholder="Illimité"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-white/10 bg-[#1A1A1A] text-[#4ECCA3] focus:ring-[#4ECCA3]"
            />
            <label htmlFor="isActive" className="text-white">Promotion active</label>
          </div>
        </div>
      </div>

      {/* Display */}
      <div className="bg-[#2A2A2A] rounded-xl p-6 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Affichage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Badge (court)</label>
            <input
              type="text"
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4ECCA3]"
              placeholder="Ex: -20%, FLASH, PROMO"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Couleur d'accent</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.highlightColor}
                onChange={(e) => setFormData({ ...formData, highlightColor: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={formData.highlightColor}
                onChange={(e) => setFormData({ ...formData, highlightColor: e.target.value })}
                className="flex-1 px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4ECCA3]"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Texte de bannière</label>
            <input
              type="text"
              value={formData.bannerText}
              onChange={(e) => setFormData({ ...formData, bannerText: e.target.value })}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4ECCA3]"
              placeholder="Ex: ⚡ Flash Deal - Quantités limitées!"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push('/admin/promotions')}
          className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-[#4ECCA3] text-[#1A1A1A] rounded-lg hover:bg-[#3DBB92] transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Sauvegarde...' : (promotion ? 'Mettre à jour' : 'Créer la promotion')}
        </button>
      </div>
    </form>
  )
}
