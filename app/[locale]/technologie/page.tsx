'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { 
  Zap, Leaf, Shield, Gauge, Cpu, Thermometer, Wind, 
  Award, CheckCircle, ArrowRight, Sparkles, Battery
} from 'lucide-react'
import { Link } from '@/navigation'

interface TechnologieContentProps {
  // No props needed - only German locale
}

function TechnologieContent() {
  const t = useTranslations('tech')

  const features = [
    {
      icon: Zap,
      title: 'SmartHeat™ Technologie',
      description: 'Unsere patentierte SmartHeat™-Technologie erkennt automatisch die optimale Temperatur für jedes Gericht und passt die Leistung in Echtzeit an. Kein Anbrennen mehr, perfekte Ergebnisse garantiert.',
      stats: { value: '90%', label: 'Energieeffizienz' },
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Leaf,
      title: 'EcoPower System',
      description: 'Das EcoPower-System nutzt 100% der elektrischen Energie direkt für die Erwärmung des Kochgeschirrs. Im Vergleich zu Gasherden sparen Sie bis zu 50% Energie und reduzieren Ihren CO₂-Fußabdruck erheblich.',
      stats: { value: '-50%', label: 'CO₂-Emissionen' },
      color: 'from-[#4ECCA3] to-emerald-500'
    },
    {
      icon: Shield,
      title: 'SafetyGuard Pro',
      description: 'Unser SafetyGuard Pro-System bietet mehrere Schutzschichten: automatische Abschaltung bei Überhitzung, Kindersicherung, Überkochschutz und präzise Temperaturkontrolle für maximale Sicherheit.',
      stats: { value: '99.9%', label: 'Sicherheit' },
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Gauge,
      title: 'PrecisionControl',
      description: 'Mit PrecisionControl erreichen Sie eine Temperaturgenauigkeit von ±1°C. Ideal für sous-vide, Schokoladentemperierung und andere temperaturkritische Anwendungen.',
      stats: { value: '±1°C', label: 'Genauigkeit' },
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Cpu,
      title: 'IntelliCore Chip',
      description: 'Der IntelliCore-Prozessor steuert alle Funktionen Ihres Kochfelds mit unglaublicher Geschwindigkeit. 10.000 Messungen pro Sekunde garantieren perfekte Ergebnisse.',
      stats: { value: '10k', label: 'Messungen/Sek' },
      color: 'from-indigo-500 to-blue-600'
    },
    {
      icon: Thermometer,
      title: 'ThermoSync',
      description: 'ThermoSync-Koordinierung synchronisiert mehrere Kochzonen perfekt. Ideal für große Menüs oder wenn Sie mehrere Gerichte gleichzeitig zubereiten müssen.',
      stats: { value: '4x', label: 'Zonen' },
      color: 'from-red-500 to-rose-500'
    }
  ]

  const benefits = [
    { icon: Battery, text: 'Bis zu 70% schneller als herkömmliche Herde' },
    { icon: Wind, text: 'Keine Abwärme in der Küche' },
    { icon: CheckCircle, text: 'Präzise Temperaturkontrolle' },
    { icon: Sparkles, text: 'Einfache Reinigung' }
  ]

  const comparisons = [
    { feature: 'Energieeffizienz', induction: '90%', gas: '40%', electric: '65%' },
    { feature: 'Erhitzungszeit (1L Wasser)', induction: '2:30 min', gas: '8:00 min', electric: '7:30 min' },
    { feature: 'Temperaturgenauigkeit', induction: '±1°C', gas: '±10°C', electric: '±5°C' },
    { feature: 'Sicherheit', induction: 'Hoch', gas: 'Mittel', electric: 'Mittel' },
    { feature: 'Reinigung', induction: 'Einfach', gas: 'Aufwändig', electric: 'Mittel' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4ECCA3] via-transparent to-blue-600" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-2 bg-[#4ECCA3]/20 text-[#4ECCA3] text-sm font-semibold rounded-full mb-6">
              Innovation made in Germany
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              NOVA INDUKT
              <span className="block text-[#4ECCA3]">Technologie</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Entdecken Sie die Zukunft des Kochens. Unsere bahnbrechenden Technologien 
              machen Induktion schneller, sicherer und effizienter als je zuvor.
            </p>
            <Link 
              href="/produkte"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#4ECCA3] text-white font-semibold rounded-xl hover:bg-[#3BA88A] transition-colors"
            >
              Produkte entdecken <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Unsere Kerntechnologien</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Jede unserer Technologien wurde entwickelt, um Ihr Kocherlebnis zu revolutionieren.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">{feature.description}</p>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#4ECCA3]">{feature.stats.value}</span>
                    <span className="text-sm text-gray-500">{feature.stats.label}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">
                  Warum Induktion die <span className="text-[#4ECCA3]">bessere Wahl</span> ist
                </h2>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Induktion ist nicht nur eine Alternative zu Gas und Elektro - es ist die 
                  überlegene Technologie für die moderne Küche. Schneller, sicherer, effizienter.
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-12 h-12 bg-[#4ECCA3]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-6 h-6 text-[#4ECCA3]" />
                      </div>
                      <span className="text-lg">{benefit.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-8"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#4ECCA3]/10 to-blue-500/10" />
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
                  <Zap className="w-20 h-20 text-[#4ECCA3] mb-6" />
                  <div className="text-5xl font-bold mb-2">90%</div>
                  <p className="text-xl text-gray-300">Energieeffizienz</p>
                  <p className="text-sm text-gray-500 mt-4">vs. nur 40% bei Gasherden</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Der direkte Vergleich</h2>
            
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Eigenschaft</th>
                      <th className="px-6 py-4 text-center font-semibold text-[#4ECCA3]">Induktion</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-600">Gas</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-600">Elektro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {comparisons.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 text-gray-700">{row.feature}</td>
                        <td className="px-6 py-4 text-center font-semibold text-[#4ECCA3]">{row.induction}</td>
                        <td className="px-6 py-4 text-center text-gray-600">{row.gas}</td>
                        <td className="px-6 py-4 text-center text-gray-600">{row.electric}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Awards / Trust */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Ausgezeichnete Qualität</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Award, label: 'Red Dot Design 2024' },
                { icon: CheckCircle, label: 'TÜV Zertifiziert' },
                { icon: Sparkles, label: 'Eco Certified' },
                { icon: Shield, label: '5 Jahre Garantie' }
              ].map((award, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <award.icon className="w-8 h-8 text-[#4ECCA3] mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-700">{award.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Bereit für die Zukunft des Kochens?</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Entdecken Sie unsere Induktionsprodukte mit fortschrittlicher NOVA-Technologie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/produkte"
                className="px-8 py-4 bg-[#4ECCA3] text-white font-semibold rounded-xl hover:bg-[#3BA88A] transition-colors"
              >
                Produkte ansehen
              </Link>
              <Link 
                href="/kontakt"
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:border-[#4ECCA3] hover:text-[#4ECCA3] transition-colors"
              >
                Beratung anfragen
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default function TechnologiePage() {
  return <TechnologieContent />
}
