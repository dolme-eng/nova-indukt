'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

type StaticPage = { id: string; slug: string; title: string; isActive: boolean; updatedAt: string }
type StaticPageFull = StaticPage & { content: string; createdAt: string }
type FaqItem = {
  id: string
  category: string
  question: string
  answer: string
  sortOrder: number
  isActive: boolean
}

function Card({
  title,
  desc,
  children,
}: {
  title: string
  desc: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{desc}</p>
      </div>
      {children}
    </div>
  )
}

export function ContentAdminClient() {
  const [pages, setPages] = useState<StaticPage[]>([])
  const [faq, setFaq] = useState<FaqItem[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string>('')
  const [pageDraft, setPageDraft] = useState<StaticPageFull | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [newPage, setNewPage] = useState({ slug: '', title: '' })
  const [newFaq, setNewFaq] = useState({ category: 'support', question: '', answer: '' })

  async function refresh() {
    setIsLoading(true)
    try {
      const [p, f] = await Promise.all([
        fetch('/api/admin/content/pages', { cache: 'no-store' }).then((r) => r.json()),
        fetch('/api/admin/content/faq', { cache: 'no-store' }).then((r) => r.json()),
      ])
      setPages(Array.isArray(p) ? p : [])
      setFaq(Array.isArray(f) ? f : [])
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Fehler')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  useEffect(() => {
    if (!selectedSlug) {
      setPageDraft(null)
      return
    }
    ;(async () => {
      try {
        const res = await fetch(`/api/admin/content/pages/${encodeURIComponent(selectedSlug)}`, {
          cache: 'no-store',
        })
        if (!res.ok) throw new Error('Failed to load page')
        const json = await res.json()
        setPageDraft(json)
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Fehler')
      }
    })()
  }, [selectedSlug])

  const selectedPageMeta = useMemo(
    () => pages.find((p) => p.slug === selectedSlug) || null,
    [pages, selectedSlug]
  )

  async function savePage() {
    if (!pageDraft) return
    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/content/pages/${encodeURIComponent(pageDraft.slug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pageDraft.title,
          content: pageDraft.content,
          isActive: pageDraft.isActive,
        }),
      })
      if (!res.ok) throw new Error('Failed to save page')
      toast.success('Seite gespeichert')
      await refresh()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Fehler')
    } finally {
      setIsSaving(false)
    }
  }

  async function createPage() {
    if (!newPage.slug || !newPage.title) return
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/content/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: newPage.slug, title: newPage.title, content: '' }),
      })
      if (!res.ok) throw new Error('Failed to create page')
      toast.success('Seite erstellt')
      setNewPage({ slug: '', title: '' })
      await refresh()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Fehler')
    } finally {
      setIsSaving(false)
    }
  }

  async function createFaq() {
    if (!newFaq.question || !newFaq.answer) return
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/content/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newFaq.category,
          question: newFaq.question,
          answer: newFaq.answer,
          sortOrder: 0,
          isActive: true,
        }),
      })
      if (!res.ok) throw new Error('Failed to create FAQ')
      toast.success('FAQ hinzugefügt')
      setNewFaq({ category: 'support', question: '', answer: '' })
      await refresh()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Fehler')
    } finally {
      setIsSaving(false)
    }
  }

  async function updateFaq(id: string, patch: Partial<FaqItem>) {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/content/faq/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      if (!res.ok) throw new Error('Failed to update FAQ')
      await refresh()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Fehler')
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteFaq(id: string) {
    if (!confirm('FAQ-Eintrag dauerhaft löschen?')) return
    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/content/faq/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete FAQ')
      toast.success('FAQ gelöscht')
      await refresh()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Fehler')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="text-sm text-slate-600">Laden...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inhalte</h1>
          <p className="mt-1 text-slate-600">FAQ + Seiten (Impressum, etc.).</p>
        </div>
        <Link
          href="/admin/settings"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          Zurück
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card
          title="Seiten"
          desc="In DB gespeichert. Routen können diese Inhalte lesen (Override)."
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              value={newPage.slug}
              onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
              placeholder="slug (ex: agb)"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
            <input
              value={newPage.title}
              onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
              placeholder="Titel"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={createPage}
            disabled={isSaving}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
          >
            Seite erstellen
          </button>

          <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Auswahl
              </label>
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
              >
                <option value="">— Wählen —</option>
                {pages.map((p) => (
                  <option key={p.id} value={p.slug}>
                    {p.slug} — {p.title}
                  </option>
                ))}
              </select>
            </div>
            {selectedPageMeta && (
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={pageDraft?.isActive ?? true}
                  onChange={(e) =>
                    setPageDraft(
                      pageDraft ? { ...pageDraft, isActive: e.target.checked } : pageDraft
                    )
                  }
                />
                Aktiv
              </label>
            )}
          </div>

          {pageDraft && (
            <div className="space-y-3">
              <input
                value={pageDraft.title}
                onChange={(e) => setPageDraft({ ...pageDraft, title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
              />
              <textarea
                value={pageDraft.content}
                onChange={(e) => setPageDraft({ ...pageDraft, content: e.target.value })}
                rows={12}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm"
                placeholder="Inhalt (einfacher Text / leichtes Markdown je nach Wahl)"
              />
              <button
                onClick={savePage}
                disabled={isSaving}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
              >
                Seite speichern
              </button>
            </div>
          )}
        </Card>

        <Card title="FAQ" desc="Erstellen/Bearbeiten/Aktivieren/Deaktivieren/Löschen.">
          <div className="space-y-3">
            <select
              value={newFaq.category}
              onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            >
              <option value="shipping">Versand</option>
              <option value="payment">Zahlung</option>
              <option value="returns">Rückgabe</option>
              <option value="product">Produkte</option>
              <option value="warranty">Garantie</option>
              <option value="support">Kundenservice</option>
            </select>
            <input
              value={newFaq.question}
              onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
              placeholder="Frage"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
            <textarea
              value={newFaq.answer}
              onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
              placeholder="Antwort"
              rows={3}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
            <button
              onClick={createFaq}
              disabled={isSaving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
            >
              FAQ hinzufügen
            </button>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            {faq.map((item) => (
              <div key={item.id} className="space-y-2 rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={item.category}
                    onChange={(e) => updateFaq(item.id, { category: e.target.value })}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-sm"
                  >
                    <option value="shipping">Versand</option>
                    <option value="payment">Zahlung</option>
                    <option value="returns">Rückgabe</option>
                    <option value="product">Produkte</option>
                    <option value="warranty">Garantie</option>
                    <option value="support">Kundenservice</option>
                  </select>
                  <input
                    value={item.question}
                    onChange={(e) =>
                      setFaq((prev) =>
                        prev.map((x) => (x.id === item.id ? { ...x, question: e.target.value } : x))
                      )
                    }
                    onBlur={(e) => updateFaq(item.id, { question: e.target.value })}
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={item.isActive}
                      onChange={(e) => updateFaq(item.id, { isActive: e.target.checked })}
                    />
                    Aktiv
                  </label>
                </div>
                <textarea
                  value={item.answer}
                  onChange={(e) =>
                    setFaq((prev) =>
                      prev.map((x) => (x.id === item.id ? { ...x, answer: e.target.value } : x))
                    )
                  }
                  onBlur={(e) => updateFaq(item.id, { answer: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Reihenfolge</span>
                    <input
                      type="number"
                      value={item.sortOrder}
                      onChange={(e) =>
                        setFaq((prev) =>
                          prev.map((x) =>
                            x.id === item.id ? { ...x, sortOrder: Number(e.target.value) } : x
                          )
                        )
                      }
                      onBlur={(e) => updateFaq(item.id, { sortOrder: Number(e.target.value) })}
                      className="w-24 rounded border border-slate-200 bg-slate-50 px-2 py-1 text-sm"
                    />
                  </div>
                  <button
                    onClick={() => deleteFaq(item.id)}
                    disabled={isSaving}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
                  >
                    Löschen
                  </button>
                </div>
              </div>
            ))}
            {faq.length === 0 && <div className="text-sm text-slate-600">Keine FAQ.</div>}
          </div>
        </Card>
      </div>
    </div>
  )
}
