'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { motion } from 'framer-motion'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`py-4 ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        <motion.li
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center"
        >
          <Link 
            href="/" 
            className="flex items-center gap-1 text-gray-500 hover:text-[#4ECCA3] transition-colors"
            aria-label="Startseite"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Startseite</span>
          </Link>
        </motion.li>
        
        {items.map((item, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-2"
          >
            <ChevronRight className="w-4 h-4 text-gray-400" aria-hidden="true" />
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-[#4ECCA3] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span 
                className="text-gray-900 font-medium"
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </motion.li>
        ))}
      </ol>
    </nav>
  )
}
