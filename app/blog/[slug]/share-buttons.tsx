'use client'

import { Facebook, Twitter, Linkedin, Share2 } from 'lucide-react'

interface ShareButtonsProps {
  slug: string
  title: string
}

export function ShareButtons({ slug, title }: ShareButtonsProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nova-indukt.de'
  const url = `${siteUrl}/blog/${slug}`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // User cancelled or error — fallback to clipboard
        await navigator.clipboard.writeText(url)
      }
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  return (
    <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-200">
      <span className="text-sm text-gray-500">Teilen:</span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
      >
        <Facebook className="w-4 h-4" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 bg-sky-500 text-white rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors"
      >
        <Twitter className="w-4 h-4" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 bg-blue-700 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors"
      >
        <Linkedin className="w-4 h-4" />
      </a>
      <button
        onClick={handleShare}
        className="w-8 h-8 bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
      >
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  )
}
