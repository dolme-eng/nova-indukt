'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface DeleteProductButtonProps {
  productId: string
  productName: string
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
      return
    }

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Fehler beim Löschen')
        toast.success(`Produkt "${productName}" wurde gelöscht.`)
        router.refresh()
      } catch {
        toast.error('Das Produkt konnte nicht gelöscht werden.')
      } finally {
        setConfirming(false)
      }
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      title={confirming ? 'Klicken Sie erneut zum Bestätigen' : 'Löschen'}
      className={`rounded-lg p-2 transition-all disabled:opacity-50 ${
        confirming
          ? 'scale-105 bg-red-600 text-white'
          : 'text-slate-400 hover:bg-red-50 hover:text-red-600'
      }`}
    >
      {isPending ? (
        <span className="block h-[18px] w-[18px] animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Trash2 size={18} />
      )}
    </button>
  )
}
