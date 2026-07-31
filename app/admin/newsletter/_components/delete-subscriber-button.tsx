'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

export function DeleteSubscriberButton({ subscriberId }: { subscriberId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Diesen Abonnenten wirklich löschen?')) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/newsletter?id=${subscriberId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Fehler beim Löschen')
      toast.success('Abonnent gelöscht')
      router.refresh()
    } catch {
      toast.error('Fehler beim Löschen')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      title="Löschen"
    >
      <Trash2 size={18} />
    </button>
  )
}
