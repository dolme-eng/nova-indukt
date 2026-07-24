'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import type { Category } from '@/lib/data/products'

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

interface HomeCategoriesGridProps {
  categories: Category[]
}

export const HomeCategoriesGrid = memo(function HomeCategoriesGrid({ categories }: HomeCategoriesGridProps) {
  if (categories.length === 0) return null

  return (
    <section className="py-8 sm:py-14 bg-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-end justify-between mb-6 gap-3"
        >
          <div>
            <span className="text-nova-500 font-semibold tracking-wider text-sm uppercase mb-2 block">
              Unsere Kategorien
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-heading">Beliebte Kategorien</h2>
          </div>
          <Link
            href="/produkte"
            className="group text-gray-600 hover:text-nova-500 font-medium flex items-center gap-2 transition-colors pb-1 border-b-2 border-transparent hover:border-nova-500"
          >
            Alle ansehen
            <span className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-nova-50 transition-colors">
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group h-full"
            >
              <Link href={`/produkte?kategorie=${category.slug}`} className="block h-full cursor-pointer">
                <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-500 border border-gray-100">
                  <Image
                    src={category.image}
                    alt={category.name.de}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{category.name.de}</h3>
                    <div className="flex items-center text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                      Entdecken <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
})
