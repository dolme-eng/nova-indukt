"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { toast } from "sonner"

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
  const [folder, setFolder] = useState("nova-indukt/uploads")

  async function refresh() {
    setIsLoading(true)
    try {
      const qs = new URLSearchParams()
      if (folder) qs.set("folder", folder)
      const res = await fetch(`/api/admin/media?${qs.toString()}`, { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load media")
      const json = await res.json()
      setItems(Array.isArray(json) ? json : [])
    } catch (e: any) {
      toast.error(e?.message || "Erreur")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [folder])

  async function onUpload(file: File) {
    setIsUploading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      form.append("folder", folder)
      const res = await fetch("/api/upload", { method: "POST", body: form })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || "Upload failed")

      const img = json?.image
      await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      toast.success("Upload OK")
      await refresh()
    } catch (e: any) {
      toast.error(e?.message || "Erreur")
    } finally {
      setIsUploading(false)
    }
  }

  async function remove(publicId: string) {
    try {
      const res = await fetch(`/api/admin/media?publicId=${encodeURIComponent(publicId)}`, { method: "DELETE" })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || "Delete failed")
      toast.success("Supprimé")
      await refresh()
    } catch (e: any) {
      toast.error(e?.message || "Erreur")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Médias</h1>
          <p className="text-slate-600 mt-1">Bibliothèque Cloudinary + index DB.</p>
        </div>
        <Link href="/admin/settings" className="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-lg bg-white hover:bg-slate-50">
          Retour
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Dossier</label>
            <input
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Upload</label>
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
        <div className="text-sm text-slate-600">Chargement…</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((m) => (
            <div key={m.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="relative aspect-square bg-slate-50">
                <Image src={m.url} alt={m.publicId} fill className="object-cover" />
              </div>
              <div className="p-3 space-y-2">
                <div className="text-[10px] font-mono text-slate-500 truncate">{m.publicId}</div>
                <button
                  onClick={() => remove(m.publicId)}
                  className="w-full px-3 py-1.5 text-sm font-semibold rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="col-span-full text-sm text-slate-600">Aucun média dans ce dossier.</div>}
        </div>
      )}
    </div>
  )
}

