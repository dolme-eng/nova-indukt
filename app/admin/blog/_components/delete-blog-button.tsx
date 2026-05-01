'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface DeleteBlogButtonProps {
  postId: string
  postTitle: string
}

export function DeleteBlogButton({ postId, postTitle }: DeleteBlogButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true)
      // Reset confirmation state after 3s if no action
      setTimeout(() => setConfirming(false), 3000)
      return
    }

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/blog/${postId}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Fehler beim Löschen')
        toast.success(`Artikel "${postTitle}" wurde gelöscht.`)
        router.refresh()
      } catch {
        toast.error('Der Artikel konnte nicht gelöscht werden.')
      } finally {
        setConfirming(false)
      }
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      title={confirming ? 'Klicken Sie erneut zum Bestätigen' : 'Supprimer'}
      className={`p-2 rounded-lg transition-all disabled:opacity-50 ${
        confirming
          ? 'bg-red-600 text-white scale-105'
          : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
      }`}
    >
      {isPending ? (
        <span className="w-[18px] h-[18px] block border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <Trash2 size={18} />
      )}
    </button>
  )
}
