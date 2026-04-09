'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Home, ArrowRight, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { products } from '@/lib/data/products'
import { formatPriceDe } from '@/lib/utils/vat'

export default function NotFound() {
  const bestsellers = products.slice(0, 4)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-24 pb-24 px-4 sm:px-6">
      {/* 404 Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto mb-20 relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#4ECCA3]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <h1 className="text-[150px] font-black text-gray-200/50 tracking-tighter mb-4 leading-none font-heading relative z-10">404</h1>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0C211E] mb-6 font-heading tracking-tight relative z-10">
          Hier brennt nichts an...
        </h2>
        <p className="text-gray-500 text-lg sm:text-xl mb-10 leading-relaxed relative z-10">
          Aber die gesuchte Seite oder das Produkt scheint verschwunden zu sein. 
          Vielleicht haben Sie sich vertippt oder der Artikel ist umgezogen.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <Link href="/suche" className="w-full sm:w-auto px-8 py-4 bg-white text-[#0C211E] border border-gray-200 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm flex items-center justify-center gap-2">
            <Search className="w-5 h-5" /> Zur Produktsuche
          </Link>
          <Link href="/" className="w-full sm:w-auto px-8 py-4 bg-[#0C211E] text-white font-bold rounded-2xl hover:bg-[#17423C] transition-colors shadow-xl shadow-[#0C211E]/20 flex items-center justify-center gap-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4ECCA3]/0 via-[#4ECCA3]/20 to-[#4ECCA3]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Home className="w-5 h-5" /> Zurück zur Startseite
          </Link>
        </div>
      </motion.div>

      {/* Retention: Bestsellers */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-7xl mx-auto border-t border-gray-200 pt-16"
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4ECCA3]/20 flex items-center justify-center text-[#0C211E]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#0C211E] tracking-tight font-heading">Entdecken Sie unsere Bestseller</h3>
          </div>
          <Link href="/produkte" className="hidden sm:flex text-[#0C211E] font-bold items-center gap-2 hover:text-[#4ECCA3] transition-colors">
            Gesamtes Sortiment <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {bestsellers.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (index * 0.1) }}
              className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-300 group flex flex-col h-full"
            >
              <Link href={`/produkt/${product.slug}`} className="block relative aspect-square bg-gray-50 overflow-hidden p-4 sm:p-6">
                <div className="absolute inset-0 bg-white" />
                <Image
                  src={product.images[0]}
                  alt={product.name.de}
                  fill
                  className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out mix-blend-multiply"
                />
              </Link>
              <div className="p-5 flex-1 flex flex-col bg-white">
                <h4 className="font-bold text-gray-900 text-[13px] sm:text-base mb-2 line-clamp-2 group-hover:text-[#4ECCA3] transition-colors leading-snug flex-1">
                  {product.name.de}
                </h4>
                <div className="mt-auto pt-3 sm:pt-4 relative border-t border-gray-50">
                  <div className="flex items-end gap-1.5 sm:gap-2 mb-1">
                    <span className="text-base sm:text-lg font-black text-emerald-600 tabular-nums whitespace-nowrap">{formatPriceDe(product.price)}</span>
                  </div>
                  <Link href={`/produkt/${product.slug}`} className="mt-3 w-full py-2.5 sm:py-3.5 bg-gray-50 border border-gray-200 text-gray-800 text-[13px] sm:text-sm font-bold rounded-[0.85rem] sm:rounded-xl group-hover:bg-[#0C211E] group-hover:text-white group-hover:border-[#0C211E] transition-all duration-300 flex items-center justify-center gap-2 shadow-sm">
                    <ArrowRight className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    <span className="hidden sm:inline">Produkt ansehen</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
