import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Bell, Search } from 'lucide-react'
import { AdminSidebar } from './_components/admin-sidebar'
import { MobileSearchToggle } from './_components/mobile-search-toggle'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/anmelden?redirect=/admin')
  }

  const userName = session.user.name || 'Admin'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <div className="flex min-h-screen bg-nova-50/50 selection:bg-nova-400/30">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-nova-100 bg-white/80 px-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-4">
            <MobileSearchToggle />
            <form action="/suche" method="GET" className="relative hidden lg:block">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-nova-400"
                size={18}
              />
              <input
                type="text"
                name="q"
                placeholder="Produkte suchen..."
                className="w-80 rounded-2xl border-none bg-nova-50 py-2.5 pl-12 pr-6 text-sm font-medium transition-all placeholder:text-nova-300 focus:ring-2 focus:ring-nova-400"
              />
            </form>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/admin/settings/logs"
              type="button"
              aria-label="Aktivitätsprotokoll"
              className="relative rounded-xl p-2.5 text-nova-600 transition-all hover:bg-nova-50"
            >
              <Bell size={20} />
            </Link>
            <div className="mx-2 h-8 w-px bg-nova-100"></div>
            <div className="group flex cursor-pointer items-center gap-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-black leading-none text-nova-900">{userName}</p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-nova-400">
                  {session.user.role === 'ADMIN' ? 'Administrator' : session.user.role}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-nova-100 bg-nova-900 font-black text-nova-400 shadow-lg transition-transform group-hover:scale-105">
                {userInitial}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8">{children}</div>
      </div>
    </div>
  )
}
