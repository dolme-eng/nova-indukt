'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { Truck, RotateCcw, Shield, Headphones } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

const TRUST_ITEMS = [
  { icon: Truck,       title: 'Kostenlose Lieferung', desc: 'Ab 500€' },
  { icon: RotateCcw,   title: '30 Tage Rückgabe',    desc: 'Kostenlos' },
  { icon: Shield,      title: '2 Jahre Garantie',     desc: 'Auf alles' },
  { icon: Headphones,  title: 'Premium Support',      desc: 'Mo-Fr' },
]

export const HomeTrustBar = memo(function HomeTrustBar() {
  return (
    <section className="relative z-20 -mt-6 max-w-7xl mx-auto px-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={containerVariants}
        className="bg-white/90 backdrop-blur-md border border-white/50 shadow-lg rounded-xl p-3 sm:p-4"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-gray-100">
          {TRUST_ITEMS.map(({ icon: Icon, title, desc }, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-center gap-3 px-2 first:pl-0"
            >
              <div className="w-8 h-8 rounded-lg bg-nova-50 flex items-center justify-center flex-shrink-0 text-nova-500 border border-nova-100">
                <Icon className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-gray-900 text-[11px] sm:text-xs truncate">{title}</h3>
                <p className="text-gray-500 text-[9px] sm:text-[10px] leading-none mt-1">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
})
