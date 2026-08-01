'use client'

import { motion } from 'framer-motion'
import {
  Zap,
  Leaf,
  Shield,
  Gauge,
  Cpu,
  Thermometer,
  Wind,
  Award,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Battery,
} from 'lucide-react'
import Link from 'next/link'

export default function TechnologieContent() {
  const features = [
    {
      icon: Zap,
      title: 'SmartHeat™ Technologie',
      description:
        'Unsere patentierte SmartHeat™-Technologie erkennt automatisch die optimale Temperatur für jedes Gericht und passt die Leistung in Echtzeit an. Kein Anbrennen mehr, perfekte Ergebnisse garantiert.',
      stats: { value: '90%', label: 'Energieeffizienz' },
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Leaf,
      title: 'EcoPower System',
      description:
        'Das EcoPower-System nutzt 100% der elektrischen Energie direkt für die Erwärmung des Kochgeschirrs. Im Vergleich zu Gasherden sparen Sie bis zu 50% Energie und reduzieren Ihren CO₂-Fußabdruck erheblich.',
      stats: { value: '-50%', label: 'CO₂-Emissionen' },
      color: 'from-[#4ECCA3] to-emerald-500',
    },
    {
      icon: Shield,
      title: 'SafetyGuard Pro',
      description:
        'Unser SafetyGuard Pro-System bietet mehrere Schutzschichten: automatische Abschaltung bei Überhitzung, Kindersicherung, Überkochschutz und präzise Temperaturkontrolle für maximale Sicherheit.',
      stats: { value: '99.9%', label: 'Sicherheit' },
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Gauge,
      title: 'PrecisionControl',
      description:
        'Mit PrecisionControl erreichen Sie eine Temperaturgenauigkeit von ±1°C. Ideal für sous-vide, Schokoladentemperierung und andere temperaturkritische Anwendungen.',
      stats: { value: '±1°C', label: 'Genauigkeit' },
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Cpu,
      title: 'IntelliCore Chip',
      description:
        'Der IntelliCore-Prozessor steuert alle Funktionen Ihres Kochfelds mit unglaublicher Geschwindigkeit. 10.000 Messungen pro Sekunde garantieren perfekte Ergebnisse.',
      stats: { value: '10k', label: 'Messungen/Sek' },
      color: 'from-indigo-500 to-blue-600',
    },
    {
      icon: Thermometer,
      title: 'ThermoSync',
      description:
        'ThermoSync-Koordinierung synchronisiert mehrere Kochzonen perfekt. Ideal für große Menüs oder wenn Sie mehrere Gerichte gleichzeitig zubereiten müssen.',
      stats: { value: '4x', label: 'Zonen' },
      color: 'from-red-500 to-rose-500',
    },
  ]

  const benefits = [
    { icon: Battery, text: 'Bis zu 70% schneller als herkömmliche Herde' },
    { icon: Wind, text: 'Keine Abwärme in der Küche' },
    { icon: CheckCircle, text: 'Präzise Temperaturkontrolle' },
    { icon: Sparkles, text: 'Einfache Reinigung' },
  ]

  const comparisons = [
    { feature: 'Energieeffizienz', induction: '90%', gas: '40%', electric: '65%' },
    {
      feature: 'Erhitzungszeit (1L Wasser)',
      induction: '2:30 min',
      gas: '8:00 min',
      electric: '7:30 min',
    },
    { feature: 'Temperaturgenauigkeit', induction: '±1°C', gas: '±10°C', electric: '±5°C' },
    { feature: 'Sicherheit', induction: 'Hoch', gas: 'Mittel', electric: 'Mittel' },
    { feature: 'Reinigung', induction: 'Einfach', gas: 'Aufwändig', electric: 'Mittel' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-900 py-12 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-nova-400 via-transparent to-blue-500" />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="mb-4 inline-block rounded-md border border-nova-500/20 bg-nova-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-nova-400">
              Innovation made in Germany
            </span>
            <h1 className="mb-3 text-xl font-black uppercase tracking-tight md:text-2xl">
              NOVA INDUKT
              <span className="block text-nova-400">Technologie</span>
            </h1>
            <p className="mx-auto mb-6 max-w-lg text-xs font-medium leading-relaxed text-gray-400 sm:text-sm">
              Entdecken Sie die Zukunft des Kochens. Unsere bahnbrechenden Technologien machen
              Induktion schneller, sicherer und effizienter als je zuvor.
            </p>
            <Link
              href="/produkte"
              className="inline-flex items-center gap-2 rounded-lg bg-nova-500 px-6 py-3 text-xs font-black text-white shadow-lg transition-all hover:bg-nova-600 active:scale-95"
            >
              Produkte entdecken <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="mb-2 text-lg font-black uppercase tracking-tight text-gray-900 sm:text-xl">
              Kerntechnologien
            </h2>
            <p className="mx-auto max-w-xl text-xs font-medium text-gray-400">
              Jede unserer Technologien wurde entwickelt, um Ihr Kocherlebnis zu revolutionieren.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-all hover:border-nova-200 sm:p-6"
              >
                <div
                  className={`h-10 w-10 rounded-lg bg-gradient-to-br ${feature.color} mb-4 flex items-center justify-center shadow-lg shadow-gray-200`}
                >
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-2 text-xs font-black uppercase tracking-tight text-gray-900 transition-colors group-hover:text-nova-600 sm:text-sm">
                  {feature.title}
                </h3>
                <p className="mb-4 line-clamp-3 text-[10px] font-medium leading-relaxed text-gray-500 sm:text-[11px]">
                  {feature.description}
                </p>
                <div className="border-t border-gray-200/50 pt-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black tabular-nums text-nova-900">
                      {feature.stats.value}
                    </span>
                    <span className="text-[9px] font-bold uppercase text-gray-400">
                      {feature.stats.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-900 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="mb-6 text-3xl font-bold">
                  Warum Induktion die <span className="text-[#4ECCA3]">bessere Wahl</span> ist
                </h2>
                <p className="mb-8 leading-relaxed text-gray-300">
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
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#4ECCA3]/20">
                        <benefit.icon className="h-6 w-6 text-[#4ECCA3]" />
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
                className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#4ECCA3]/10 to-blue-500/10" />
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                  <Zap className="mb-6 h-20 w-20 text-[#4ECCA3]" />
                  <div className="mb-2 text-5xl font-bold">90%</div>
                  <p className="text-xl text-gray-300">Energieeffizienz</p>
                  <p className="mt-4 text-sm text-gray-500">vs. nur 40% bei Gasherden</p>
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
            className="mx-auto max-w-4xl"
          >
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              Der direkte Vergleich
            </h2>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">
                        Eigenschaft
                      </th>
                      <th className="px-6 py-4 text-center font-semibold text-[#4ECCA3]">
                        Induktion
                      </th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-600">Gas</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-600">Elektro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {comparisons.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 text-gray-700">{row.feature}</td>
                        <td className="px-6 py-4 text-center font-semibold text-[#4ECCA3]">
                          {row.induction}
                        </td>
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
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">Ausgezeichnete Qualität</h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                { icon: Award, label: 'Red Dot Design 2024' },
                { icon: CheckCircle, label: 'TÜV Zertifiziert' },
                { icon: Sparkles, label: 'Eco Certified' },
                { icon: Shield, label: '2 Jahre Garantie' },
              ].map((award, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl bg-white p-6 shadow-sm"
                >
                  <award.icon className="mx-auto mb-3 h-8 w-8 text-[#4ECCA3]" />
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
            className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-12 text-center text-white"
          >
            <h2 className="mb-4 text-3xl font-bold">Bereit für die Zukunft des Kochens?</h2>
            <p className="mx-auto mb-8 max-w-xl text-gray-300">
              Entdecken Sie unsere Induktionsprodukte mit fortschrittlicher NOVA-Technologie.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/produkte"
                className="rounded-xl bg-[#0C211E] px-8 py-4 font-semibold text-white transition-colors hover:bg-[#17423C]"
              >
                Produkte ansehen
              </Link>
              <Link
                href="/kontakt"
                className="rounded-xl border-2 border-white/30 px-8 py-4 font-semibold text-white transition-colors hover:border-[#4ECCA3] hover:text-[#4ECCA3]"
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
