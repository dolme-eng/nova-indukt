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
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface BlogPostData {
  id?: string
  titleDe?: string | null
  slug?: string | null
  excerptDe?: string | null
  contentDe?: string | null
  image?: string | null
  category?: string | null
  author?: string | null
  readTime?: string | null
  isPublished?: boolean
}

interface BlogPostFormProps {
  initialData?: BlogPostData
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
    isPublished: initialData?.isPublished || false,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug from title
    if (name === 'titleDe' && !initialData) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData((prev) => ({ ...prev, slug: generatedSlug }))
    }
  }

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, isPublished: !prev.isPublished }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/blog' + (initialData ? `/${initialData.id}` : ''), {
        method: initialData ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Fehler beim Speichern')

      toast.success(initialData ? 'Artikel aktualisiert' : 'Artikel erfolgreich erstellt')
      router.push('/admin/blog')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Ein Fehler ist aufgetreten')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="rounded-full p-2 transition-colors hover:bg-slate-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {initialData ? 'Artikel bearbeiten' : 'Neuer Artikel'}
            </h1>
            <p className="text-slate-500">Füllen Sie die Details Ihres Artikels aus</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="rounded-lg px-4 py-2 font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            Abbrechen
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 font-bold text-white shadow-md shadow-primary/20 transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Save size={18} />
            )}
            Speichern
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Titel (DE)
              </label>
              <input
                required
                type="text"
                name="titleDe"
                value={formData.titleDe}
                onChange={handleChange}
                placeholder="z.B. Die Wahl der richtigen Pfanne..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium outline-none transition-all focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Slug / URL
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-500">
                <span>nova-indukt.de/blog/</span>
                <input
                  required
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="flex-1 border-none bg-transparent p-0 font-medium text-slate-900 outline-none focus:ring-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Auszug (Excerpt)
              </label>
              <textarea
                required
                name="excerptDe"
                value={formData.excerptDe}
                onChange={handleChange}
                rows={3}
                placeholder="Kurze Zusammenfassung für die Vorschau..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Inhalt (Markdown)
              </label>
              <textarea
                required
                name="contentDe"
                value={formData.contentDe}
                onChange={handleChange}
                rows={15}
                placeholder="## Überschrift... - Liste... **Fett**..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm outline-none transition-all focus:ring-2 focus:ring-primary"
              />
              <p className="text-[10px] text-slate-400">
                Unterstützt einfaches Markdown (## für Überschriften, - für Listen, ** für Fett).
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Status & Visibility */}
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-slate-900">
              <Eye size={18} className="text-slate-400" />
              Sichtbarkeit
            </h3>

            <button
              type="button"
              onClick={handleToggle}
              className={`flex w-full items-center justify-between rounded-xl border p-3 transition-all ${
                formData.isPublished
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                {formData.isPublished ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <span className="font-bold">
                  {formData.isPublished ? 'Veröffentlicht' : 'Entwurf'}
                </span>
              </div>
              <div
                className={`relative h-5 w-10 rounded-full transition-colors ${formData.isPublished ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div
                  className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-all ${formData.isPublished ? 'right-1' : 'left-1'}`}
                />
              </div>
            </button>

            <p className="text-xs leading-relaxed text-slate-500">
              {formData.isPublished
                ? 'Der Artikel ist für alle Besucher auf der Seite sichtbar.'
                : 'Der Artikel ist nur in der Verwaltung sichtbar.'}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-slate-900">Artikeldetails</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                  <Tag size={14} /> Kategorie
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Ratgeber">Ratgeber</option>
                  <option value="Technik">Technik</option>
                  <option value="Pflege">Pflege</option>
                  <option value="Rezepte">Rezepte</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                  <User size={14} /> Autor
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                  <Clock size={14} /> Lesezeit
                </label>
                <input
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  placeholder="z.B. 8 min"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-slate-900">
              <ImageIcon size={18} className="text-slate-400" />
              Beitragsbild
            </h3>

            {formData.image && (
              <div className="relative aspect-video overflow-hidden rounded-lg border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formData.image} alt="Vorschau" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white shadow-lg transition-colors hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <p className="text-[10px] text-slate-400">
              Laden Sie ein Bild auf Cloudinary hoch oder verwenden Sie einen Unsplash-Link.
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}
