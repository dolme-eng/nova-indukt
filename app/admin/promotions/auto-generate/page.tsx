'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
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
    productCount: 10,
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
        body: JSON.stringify(config),
      })

      if (response.ok) {
        toast.success('Aktionen generiert')
        router.push('/admin/promotions')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Ein Fehler ist aufgetreten')
      }
    } catch (error) {
      console.error('Error generating promotions:', error)
      toast.error('Fehler bei der Generierung')
    } finally {
      setLoading(false)
    }
  }

  const templates = [
    {
      id: 'flash',
      name: 'Flash Deal',
      description: 'Schnellangebot auf die beliebtesten Produkte',
      icon: Zap,
      defaultDiscount: 25,
      defaultDuration: 2,
      color: '#FF6B6B',
    },
    {
      id: 'weekend',
      name: 'Weekend Special',
      description: 'Angebot gültig nur am Wochenende',
      icon: Calendar,
      defaultDiscount: 15,
      defaultDuration: 3,
      color: '#4ECCA3',
    },
    {
      id: 'clearance',
      name: 'Resteverkauf',
      description: 'Abverkauf hoher Lagerbestände',
      icon: Package,
      defaultDiscount: 30,
      defaultDuration: 7,
      color: '#FFA500',
    },
    {
      id: 'new-arrival',
      name: 'Neuheiten',
      description: 'Einführungsangebot auf neue Produkte',
      icon: Sparkles,
      defaultDiscount: 10,
      defaultDuration: 5,
      color: '#9B59B6',
    },
  ]

  const selectedTemplate = templates.find((t) => t.id === config.type)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/promotions')}
          className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Automatische Generierung</h1>
          <p className="mt-1 text-slate-600">
            Erstellen Sie Aktionen automatisch anhand von Vorlagen
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() =>
              setConfig({
                ...config,
                type: template.id as typeof config.type,
                discountPercent: template.defaultDiscount,
                durationDays: template.defaultDuration,
              })
            }
            className={`rounded-xl border-2 p-6 text-left transition-all ${
              config.type === template.id
                ? 'border-primary bg-primary/5'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${template.color}20` }}
            >
              <template.icon className="h-6 w-6" style={{ color: template.color }} />
            </div>
            <h3 className="mb-1 font-semibold text-slate-900">{template.name}</h3>
            <p className="text-sm text-slate-500">{template.description}</p>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Sparkles className="h-5 w-5 text-primary" />
          Konfiguration
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Rabattprozent</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="50"
                value={config.discountPercent}
                onChange={(e) => setConfig({ ...config, discountPercent: Number(e.target.value) })}
                className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-200 accent-primary"
              />
              <span className="w-16 text-center text-2xl font-bold text-primary">
                {config.discountPercent}%
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Dauer (Tage)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="14"
                value={config.durationDays}
                onChange={(e) => setConfig({ ...config, durationDays: Number(e.target.value) })}
                className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-200 accent-primary"
              />
              <span className="w-16 text-center text-2xl font-bold text-primary">
                {config.durationDays}t
              </span>
            </div>
          </div>
        </div>

        {config.type === 'flash' && (
          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Anzahl der Produkte
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="50"
                value={config.productCount}
                onChange={(e) => setConfig({ ...config, productCount: Number(e.target.value) })}
                className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-200 accent-primary"
              />
              <span className="w-16 text-center text-2xl font-bold text-primary">
                {config.productCount}
              </span>
            </div>
          </div>
        )}

        <div className="mt-6">
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
            <Tag className="h-4 w-4" />
            Kategorien (optional)
          </label>
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-4">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-slate-100"
              >
                <input
                  type="checkbox"
                  checked={config.categoryIds.includes(category.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setConfig({ ...config, categoryIds: [...config.categoryIds, category.id] })
                    } else {
                      setConfig({
                        ...config,
                        categoryIds: config.categoryIds.filter((id) => id !== category.id),
                      })
                    }
                  }}
                  className="h-4 w-4 rounded border-slate-300 text-primary"
                />
                <span className="text-sm text-slate-700">{category.nameDe}</span>
              </label>
            ))}
          </div>
          {config.categoryIds.length === 0 && (
            <p className="mt-2 text-sm text-slate-500">Keine Auswahl = alle Kategorien</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Vorschau</h2>
        <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-lg text-xl font-bold text-white"
            style={{ backgroundColor: selectedTemplate?.color || '#4ECCA3' }}
          >
            -{config.discountPercent}%
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{selectedTemplate?.name}</h3>
            <p className="text-slate-500">{selectedTemplate?.description}</p>
            <p className="mt-1 text-sm text-primary">
              Dauer: {config.durationDays} Tage &bull; Rabatt: {config.discountPercent}%
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => router.push('/admin/promotions')}
          className="px-6 py-3 text-slate-500 transition-all hover:text-slate-700"
        >
          Abbrechen
        </button>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-white transition-all hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Generierung...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Aktion erstellen
            </>
          )}
        </button>
      </div>
    </div>
  )
}
