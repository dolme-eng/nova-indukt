import React from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Menu,
  Tag,
  Mail,
  BookOpen
} from "lucide-react"
import { AdminNavLink } from "./_components/admin-nav-link"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/anmelden?redirect=/admin")
  }

  return (
    <div className="min-h-screen bg-nova-50/50 flex selection:bg-nova-400/30">
      {/* Sidebar */}
      <aside className="w-64 bg-nova-900 border-r border-white/5 hidden md:flex flex-col sticky top-0 h-screen shadow-2xl z-20">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 font-black text-2xl tracking-tighter text-white font-heading">
            <span className="bg-nova-400 text-nova-900 px-2 py-0.5 rounded-lg shadow-lg shadow-nova-400/20">NI</span>
            NOVA
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-1 w-8 bg-nova-400 rounded-full" />
            <p className="text-[10px] text-nova-300/60 uppercase tracking-[0.2em] font-black">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto scrollbar-hide">
          <AdminNavLink href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <AdminNavLink href="/admin/orders" icon={<ShoppingCart size={20} />} label="Bestellungen" />
          <AdminNavLink href="/admin/products" icon={<Package size={20} />} label="Produkte" />
          <AdminNavLink href="/admin/blog" icon={<BookOpen size={20} />} label="Blog / Magazin" />
          <AdminNavLink href="/admin/customers" icon={<Users size={20} />} label="Kunden" />
          
          <div className="pt-6 pb-2 px-3">
            <p className="text-[10px] font-black text-nova-300/40 uppercase tracking-[0.15em]">Marketing</p>
          </div>
          <AdminNavLink href="/admin/promotions" icon={<Tag size={20} />} label="Aktionen" />
          <AdminNavLink href="/admin/reviews" icon={<MessageSquare size={20} />} label="Bewertungen" />
          <AdminNavLink href="/admin/newsletter" icon={<Mail size={20} />} label="Newsletter" />
          
          <div className="pt-6 pb-2 px-3">
            <p className="text-[10px] font-black text-nova-300/40 uppercase tracking-[0.15em]">System</p>
          </div>
          <AdminNavLink href="/admin/settings" icon={<Settings size={20} />} label="Konfiguration" />
        </nav>

        <div className="p-4 border-t border-white/5">
          <form
            action={async () => {
              'use server'
              const { signOut } = await import('next-auth')
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-nova-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <button type="button" aria-label="Menü öffnen" className="md:hidden text-nova-900 p-2 hover:bg-nova-50 rounded-lg transition-colors">
              <Menu size={24} />
            </button>
            <div className="relative hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-nova-400" size={18} />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="pl-12 pr-6 py-2.5 bg-nova-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-nova-400 w-80 transition-all font-medium placeholder:text-nova-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button type="button" aria-label="Benachrichtigungen" className="relative p-2.5 text-nova-600 hover:bg-nova-50 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-nova-100 mx-2"></div>
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-nova-900 leading-none">Admin User</p>
                <p className="text-[10px] text-nova-400 mt-1 font-black uppercase tracking-wider">Super Administrator</p>
              </div>
              <div className="h-11 w-11 bg-nova-900 rounded-2xl flex items-center justify-center text-nova-400 font-black border-2 border-nova-100 shadow-lg group-hover:scale-105 transition-transform">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

