"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

export type SiteSettings = Record<string, any>

export function useSiteSettings() {
  const [data, setData] = useState<SiteSettings>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  async function refresh() {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/settings", { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load settings")
      const json = await res.json()
      setData(json?.data ?? {})
    } catch (e: any) {
      toast.error(e?.message || "Erreur")
    } finally {
      setIsLoading(false)
    }
  }

  async function save(next: SiteSettings) {
    setIsSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json?.error || "Failed to save settings")
      }
      const json = await res.json()
      setData(json?.data ?? next)
      toast.success("Paramètres enregistrés")
    } catch (e: any) {
      toast.error(e?.message || "Erreur")
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const helpers = useMemo(() => ({ refresh, save }), [])
  return { data, setData, isLoading, isSaving, ...helpers }
}

