'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  Search,
  HelpCircle,
  Package,
  Truck,
  RotateCcw,
  ShieldCheck,
  Shield,
  MessageCircle,
  ArrowLeft,
} from 'lucide-react'
import { COMPANY } from '@/lib/constants/company'

interface FAQItem {
  id: string
  question: string
  answer: string
  icon: typeof HelpCircle
  category: string
}

export function FAQContent(props: {
  items?: Array<{ id: string; question: string; answer: string; category: string }>
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [
    { id: 'shipping', label: 'Versand', icon: Truck },
    { id: 'payment', label: 'Zahlung', icon: ShieldCheck },
    { id: 'returns', label: 'Rückgabe', icon: RotateCcw },
    { id: 'product', label: 'Produkte', icon: Package },
    { id: 'warranty', label: 'Garantie', icon: Shield },
    { id: 'support', label: 'Kundenservice', icon: MessageCircle },
  ]

  const fallbackItems: FAQItem[] = [
    {
      id: 'shipping-1',
      question: 'Wie lange dauert der Versand?',
      answer:
        'Die Lieferung erfolgt in der Regel innerhalb von 1-3 Werktagen per DHL oder DPD Express.',
      icon: Truck,
      category: 'shipping',
    },
    {
      id: 'payment-1',
      question: 'Welche Zahlungsmethoden werden akzeptiert?',
      answer:
        'Wir akzeptieren ausschließlich Zahlung per Banküberweisung. Die Zahlungsinformationen erhalten Sie nach der Bestellung per E-Mail.',
      icon: ShieldCheck,
      category: 'payment',
    },
    {
      id: 'returns-1',
      question: 'Wie kann ich einen Artikel zurückgeben?',
      answer:
        'Sie können Artikel innerhalb von 30 Tagen kostenlos an uns zurücksenden. Kontaktieren Sie hierfür einfach unseren Kundenservice.',
      icon: RotateCcw,
      category: 'returns',
    },
    {
      id: 'warranty-1',
      question: 'Wie lange ist die Garantiezeit?',
      answer: 'Wir gewähren auf alle unsere Nova Premium Produkte eine Garantie von 2 Jahren.',
      icon: Shield,
      category: 'warranty',
    },
    {
      id: 'product-1',
      question: 'Sind die Produkte für alle Induktionsherde geeignet?',
      answer:
        'Ja, unsere Produkte sind speziell für die höchste Effizienz auf allen modernen Induktionskochfeldern optimiert.',
      icon: Package,
      category: 'product',
    },
    {
      id: 'support-1',
      question: 'Wie erreiche ich den Kundenservice?',
      answer: `Sie erreichen uns per E-Mail unter ${COMPANY.email.support} oder über unser Kontaktformular.`,
      icon: MessageCircle,
      category: 'support',
    },
  ]

  const iconByCategory: Record<string, typeof HelpCircle> = {
    shipping: Truck,
    payment: ShieldCheck,
    returns: RotateCcw,
    product: Package,
    warranty: Shield,
    support: MessageCircle,
  }

  const faqItems: FAQItem[] =
    props.items && props.items.length > 0
      ? props.items.map((i) => ({
          id: i.id,
          question: i.question,
          answer: i.answer,
          category: i.category || 'support',
          icon: iconByCategory[i.category] || HelpCircle,
        }))
      : fallbackItems

  const filteredItems = faqItems.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === null || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Breadcrumbs */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 text-sm">
            <Link
              href="/"
              className="flex items-center gap-1 text-gray-500 transition-colors hover:text-gray-900 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Startseite</span>
            </Link>
            <div className="hidden items-center gap-2 lg:flex">
              <Link href="/" className="text-gray-500 transition-colors hover:text-gray-900">
                Startseite
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-gray-900">FAQ</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-8 sm:text-3xl lg:text-4xl">
            Häufig gestellte Fragen
          </h1>

          {/* Search */}
          <div className="relative mb-6 sm:mb-8">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Fragen durchsuchen..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm focus:border-[#4ECCA3] focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20 sm:text-base"
            />
          </div>

          {/* Categories */}
          <div className="mb-6 flex flex-wrap gap-2 sm:mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                selectedCategory === null
                  ? 'bg-[#4ECCA3] text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Alle
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-colors sm:gap-2 sm:px-4 sm:text-sm ${
                  selectedCategory === cat.id
                    ? 'bg-[#4ECCA3] text-white'
                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <cat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* FAQ Items — native details/summary for SEO */}
          <div className="space-y-3 sm:space-y-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <details
                  className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all open:border-[#4ECCA3]/20 open:shadow-md sm:rounded-2xl"
                  open={index === 0}
                >
                  <summary className="flex cursor-pointer select-none list-none items-center gap-3 px-4 py-3 marker:hidden sm:gap-4 sm:px-6 sm:py-4 [&::-webkit-details-marker]:hidden">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#4ECCA3]/10 sm:h-10 sm:w-10">
                      <item.icon className="h-4 w-4 text-[#4ECCA3] sm:h-5 sm:w-5" />
                    </div>
                    <span className="flex-1 pr-2 text-sm font-medium text-gray-900 sm:text-base">
                      {item.question}
                    </span>
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-4 pb-3 pl-14 sm:px-6 sm:pb-4 sm:pl-20">
                    <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                      {item.answer}
                    </p>
                  </div>
                </details>
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 sm:h-16 sm:w-16">
                <HelpCircle className="h-7 w-7 text-gray-400 sm:h-8 sm:w-8" />
              </div>
              <p className="text-sm text-gray-600 sm:text-base">Keine Ergebnisse gefunden</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
