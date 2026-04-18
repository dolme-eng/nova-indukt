'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Save, 
  X, 
  ArrowLeft, 
  Image as ImageIcon, 
  Clock, 
  Tag, 
  User,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface BlogPostFormProps {
  initialData?: any
}

export default function BlogPostForm({ initialData }: BlogPostFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    titleDe: initialData?.titleDe || '',
    slug: initialData?.slug || '',
    excerptDe: initialData?.excerptDe || '',
    contentDe: initialData?.contentDe || '',
    image: initialData?.image || '',
    category: initialData?.category || 'Ratgeber',
    author: initialData?.author || 'NOVA Team',
    readTime: initialData?.readTime || '5 min',
    isPublished: initialData?.isPublished || false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Auto-generate slug from title
    if (name === 'titleDe' && !initialData) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug: generatedSlug }))
    }
  }

  const handleToggle = () => {
    setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/blog' + (initialData ? `/${initialData.id}` : ''), {
        method: initialData ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Erreur lors de l\'enregistrement')

      toast.success(initialData ? 'Article mis à jour' : 'Article créé avec succès')
      router.push('/admin/blog')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/blog" 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {initialData ? 'Artikel bearbeiten' : 'Neuer Artikel'}
            </h1>
            <p className="text-slate-500">Remplissez les détails de votre article</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/blog"
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-bold shadow-md shadow-primary/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Sauvegarder
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Titel (DE)</label>
              <input
                required
                type="text"
                name="titleDe"
                value={formData.titleDe}
                onChange={handleChange}
                placeholder="Ex: Die Wahl der richtigen Pfanne..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Slug / URL</label>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-sm">
                <span>nova-indukt.de/blog/</span>
                <input
                  required
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="bg-transparent border-none p-0 focus:ring-0 text-slate-900 font-medium flex-1 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Auszug (Excerpt)</label>
              <textarea
                required
                name="excerptDe"
                value={formData.excerptDe}
                onChange={handleChange}
                rows={3}
                placeholder="Kurze Zusammenfassung für die Vorschau..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Inhalt (Markdown)</label>
              <textarea
                required
                name="contentDe"
                value={formData.contentDe}
                onChange={handleChange}
                rows={15}
                placeholder="## Überschrift... - Liste... **Fett**..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-mono text-sm"
              />
              <p className="text-[10px] text-slate-400">Supporte le Markdown de base (## pour les titres, - pour les listes, ** pour le gras).</p>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Status & Visibility */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Eye size={18} className="text-slate-400" />
              Sichtbarkeit
            </h3>
            
            <button
              type="button"
              onClick={handleToggle}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                formData.isPublished 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                {formData.isPublished ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <span className="font-bold">{formData.isPublished ? 'Publié' : 'Brouillon'}</span>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.isPublished ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.isPublished ? 'right-1' : 'left-1'}`} />
              </div>
            </button>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              {formData.isPublished 
                ? 'L\'article est visible par tous les visiteurs sur le site.' 
                : 'L\'article n\'est visible que dans l\'administration.'}
            </p>
          </div>

          {/* Details */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900">Détails de l'article</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Tag size={14} /> Catégorie
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm font-medium"
                >
                  <option value="Ratgeber">Ratgeber</option>
                  <option value="Technik">Technik</option>
                  <option value="Rezepte">Rezepte</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <User size={14} /> Auteur
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Clock size={14} /> Temps de lecture
                </label>
                <input
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  placeholder="Ex: 8 min"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon size={18} className="text-slate-400" />
              Beitragsbild
            </h3>
            
            {formData.image && (
              <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200">
                <img src={formData.image} alt="Vorschau" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm"
              />
            </div>
            
            <p className="text-[10px] text-slate-400">Uploadez une image sur Cloudinary ou utilisez un lien Unsplash.</p>
          </div>
        </div>
      </div>
    </form>
  )
}
