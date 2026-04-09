'use client'

import { Award, Globe, Leaf, Target, Heart, ShieldCheck, BadgeCheck, Star, Trophy, Medal, Recycle, Zap, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function AboutContent() {
  const values = [
    {
      icon: Award,
      title: 'Kompromisslose Qualität',
      description: 'Verwendung hochwertigster Materialien für maximale Lebensdauer.'
    },
    {
      icon: Leaf,
      title: 'Nachhaltigkeit',
      description: 'Ressourcenschonende Produktion und energieeffiziente Nutzung.'
    },
    {
      icon: Target,
      title: 'Stetige Innovation',
      description: 'Kontinuierliche Weiterentwicklung unserer Technologien.'
    }
  ]

  const stats = [
    { value: '2018', label: 'Gegründet' },
    { value: '50.000+', label: 'Zufriedene Kunden' },
    { value: '120+', label: 'Premium-Produkte' },
    { value: '15', label: 'Experten im Team' }
  ]

  const team = [
    {
      name: 'Max Mustermann',
      role: 'Geschäftsführer',
      description: 'Visionär mit 15 Jahren Erfahrung in der Küchengeräte-Industrie.',
      img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
      name: 'Anna Schmidt',
      role: 'Leitung Produktentwicklung',
      description: 'Sorgt für das perfekte Zusammenspiel von Design und Funktion.',
      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
      name: 'Thomas Weber',
      role: 'Leitung Kundenservice',
      description: 'Spezialist für reibungslose Abläufe und höchste Kundenzufriedenheit.',
      img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50/50 selection:bg-[#4ECCA3]/30">
      
      {/* Hero Section */}
      <section className="relative bg-[#0C211E] text-white pt-24 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#4ECCA3]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#17423C]/40 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#4ECCA3] text-sm font-bold tracking-widest uppercase mb-8"
            >
              <Zap className="w-4 h-4" /> Vision & Mission
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 font-heading leading-tight tracking-tight text-balance"
            >
              Über NOVA INDUKT
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-400 leading-relaxed font-medium max-w-3xl text-balance"
            >
              Wir kombinieren deutsche Ingenieurskunst mit modernem Design, um die Zukunft des Kochens zu gestalten. Effizient, sicher und kompromisslos in der Qualität.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Raised Stats Section */}
      <section className="relative z-20 -mt-16 sm:-mt-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100 p-8 sm:p-12 overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-[#4ECCA3]" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 relative z-10">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-4xl md:text-5xl font-black text-[#0C211E] mb-3 group-hover:text-[#4ECCA3] transition-colors font-heading tracking-tight">{stat.value}</div>
                  <p className="text-gray-500 text-sm md:text-base font-bold uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-[#0C211E] font-heading leading-tight">Unsere Geschichte</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-medium">
                <p>Gegründet aus der Leidenschaft für exzellentes Kochen und dem Anspruch auf höchste Effizienz, begann unsere Reise in einer kleinen Manufaktur in Berlin. Wir sahen, dass herkömmliche Kochfelder oft Energie verschwenden und nicht die Präzision bieten, die moderne Küchen erfordern.</p>
                <p>Heute ist NOVA INDUKT ein Synonym für Premium-Induktionszubehör. Wir entwickeln Produkte, die nicht nur hervorragend funktionieren, sondern auch ein Statement für Nachhaltigkeit und Design setzen.</p>
                <p>Unser Fokus liegt auf Langlebigkeit und Performance. Jedes unserer Produkte durchläuft strenge Qualitätskontrollen, bevor es unsere Manufaktur verlässt. Denn wir glauben daran, dass gute Werkzeuge das Fundament für großartige Ergebnisse sind.</p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square lg:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <Image 
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000" 
                alt="Nova Indukt Küche"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C211E]/80 via-transparent to-transparent flex items-end p-8 sm:p-12">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Gegründet in Berlin</h3>
                  <p className="text-white/80">Wo Tradition auf Moderne trifft.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#0C211E] mb-6 font-heading">Unsere Werte</h2>
            <p className="text-xl text-gray-500 font-medium">Was uns antreibt und woran wir kompromisslos festhalten.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50/50 rounded-[2.5rem] p-10 text-center border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-10 h-10 text-[#4ECCA3]" />
                </div>
                <h3 className="text-2xl font-bold text-[#0C211E] mb-4">{value.title}</h3>
                <p className="text-gray-500 text-base leading-relaxed font-medium">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#0C211E] mb-6 font-heading">Das Team hinter NOVA</h2>
            <p className="text-xl text-gray-500 font-medium">Lernen Sie die Menschen kennen, die NOVA jeden Tag ein Stück besser machen.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {team.map((member, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[2.5rem] p-8 text-center shadow-sm border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300 group"
              >
                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gray-50 group-hover:border-[#4ECCA3]/20 transition-colors">
                   <Image 
                     src={member.img}
                     alt={member.name}
                     fill
                     className="object-cover group-hover:scale-110 transition-transform duration-500"
                   />
                </div>
                <h3 className="text-xl font-bold text-[#0C211E] mb-1">{member.name}</h3>
                <p className="text-[#4ECCA3] font-bold text-sm uppercase tracking-wider mb-4">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="py-24 lg:py-32 bg-[#0C211E] text-center px-4">
        <div className="container mx-auto max-w-5xl">
          <Heart className="w-16 h-16 text-[#4ECCA3] mx-auto mb-8 animate-pulse" />
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-heading">Unser Kundenversprechen</h2>
          <p className="text-xl text-gray-400 leading-relaxed mb-16 max-w-3xl mx-auto font-medium">
            Ihre Zufriedenheit steht für uns an erster Stelle. Deshalb bieten wir Ihnen mehr als nur erstklassige Produkte.
          </p>
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 sm:p-12 inline-block shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              <div className="pt-4 sm:pt-0">
                <div className="text-5xl font-black text-[#4ECCA3] mb-2 font-heading">2 Jahre</div>
                <p className="font-bold text-white tracking-wider">Garantie auf alle Produkte</p>
              </div>
              <div className="pt-8 sm:pt-0">
                <div className="text-5xl font-black text-[#4ECCA3] mb-2 font-heading">30 Tage</div>
                <p className="font-bold text-white tracking-wider">Kostenlose Rückgabe</p>
              </div>
              <div className="pt-8 sm:pt-0">
                <div className="text-5xl font-black text-[#4ECCA3] mb-2 font-heading">Kostenlos</div>
                <p className="font-bold text-white tracking-wider">Versand ab 500 €</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Location block */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Certifications */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0C211E] mb-10 font-heading">Geprüfte Qualität</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-[2rem] p-8 text-center border border-gray-100 hover:bg-white hover:shadow-lg transition-all">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                    <Medal className="w-8 h-8 text-[#4ECCA3]" />
                  </div>
                  <p className="font-bold text-[#0C211E]">Made in Germany</p>
                </div>
                <div className="bg-gray-50 rounded-[2rem] p-8 text-center border border-gray-100 hover:bg-white hover:shadow-lg transition-all">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                    <Recycle className="w-8 h-8 text-[#4ECCA3]" />
                  </div>
                  <p className="font-bold text-[#0C211E]">Eco-Friendly</p>
                </div>
                <div className="bg-gray-50 rounded-[2rem] p-8 text-center border border-gray-100 hover:bg-white hover:shadow-lg transition-all">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-[#4ECCA3]" />
                  </div>
                  <p className="font-bold text-[#0C211E]">TÜV Geprüft</p>
                </div>
                <div className="bg-gray-50 rounded-[2rem] p-8 text-center border border-gray-100 hover:bg-white hover:shadow-lg transition-all">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                    <Star className="w-8 h-8 text-[#4ECCA3]" />
                  </div>
                  <p className="font-bold text-[#0C211E]">Trusted Shops</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0C211E] mb-10 font-heading">Unser Hauptsitz</h2>
              <div className="bg-[#0C211E] text-white rounded-[2rem] p-10 lg:p-12 shadow-2xl relative overflow-hidden h-full flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#4ECCA3]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                
                <h3 className="text-2xl font-bold text-[#4ECCA3] mb-6 relative z-10">NOVA INDUKT Zentrale</h3>
                <div className="space-y-4 text-gray-300 font-medium text-lg relative z-10">
                  <p className="text-white font-bold text-xl">NOVA INDUKT GmbH</p>
                  <p>Musterstraße 42<br/>10115 Berlin<br/>Deutschland</p>
                  <p className="pt-4 flex items-center gap-3"><span className="w-10 text-gray-500 text-sm uppercase">Tel</span> +49 (0) 30 123 456 789</p>
                  <p className="flex items-center gap-3"><span className="w-10 text-gray-500 text-sm uppercase">Mail</span> info@nova-indukt.de</p>
                </div>
                <div className="mt-10 pt-10 border-t border-white/10 relative z-10">
                  <h4 className="font-bold text-white mb-4 text-lg">Öffnungszeiten</h4>
                  <div className="text-gray-400 space-y-2 font-medium">
                    <p className="flex justify-between items-center max-w-[300px]"><span>Mo - Fr</span> <span className="text-white">09:00 - 18:00 Uhr</span></p>
                    <p className="flex justify-between items-center max-w-[300px]"><span>Samstag</span> <span className="text-white">10:00 - 14:00 Uhr</span></p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 lg:py-32 bg-gray-50/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#0C211E] to-[#17423C] rounded-[2.5rem] p-12 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#4ECCA3]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 font-heading relative z-10">Bereit für ein neues Kocherlebnis?</h2>
            <p className="text-lg sm:text-xl text-[#9FE1CD] mb-10 max-w-2xl mx-auto font-medium relative z-10">
              Entdecken Sie unser handverlesenes Sortiment an Premium-Induktionsgeschirr und meistern Sie jedes Gericht mit perfekter Temperaturkontrolle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link 
                href="/produkte"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#4ECCA3] text-[#0C211E] font-bold rounded-xl hover:bg-white hover:text-[#0C211E] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Zum Shop <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/technologie"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/20 text-white font-bold rounded-xl hover:border-white hover:bg-white/5 transition-all"
              >
                Mehr über unsere Technologie
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
