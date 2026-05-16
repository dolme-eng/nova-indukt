"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Image as ImageIcon,
  Check,
  Languages,
  BadgePercent,
  Box,
  Settings,
  X
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import Image from "next/image"

interface Category {
  id: string
  nameDe: string
}

interface ProductFormProps {
  initialData?: any
  categories: Category[]
}

export default function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  // Form states
  const [formData, setFormData] = useState({
    nameDe: initialData?.nameDe || "",
    slug: initialData?.slug || "",
    supplierSku: initialData?.supplierSku || "",
    ean: initialData?.ean || "",
    descriptionDe: initialData?.descriptionDe || "",
    shortDescription: initialData?.shortDescription || "",
    price: initialData?.price ? Number(initialData.price) : 0,
    oldPrice: initialData?.oldPrice ? Number(initialData.oldPrice) : null,
    costPrice: initialData?.costPrice ? Number(initialData.costPrice) : null,
    stock: initialData?.stock || 0,
    initialStock: initialData?.initialStock || 0,
    stockAlertAt: initialData?.stockAlertAt || 5,
    categoryId: initialData?.categoryId || (categories[0]?.id || ""),
    isActive: initialData?.isActive ?? true,
    weightKg: initialData?.weightKg ? Number(initialData.weightKg) : null,
    brand: initialData?.brand || "",
    material: initialData?.material || "",
    dimensions: initialData?.dimensions || "",
    dishwasherSafe: initialData?.dishwasherSafe ?? false,
    inductionSafe: initialData?.inductionSafe ?? true,
    images: initialData?.images?.map((img: any) => typeof img === 'string' ? img : img.url) || []
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(
        initialData 
          ? `/api/admin/products/${initialData.id}` 
          : "/api/admin/products",
        {
          method: initialData ? "PATCH" : "POST",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" }
        }
      )

      if (!response.ok) throw new Error("Ein Fehler ist aufgetreten")

      toast.success(initialData ? "Produkt aktualisiert" : "Produkt erstellt")
      router.push("/admin/products")
      router.refresh()
    } catch {
      toast.error("Fehler beim Speichern")
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = () => {
    const slug = formData.nameDe
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "")
    setFormData({ ...formData, slug })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/products"
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {initialData ? "Produkt bearbeiten" : "Neues Produkt"}
            </h1>
            <h2 className="text-slate-500 text-sm">Füllen Sie die untenstehenden Informationen aus</h2>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={() => router.push("/admin/products")}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Abbrechen
          </button>
          <button 
            onClick={onSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm"
          >
            <Save size={18} />
            {isLoading ? "Wird gespeichert..." : "Speichern"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 space-y-1">
          <TabButton 
            active={activeTab === "general"} 
            onClick={() => setActiveTab("general")}
            icon={<Settings size={18} />}
            label="Informationen"
          />
          <TabButton 
            active={activeTab === "translations"} 
            onClick={() => setActiveTab("translations")}
            icon={<Languages size={18} />}
            label="Texte"
          />
          <TabButton 
            active={activeTab === "pricing"} 
            onClick={() => setActiveTab("pricing")}
            icon={<BadgePercent size={18} />}
            label="Preis & Lager"
          />
          <TabButton 
            active={activeTab === "media"} 
            onClick={() => setActiveTab("media")}
            icon={<ImageIcon size={18} />}
            label="Medien"
          />
          <TabButton 
            active={activeTab === "specs"} 
            onClick={() => setActiveTab("specs")}
            icon={<Box size={18} />}
            label="Spezifikationen"
          />
        </div>

        {/* Form Sections */}
        <div className="lg:col-span-3 space-y-6">
          <form className="space-y-6">
            {activeTab === "general" && (
              <Section title="Allgemeine Informationen">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Name (Deutsch) *</span>
                      <div className="mt-1 flex gap-2">
                        <input 
                          type="text" 
                          required
                          value={formData.nameDe}
                          onChange={(e) => setFormData({...formData, nameDe: e.target.value})}
                          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                        <button 
                          type="button"
                          onClick={generateSlug}
                          className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 uppercase transition-all"
                        >
                          Slug
                        </button>
                      </div>
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Slug (URL) *</span>
                      <input 
                        type="text" 
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({...formData, slug: e.target.value})}
                        className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Lieferanten-SKU</span>
                      <input 
                        type="text" 
                        value={formData.supplierSku}
                        onChange={(e) => setFormData({...formData, supplierSku: e.target.value})}
                        className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">EAN-Code</span>
                      <input 
                        type="text" 
                        value={formData.ean}
                        onChange={(e) => setFormData({...formData, ean: e.target.value})}
                        className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Kategorie *</span>
                    <select 
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nameDe}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                    <input 
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-5 h-5 rounded text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-900">Produkt aktiv</span>
                      <p className="text-xs text-slate-500">Machen Sie das Produkt auf der öffentlichen Website sichtbar.</p>
                    </div>
                  </label>
                </div>
              </Section>
            )}

            {activeTab === "translations" && (
              <Section title="Texte & Beschreibungen">
                <div className="space-y-6">
                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">DE</span>
                      Deutsche Beschreibung
                    </h3>
                    <textarea 
                      rows={6}
                      value={formData.descriptionDe}
                      onChange={(e) => setFormData({...formData, descriptionDe: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">DE</span>
                      Kurzbeschreibung
                    </h3>
                    <textarea 
                      rows={2}
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </Section>
            )}

            {activeTab === "pricing" && (
              <Section title="Preise & Lagerbestand">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Verkaufspreis (€) *</span>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                        className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </label>
                    <label className="block text-slate-400">
                      <span className="text-sm font-semibold text-slate-500">Alter Preis (€)</span>
                      <input 
                        type="number" 
                        step="0.01"
                        value={formData.oldPrice || ""}
                        onChange={(e) => setFormData({...formData, oldPrice: e.target.value ? Number(e.target.value) : null})}
                        className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </label>
                    <label className="block text-slate-400">
                      <span className="text-sm font-semibold text-slate-500">Selbstkosten (€)</span>
                      <input 
                        type="number" 
                        step="0.01"
                        value={formData.costPrice || ""}
                        onChange={(e) => setFormData({...formData, costPrice: e.target.value ? Number(e.target.value) : null})}
                        className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Aktueller Bestand</span>
                      <input 
                        type="number" 
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                        className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Anfangsbestand (für UI)</span>
                      <input 
                        type="number" 
                        value={formData.initialStock}
                        onChange={(e) => setFormData({...formData, initialStock: Number(e.target.value)})}
                        className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Bestandswarnung bei</span>
                      <input 
                        type="number" 
                        value={formData.stockAlertAt}
                        onChange={(e) => setFormData({...formData, stockAlertAt: Number(e.target.value)})}
                        className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </label>
                  </div>
                </div>
              </Section>
            )}

            {activeTab === "media" && (
          <Section title="Produktbilder">
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {formData.images.map((imgUrl: string, index: number) => (
                  <div key={index} className="aspect-square relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                    <Image src={imgUrl} alt="Produkt" fill className="object-cover" />
                    <button 
                      type="button"
                      onClick={() => {
                        const newImages = [...formData.images]
                        newImages.splice(index, 1)
                        setFormData({...formData, images: newImages})
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">Hauptbild</span>
                    )}
                  </div>
                ))}
                <div className="relative aspect-square">
                  <input 
                    type="file"
                    accept="image/*"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={async (e) => {
                      const files = e.target.files
                      if (!files) return
                      
                      setIsLoading(true)
                      const newImages = [...formData.images]
                      
                      for (let i = 0; i < files.length; i++) {
                        const file = files[i]
                        const uploadFormData = new FormData()
                        uploadFormData.append("file", file)
                        
                        try {
                          const res = await fetch("/api/admin/upload", {
                            method: "POST",
                            body: uploadFormData
                          })
                          const data = await res.json()
                          if (data.url) {
                            newImages.push(data.url)
                          }
                        } catch (err) {
                          toast.error(`Upload fehlgeschlagen für ${file.name}`)
                        }
                      }
                      
                      setFormData({...formData, images: newImages})
                      setIsLoading(false)
                    }}
                  />
                  <button 
                    type="button"
                    className="w-full h-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-primary hover:border-primary hover:bg-slate-50 transition-all"
                  >
                    <Plus size={24} />
                    <span className="text-xs font-bold uppercase tracking-wider">Hinzufügen</span>
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 italic">Die Bilder werden automatisch hochgeladen. Das erste Bild ist das Hauptbild.</p>
            </div>
          </Section>
            )}

            {activeTab === "specs" && (
              <Section title="Technische Spezifikationen">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Marke</span>
                      <input 
                        type="text" 
                        value={formData.brand}
                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                        className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Material</span>
                      <input 
                        type="text" 
                        value={formData.material}
                        onChange={(e) => setFormData({...formData, material: e.target.value})}
                        className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Abmessungen</span>
                      <input 
                        type="text" 
                        placeholder="z.B.: 20cm x 15cm"
                        value={formData.dimensions}
                        onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                        className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </label>
                    <label className="block text-slate-400">
                      <span className="text-sm font-semibold text-slate-500">Gewicht (kg)</span>
                      <input 
                        type="number" 
                        step="0.001"
                        value={formData.weightKg || ""}
                        onChange={(e) => setFormData({...formData, weightKg: e.target.value ? Number(e.target.value) : null})}
                        className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox"
                        checked={formData.dishwasherSafe}
                        onChange={(e) => setFormData({...formData, dishwasherSafe: e.target.checked})}
                        className="w-5 h-5 rounded text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-bold text-slate-900 italic">Spülmaschinenfest</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox"
                        checked={formData.inductionSafe}
                        onChange={(e) => setFormData({...formData, inductionSafe: e.target.checked})}
                        className="w-5 h-5 rounded text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-bold text-slate-900 italic">Induktionsgeeignet</span>
                    </label>
                  </div>
                </div>
              </Section>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{title}</h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all ${
        active 
          ? "bg-primary text-white shadow-md shadow-primary/20" 
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
      }`}
    >
      {icon}
      {label}
      {active && <Check size={16} className="ml-auto" />}
    </button>
  )
}
