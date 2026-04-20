'use client'

import { motion } from 'framer-motion'
import { Sparkles, Zap, Leaf, Shield, ArrowRight, LucideIcon } from 'lucide-react'
import Link from 'next/link'

export function TechnologySection() {
  return (
    <section className="py-12 sm:py-20 bg-gray-900 border-t border-gray-800 relative overflow-hidden">
      {/* Abstract shapes */}
      <div className="absolute inset-0 bg-[url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E&quot;)] opacity-[0.04] mix-blend-overlay"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-nova-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20 max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-nova-400 text-sm font-semibold rounded-full mb-6 tracking-wide">
            <Sparkles className="w-4 h-4" />
            Unsere Technologie
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-heading leading-tight">
            Innovation trifft Handwerk
          </h2>
          <p className="text-gray-400 text-lg">
            Entdecke Technologien, die dein Kochen revolutionieren
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          <TechFeatureCard
            icon={Zap}
            title="SmartHeat™ Technologie"
            description="Präzise Temperaturkontrolle"
            color="bg-nova-400 text-nova-400 border-nova-400/20"
            index={0}
          />
          <TechFeatureCard
            icon={Leaf}
            title="EcoPower™ System"
            description="Energieeffizient"
            color="bg-success text-success border-success/20"
            index={1}
          />
          <TechFeatureCard
            icon={Shield}
            title="SafetyGuard™"
            description="Maximale Sicherheit"
            color="bg-destructive text-destructive border-destructive/20"
            index={2}
          />
        </div>
      </div>
    </section>
  )
}

function TechFeatureCard({ icon: Icon, title, description, color, index }: { 
  icon: LucideIcon; 
  title: string; 
  description: string; 
  color: string;
  index: number;
}) {
  return (
    <Link href="/technologie" className="block h-full group">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.15 }}
        className="bg-gray-800/50 backdrop-blur-md rounded-[2rem] p-8 border border-gray-700/50 hover:bg-gray-800 transition-colors h-full flex flex-col relative overflow-hidden"
      >
        <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl rounded-full ${color.split(' ')[0]}`} />
        
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gray-900 border ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed flex-1">{description}</p>
        
        <div className="mt-8 pt-6 border-t border-gray-700/50 flex items-center text-white/70 font-medium text-sm group-hover:text-white transition-colors">
          Technologie ansehen <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.div>
    </Link>
  )
}
