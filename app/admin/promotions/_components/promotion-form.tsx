'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, X, Percent, Euro, Tag, Calendar, Package, Folder, Ticket } from 'lucide-react'

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
  promotion?: any
}

export default function PromotionForm({ promotion }: PromotionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  
  const [formData, setFormData] = useState({
    name: promotion?.name || '',
    description: promotion?.description || '',
    code: promotion?.code || '',
    isCoupon: promotion?.isCoupon || false,
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
          code: formData.isCoupon ? formData.code.toUpperCase() : null,
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
        alert(error.error || 'Ein Fehler ist aufgetreten')
      }
    } catch (error) {
      console.error('Error saving promotion:', error)
      alert('Fehler beim Speichern')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-[#2A2A2A] rounded-xl p-6 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-4">Allgemeine Informationen</h2>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-1">Name der Aktion</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4ECCA3]"
                placeholder="z.B. Flash Deal -20%"
              />
            </div>
            <div className="w-full md:w-1/3">
               <label className="block text-sm font-medium text-gray-400 mb-1">Typ</label>
               <div className="flex gap-2">
                 <button
                   type="button"
                   onClick={() => setFormData({ ...formData, isCoupon: false })}
                   className={`flex-1 px-4 py-2 rounded-lg border transition-all text-sm font-bold ${
                     !formData.isCoupon
                       ? 'bg-[#4ECCA3]/20 border-[#4ECCA3] text-[#4ECCA3]'
                       : 'bg-[#1A1A1A] border-white/10 text-gray-400'
                   }`}
                 >
                   Automatisch
                 </button>
                 <button
                   type="button"
                   onClick={() => setFormData({ ...formData, isCoupon: true })}
                   className={`flex-1 px-4 py-2 rounded-lg border transition-all text-sm font-bold ${
                     formData.isCoupon
                       ? 'bg-[#4ECCA3]/20 border-[#4ECCA3] text-[#4ECCA3]'
                       : 'bg-[#1A1A1A] border-white/10 text-gray-400'
                   }`}
                 >
                   Gutschein
                 </button>
               </div>
            </div>
          </div>

          {formData.isCoupon && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl"
            >
              <label className="block text-sm font-medium text-purple-400 mb-1 flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                Gutscheincode
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                required={formData.isCoupon}
                className="w-full px-4 py-2 bg-[#1A1A1A] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 font-mono uppercase tracking-widest"
                placeholder="Z.B. SOMMER20"
              />
              <p className="text-xs text-gray-500 mt-2">Kunden müssen diesen Code im Warenkorb/Checkout eingeben.</p>
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Beschreibung</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4ECCA3]"
              placeholder="Beschreibung der Aktion..."
            />
          </div>
        </div>
      </div>

      {/* Discount Settings */}
      <div className="bg-[#2A2A2A] rounded-xl p-6 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-4">Rabatteinstellungen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Rabattart</label>
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
                Prozentsatz
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
                Fester Betrag
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Wert {formData.discountType === 'PERCENTAGE' ? '(%)' : '(€)'}
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
            <label className="block text-sm font-medium text-gray-400 mb-1">Mindestbestellwert (€)</label>
            <input
              type="number"
              value={formData.minOrderAmount}
              onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
              min="0"
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4ECCA3]"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Maximaler Rabatt (€)</label>
            <input
              type="number"
              value={formData.maxDiscount}
              onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
              min="0"
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4ECCA3]"
              placeholder="Optional"
            />
          </div>
        </div>
      </div>

      {/* Scope */}
      <div className="bg-[#2A2A2A] rounded-xl p-6 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-4">Geltungsbereich</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isGlobal"
              checked={formData.isGlobal}
              onChange={(e) => setFormData({ ...formData, isGlobal: e.target.checked })}
              className="w-4 h-4 rounded border-white/10 bg-[#1A1A1A] text-[#4ECCA3] focus:ring-[#4ECCA3]"
            />
            <label htmlFor="isGlobal" className="text-white">Auf alle Produkte anwenden (globale Aktion)</label>
          </div>

          {!formData.isGlobal && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  Betroffene Kategorien
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
                  Spezifische Produkte
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
                <p className="text-xs text-gray-500 mt-1">Halten Sie Strg/Cmd gedrückt, um mehrere Produkte auszuwählen</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Duration */}
      <div className="bg-[#2A2A2A] rounded-xl p-6 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Dauer der Aktion
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Startdatum</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4ECCA3]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Enddatum</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4ECCA3]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nutzungsgrenze</label>
            <input
              type="number"
              value={formData.usageLimit}
              onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
              min="0"
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4ECCA3]"
              placeholder="Unbegrenzt"
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
            <label htmlFor="isActive" className="text-white">Aktion aktiv</label>
          </div>
        </div>
      </div>

      {/* Display */}
      <div className="bg-[#2A2A2A] rounded-xl p-6 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Anzeige
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Badge (kurz)</label>
            <input
              type="text"
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4ECCA3]"
              placeholder="z.B. -20%, FLASH, PROMO"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Akzentfarbe</label>
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
            <label className="block text-sm font-medium text-gray-400 mb-1">Banner-Text</label>
            <input
              type="text"
              value={formData.bannerText}
              onChange={(e) => setFormData({ ...formData, bannerText: e.target.value })}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#4ECCA3]"
              placeholder="z.B. ⚡ Flash Deal - Begrenzte Stückzahl!"
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
          Abbrechen
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-[#4ECCA3] text-[#1A1A1A] rounded-lg hover:bg-[#3DBB92] transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Speichern...' : (promotion ? 'Aktualisieren' : 'Aktion erstellen')}
        </button>
      </div>
    </form>
  )
}
