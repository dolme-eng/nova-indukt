import React from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { 
  Bell,
  Search,
} from "lucide-react"
import { AdminSidebar } from "./_components/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/anmelden?redirect=/admin")
  }

  const userName = session.user.name || "Admin"
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-nova-50/50 flex selection:bg-nova-400/30">
      <AdminSidebar
        userName={userName}
        userRole="Super Administrator"
        userInitial={userInitial}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-nova-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-6">
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
                <p className="text-sm font-black text-nova-900 leading-none">{userName}</p>
                <p className="text-[10px] text-nova-400 mt-1 font-black uppercase tracking-wider">Super Administrator</p>
              </div>
              <div className="h-11 w-11 bg-nova-900 rounded-2xl flex items-center justify-center text-nova-400 font-black border-2 border-nova-100 shadow-lg group-hover:scale-105 transition-transform">
                {userInitial}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8 flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
