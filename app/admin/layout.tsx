import React from "react"
import Link from "next/link"
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
  ChevronRight,
  Menu,
  Tag,
  Mail,
  Megaphone,
  BookOpen
} from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900">
            <span className="bg-primary text-white p-1 rounded">NI</span>
            NOVA INDUKT
          </Link>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <AdminNavLink href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <AdminNavLink href="/admin/orders" icon={<ShoppingCart size={20} />} label="Commandes" />
          <AdminNavLink href="/admin/products" icon={<Package size={20} />} label="Produits" />
          <AdminNavLink href="/admin/blog" icon={<BookOpen size={20} />} label="Blog / Magazin" />
          <AdminNavLink href="/admin/customers" icon={<Users size={20} />} label="Clients" />
          
          <div className="pt-4 pb-2 px-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Marketing</p>
          </div>
          <AdminNavLink href="/admin/promotions" icon={<Tag size={20} />} label="Promotions" />
          <AdminNavLink href="/admin/reviews" icon={<MessageSquare size={20} />} label="Avis" />
          <AdminNavLink href="/admin/newsletter" icon={<Mail size={20} />} label="Newsletter" />
          
          <div className="pt-4 pb-2 px-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Paramètres</p>
          </div>
          <AdminNavLink href="/admin/settings" icon={<Settings size={20} />} label="Configuration" />
        </nav>

        <div className="p-4 border-t border-slate-200">
          <Link 
            href="/api/auth/signout" 
            className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Déconnexion</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-bottom border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-600">
              <Menu size={24} />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-primary w-64 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 leading-none">Admin</p>
                <p className="text-xs text-slate-500 mt-1">Administrateur</p>
              </div>
              <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm">
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

function AdminNavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link 
      href={href}
      className="flex items-center justify-between px-3 py-2 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-all group"
    >
      <div className="flex items-center gap-3">
        <span className="text-slate-400 group-hover:text-primary transition-colors">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
    </Link>
  )
}
