import { prisma } from "@/lib/prisma"
export const dynamic = 'force-dynamic'
import Link from "next/link"
import { Plus } from "lucide-react"
import { BlogTable } from './blog-table'

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog / Magazin</h1>
          <p className="text-slate-500">Verwalten Sie Ihre Magazinartikel</p>
        </div>
        <Link 
          href="/admin/blog/new" 
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
        >
          <Plus size={18} />
          Neuer Artikel
        </Link>
      </div>

      {/* Stats + Table */}
      <BlogTable posts={posts} />
    </div>
  )
}
