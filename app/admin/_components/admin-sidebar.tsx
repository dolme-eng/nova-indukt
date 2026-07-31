'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Tag,
  Mail,
  BookOpen,
} from 'lucide-react'
import { AdminNavLink } from './admin-nav-link'

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const sidebarRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!mobileOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mobileOpen])

  useEffect(() => {
    if (mobileOpen) {
      const first = sidebarRef.current?.querySelector<HTMLElement>('a, button')
      first?.focus()
    }
  }, [mobileOpen])

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <button
        type="button"
        aria-label="Menü öffnen"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 text-nova-900 shadow-md transition-colors hover:bg-nova-50 md:hidden"
      >
        <Menu size={24} />
      </button>

      <aside
        ref={sidebarRef}
        className={`sticky top-0 z-40 flex h-screen w-64 flex-col border-r border-white/5 bg-nova-900 shadow-2xl transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-8">
          <Link
            href="/"
            className="flex items-center gap-3 font-heading text-2xl font-black tracking-tighter text-white"
          >
            <span className="rounded-lg bg-nova-400 px-2 py-0.5 text-nova-900 shadow-lg shadow-nova-400/20">
              NI
            </span>
            NOVA
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 text-nova-300 hover:text-white md:hidden"
            aria-label="Menü schließen"
          >
            <X size={20} />
          </button>
        </div>
        <div className="-mt-4 px-8">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 rounded-full bg-nova-400" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-nova-300/60">
              Admin Panel
            </p>
          </div>
        </div>

        <nav className="scrollbar-hide flex-1 space-y-1.5 overflow-y-auto px-4 py-4">
          <AdminNavLink
            href="/admin"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            onClick={() => setMobileOpen(false)}
          />
          <AdminNavLink
            href="/admin/orders"
            icon={<ShoppingCart size={20} />}
            label="Bestellungen"
            onClick={() => setMobileOpen(false)}
          />
          <AdminNavLink
            href="/admin/products"
            icon={<Package size={20} />}
            label="Produkte"
            onClick={() => setMobileOpen(false)}
          />
          <AdminNavLink
            href="/admin/blog"
            icon={<BookOpen size={20} />}
            label="Blog / Magazin"
            onClick={() => setMobileOpen(false)}
          />
          <AdminNavLink
            href="/admin/customers"
            icon={<Users size={20} />}
            label="Kunden"
            onClick={() => setMobileOpen(false)}
          />

          <div className="px-3 pb-2 pt-6">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-nova-300/40">
              Marketing
            </p>
          </div>
          <AdminNavLink
            href="/admin/promotions"
            icon={<Tag size={20} />}
            label="Aktionen"
            onClick={() => setMobileOpen(false)}
          />
          <AdminNavLink
            href="/admin/reviews"
            icon={<MessageSquare size={20} />}
            label="Bewertungen"
            onClick={() => setMobileOpen(false)}
          />
          <AdminNavLink
            href="/admin/newsletter"
            icon={<Mail size={20} />}
            label="Newsletter"
            onClick={() => setMobileOpen(false)}
          />
          <AdminNavLink
            href="/admin/contact"
            icon={<MessageSquare size={20} />}
            label="Kontakt"
            onClick={() => setMobileOpen(false)}
          />

          <div className="px-3 pb-2 pt-6">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-nova-300/40">
              System
            </p>
          </div>
          <AdminNavLink
            href="/admin/settings"
            icon={<Settings size={20} />}
            label="Konfiguration"
            onClick={() => setMobileOpen(false)}
          />
        </nav>

        <div className="border-t border-white/5 p-4">
          <form
            action={async () => {
              'use server'
              const { signOut } = await import('@/lib/auth')
              await signOut({ redirectTo: '/' })
            }}
          >
            <button
              type="submit"
              className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-nova-300/70 transition-all hover:bg-white/5 hover:text-white"
            >
              <div className="rounded-lg bg-white/5 p-2 transition-colors group-hover:bg-red-500 group-hover:text-white">
                <LogOut size={18} />
              </div>
              <span className="text-sm font-bold">Abmelden</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
