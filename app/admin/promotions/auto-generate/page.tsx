'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, Zap, Calendar, Tag, Package, ArrowLeft, Loader2 } from 'lucide-react'

interface Category {
  id: string
  nameDe: string
}

export default function AutoGeneratePromotionsPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState({
    type: 'flash' as 'flash' | 'weekend' | 'clearance' | 'new-arrival',
    discountPercent: 20,
    durationDays: 3,
    categoryIds: [] as string[],
    productCount: 10
  })

  useEffect(() => {
    fetchCategories()
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

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/promotions/auto-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      if (response.ok) {
        router.push('/admin/promotions')
      } else {
        const error = await response.json()
        alert(error.error || 'Une erreur est survenue')
      }
    } catch (error) {
      console.error('Error generating promotions:', error)
      alert('Erreur lors de la génération')
    } finally {
      setLoading(false)
    }
  }

  const templates = [
    {
      id: 'flash',
      name: '⚡ Flash Deal',
      description: 'Offre éclair sur les produits les plus populaires',
      icon: Zap,
      defaultDiscount: 25,
      defaultDuration: 2,
      color: '#FF6B6B'
    },
    {
      id: 'weekend',
      name: '🎉 Weekend Special',
      description: 'Promotion valable uniquement ce week-end',
      icon: Calendar,
      defaultDiscount: 15,
      defaultDuration: 3,
      color: '#4ECCA3'
    },
    {
      id: 'clearance',
      name: '🏷️ Déstockage',
      description: 'Liquidation des stocks élevés',
      icon: Package,
      defaultDiscount: 30,
      defaultDuration: 7,
      color: '#FFA500'
    },
    {
      id: 'new-arrival',
      name: '✨ Nouveautés',
      description: 'Offre de lancement sur les nouveautés',
      icon: Sparkles,
      defaultDiscount: 10,
      defaultDuration: 5,
      color: '#9B59B6'
    }
  ]

  const selectedTemplate = templates.find(t => t.id === config.type)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/promotions')}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Génération automatique</h1>
          <p className="text-gray-400 mt-1">Créez des promotions automatiquement selon des modèles prédéfinis</p>
        </div>
      </div>

      {/* Template Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <motion.button
            key={template.id}
            onClick={() => setConfig({ 
              ...config, 
              type: template.id as any,
              discountPercent: template.defaultDiscount,
              durationDays: template.defaultDuration
            })}
            className={`p-6 rounded-xl border-2 text-left transition-all ${
              config.type === template.id
                ? 'border-[#4ECCA3] bg-[#4ECCA3]/10'
                : 'border-white/10 bg-[#2A2A2A] hover:border-white/20'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: `${template.color}20` }}
            >
              <template.icon className="w-6 h-6" style={{ color: template.color }} />
            </div>
            <h3 className="text-white font-semibold mb-1">{template.name}</h3>
            <p className="text-sm text-gray-400">{template.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Configuration */}
      <div className="bg-[#2A2A2A] rounded-xl p-6 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#4ECCA3]" />
          Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Pourcentage de réduction
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="50"
                value={config.discountPercent}
                onChange={(e) => setConfig({ ...config, discountPercent: Number(e.target.value) })}
                className="flex-1 h-2 bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-[#4ECCA3]"
              />
              <span className="text-2xl font-bold text-[#4ECCA3] w-16 text-center">
                {config.discountPercent}%
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Durée (jours)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="14"
                value={config.durationDays}
                onChange={(e) => setConfig({ ...config, durationDays: Number(e.target.value) })}
                className="flex-1 h-2 bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-[#4ECCA3]"
              />
              <span className="text-2xl font-bold text-[#4ECCA3] w-16 text-center">
                {config.durationDays}j
              </span>
            </div>
          </div>
        </div>

        {config.type === 'flash' && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Nombre de produits à inclure
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="50"
                value={config.productCount}
                onChange={(e) => setConfig({ ...config, productCount: Number(e.target.value) })}
                className="flex-1 h-2 bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-[#4ECCA3]"
              />
              <span className="text-2xl font-bold text-[#4ECCA3] w-16 text-center">
                {config.productCount}
              </span>
            </div>
          </div>
        )}

        <div className="mt-6">
          <label className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Catégories (optionnel)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-[#1A1A1A] rounded-lg border border-white/10">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2 p-2 hover:bg-white/5 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.categoryIds.includes(category.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setConfig({ ...config, categoryIds: [...config.categoryIds, category.id] })
                    } else {
                      setConfig({ ...config, categoryIds: config.categoryIds.filter(id => id !== category.id) })
                    }
                  }}
                  className="w-4 h-4 rounded border-white/10 bg-[#2A2A2A] text-[#4ECCA3]"
                />
                <span className="text-sm text-gray-300">{category.nameDe}</span>
              </label>
            ))}
          </div>
          {config.categoryIds.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Aucune sélection = toutes les catégories
            </p>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-[#2A2A2A] rounded-xl p-6 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-4">Aperçu</h2>
        <div className="flex items-center gap-4 p-4 bg-[#1A1A1A] rounded-lg">
          <div 
            className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl"
            style={{ backgroundColor: selectedTemplate?.color || '#4ECCA3' }}
          >
            -{config.discountPercent}%
          </div>
          <div>
            <h3 className="text-white font-semibold">{selectedTemplate?.name}</h3>
            <p className="text-gray-400">{selectedTemplate?.description}</p>
            <p className="text-sm text-[#4ECCA3] mt-1">
              Durée: {config.durationDays} jours • Réduction: {config.discountPercent}%
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => router.push('/admin/promotions')}
          className="px-6 py-3 text-gray-400 hover:text-white transition-all"
        >
          Annuler
        </button>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Génération...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Générer la promotion</>
          )}
        </button>
      </div>
    </div>
  )
}
