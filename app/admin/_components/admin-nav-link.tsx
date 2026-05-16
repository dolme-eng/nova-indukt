'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

interface AdminNavLinkProps {
  href: string
  icon: React.ReactNode
  label: string
}

export function AdminNavLink({ href, icon, label }: AdminNavLinkProps) {
  const pathname = usePathname()
  // Exact match for /admin dashboard, prefix match for sub-pages
  const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all group ${
        isActive
          ? 'bg-white/10 text-white'
          : 'text-nova-300/70 hover:text-white hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`transition-colors ${
            isActive ? 'text-nova-400' : 'text-nova-300/40 group-hover:text-nova-400'
          }`}
        >
          {icon}
        </span>
        <span className="font-bold text-sm tracking-wide">{label}</span>
      </div>
      <ChevronRight
        size={14}
        className={`transition-all ${
          isActive
            ? 'text-nova-400 translate-x-0.5'
            : 'text-nova-300/20 group-hover:text-nova-400 group-hover:translate-x-1'
        }`}
      />
    </Link>
  )
}
