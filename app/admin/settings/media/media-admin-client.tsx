'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type MediaAsset = {
  id: string
  publicId: string
  url: string
  width: number | null
  height: number | null
  bytes: number | null
  format: string | null
  folder: string | null
  createdAt: string
}

export function MediaAdminClient() {
  const [items, setItems] = useState<MediaAsset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [folder, setFolder] = useState('nova-indukt/uploads')

  async function refresh() {
    setIsLoading(true)
    try {
      const qs = new URLSearchParams()
      if (folder) qs.set('folder', folder)
      const res = await fetch(`/api/admin/media?${qs.toString()}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load media')
      const json = await res.json()
      setItems(Array.isArray(json) ? json : [])
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Fehler')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder])

  async function onUpload(file: File) {
    setIsUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', folder)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'Upload failed')

      const img = json?.image
      await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicId: img.id,
          url: img.url,
          width: img.width,
          height: img.height,
          bytes: img.size,
          format: img.format,
          folder,
        }),
      })
      toast.success('Upload OK')
      await refresh()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Fehler')
    } finally {
      setIsUploading(false)
    }
  }

  async function remove(publicId: string) {
    if (!confirm('Dieses Medium dauerhaft löschen?')) return
    try {
      const res = await fetch(`/api/admin/media?publicId=${encodeURIComponent(publicId)}`, {
        method: 'DELETE',
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'Delete failed')
      toast.success('Gelöscht')
      await refresh()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Fehler')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Medien</h1>
          <p className="mt-1 text-slate-600">Cloudinary-Bibliothek + DB-Index.</p>
        </div>
        <Link
          href="/admin/settings"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          Zurück
        </Link>
      </div>

      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Ordner
            </label>
            <input
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Upload
            </label>
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onUpload(file)
              }}
              className="w-full text-sm"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm text-slate-600">Laden...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="relative aspect-square bg-slate-50">
                <Image src={m.url} alt={m.publicId} fill className="object-cover" />
              </div>
              <div className="space-y-2 p-3">
                <div className="truncate font-mono text-[10px] text-slate-500">{m.publicId}</div>
                <button
                  onClick={() => remove(m.publicId)}
                  className="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-100"
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-sm text-slate-600">
              Keine Medien in diesem Ordner.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
