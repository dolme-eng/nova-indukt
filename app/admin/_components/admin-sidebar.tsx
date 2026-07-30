'use client'

import { useState } from 'react'
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
  BookOpen
} from "lucide-react"
import { AdminNavLink } from "./admin-nav-link"

interface AdminSidebarProps {
  userName: string
  userRole: string
  userInitial: string
}

export function AdminSidebar({ userName: _userName, userRole: _userRole, userInitial: _userInitial }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <button
        type="button"
        aria-label="Menü öffnen"
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 text-nova-900 p-2 bg-white rounded-lg shadow-md hover:bg-nova-50 transition-colors"
      >
        <Menu size={24} />
      </button>

      <aside className={`w-64 bg-nova-900 border-r border-white/5 flex flex-col sticky top-0 h-screen shadow-2xl z-40 transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-black text-2xl tracking-tighter text-white font-heading">
            <span className="bg-nova-400 text-nova-900 px-2 py-0.5 rounded-lg shadow-lg shadow-nova-400/20">NI</span>
            NOVA
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-nova-300 hover:text-white p-1"
            aria-label="Menü schließen"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-8 -mt-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-nova-400 rounded-full" />
            <p className="text-[10px] text-nova-300/60 uppercase tracking-[0.2em] font-black">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto scrollbar-hide">
          <AdminNavLink href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => setMobileOpen(false)} />
          <AdminNavLink href="/admin/orders" icon={<ShoppingCart size={20} />} label="Bestellungen" onClick={() => setMobileOpen(false)} />
          <AdminNavLink href="/admin/products" icon={<Package size={20} />} label="Produkte" onClick={() => setMobileOpen(false)} />
          <AdminNavLink href="/admin/blog" icon={<BookOpen size={20} />} label="Blog / Magazin" onClick={() => setMobileOpen(false)} />
          <AdminNavLink href="/admin/customers" icon={<Users size={20} />} label="Kunden" onClick={() => setMobileOpen(false)} />
          
          <div className="pt-6 pb-2 px-3">
            <p className="text-[10px] font-black text-nova-300/40 uppercase tracking-[0.15em]">Marketing</p>
          </div>
          <AdminNavLink href="/admin/promotions" icon={<Tag size={20} />} label="Aktionen" onClick={() => setMobileOpen(false)} />
          <AdminNavLink href="/admin/reviews" icon={<MessageSquare size={20} />} label="Bewertungen" onClick={() => setMobileOpen(false)} />
          <AdminNavLink href="/admin/newsletter" icon={<Mail size={20} />} label="Newsletter" onClick={() => setMobileOpen(false)} />
          
          <div className="pt-6 pb-2 px-3">
            <p className="text-[10px] font-black text-nova-300/40 uppercase tracking-[0.15em]">System</p>
          </div>
          <AdminNavLink href="/admin/settings" icon={<Settings size={20} />} label="Konfiguration" onClick={() => setMobileOpen(false)} />
        </nav>

        <div className="p-4 border-t border-white/5">
          <form
            action={async () => {
              'use server'
              const { signOut } = await import('@/lib/auth')
              await signOut({ redirectTo: '/' })
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 text-nova-300/70 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
            >
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors">
                <LogOut size={18} />
              </div>
              <span className="font-bold text-sm">Abmelden</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
