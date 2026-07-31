'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Edit, Eye, FileText, Calendar, CheckCircle2, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { DeleteBlogButton } from './_components/delete-blog-button'

interface BlogPost {
  id: string
  titleDe: string
  slug: string
  image: string | null
  category: string | null
  publishedAt: Date | null
  createdAt: Date
  isPublished: boolean
}

export function BlogTable({ posts }: { posts: BlogPost[] }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = searchQuery
    ? posts.filter((p) => p.titleDe.toLowerCase().includes(searchQuery.toLowerCase()))
    : posts

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
            Gesamtartikel
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{posts.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
            Veröffentlicht
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {posts.filter((p) => p.isPublished).length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wider text-slate-500">Entwürfe</p>
          <p className="mt-2 text-3xl font-bold text-amber-500">
            {posts.filter((p) => !p.isPublished).length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-200 p-4 sm:flex-row">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Artikel
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Kategorie
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Datum
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((post) => (
                <tr key={post.id} className="group transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {post.image ? (
                        <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.image}
                            alt={post.titleDe}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                          <FileText size={20} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="max-w-[300px] truncate font-bold text-slate-900">
                          {post.titleDe}
                        </p>
                        <p className="max-w-[300px] truncate text-xs text-slate-500">
                          /{post.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                      {post.category || 'Nicht kategorisiert'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar size={14} className="text-slate-400" />
                      {format(post.publishedAt || post.createdAt, 'dd. MMM yyyy', { locale: de })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {post.isPublished ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                        <CheckCircle2 size={12} />
                        Veröffentlicht
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                        <XCircle size={12} />
                        Entwurf
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-primary"
                        title="Artikel ansehen"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/admin/blog/edit/${post.id}`}
                        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                        title="Bearbeiten"
                      >
                        <Edit size={18} />
                      </Link>
                      <DeleteBlogButton postId={post.id} postTitle={post.titleDe} />
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Keine Artikel gefunden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
