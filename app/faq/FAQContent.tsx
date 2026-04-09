'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronRight, ChevronDown, Search, HelpCircle,
  Package, Truck, RotateCcw, CreditCard, Shield, MessageCircle, ArrowLeft
} from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
  icon: typeof HelpCircle
  category: string
}

export function FAQContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState<string[]>(['shipping-1'])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [
    { id: 'shipping', label: 'Versand', icon: Truck },
    { id: 'payment', label: 'Zahlung', icon: CreditCard },
    { id: 'returns', label: 'Rückgabe', icon: RotateCcw },
    { id: 'product', label: 'Produkte', icon: Package },
    { id: 'warranty', label: 'Garantie', icon: Shield },
    { id: 'support', label: 'Support', icon: MessageCircle },
  ]

  const faqItems: FAQItem[] = [
    {
      id: 'shipping-1',
      question: 'Wie lange dauert der Versand?',
      answer: 'Die Lieferung erfolgt in der Regel innerhalb von 1-3 Werktagen per DHL oder DPD Express.',
      icon: Truck,
      category: 'shipping'
    },
    {
      id: 'payment-1',
      question: 'Welche Zahlungsmethoden werden akzeptiert?',
      answer: 'Wir akzeptieren Kreditkarten (Visa, Mastercard, Amex), PayPal, Klarna und Sofortüberweisung.',
      icon: CreditCard,
      category: 'payment'
    },
    {
      id: 'returns-1',
      question: 'Wie kann ich einen Artikel zurückgeben?',
      answer: 'Sie können Artikel innerhalb von 30 Tagen kostenlos an uns zurücksenden. Kontaktieren Sie hierfür einfach unseren Support.',
      icon: RotateCcw,
      category: 'returns'
    },
    {
      id: 'warranty-1',
      question: 'Wie lange ist die Garantiezeit?',
      answer: 'Wir gewähren auf alle unsere Nova Premium Produkte eine Garantie von 2 Jahren.',
      icon: Shield,
      category: 'warranty'
    },
    {
      id: 'product-1',
      question: 'Sind die Produkte für alle Induktionsherde geeignet?',
      answer: 'Ja, unsere Produkte sind speziell für die höchste Effizienz auf allen modernen Induktionskochfeldern optimiert.',
      icon: Package,
      category: 'product'
    },
    {
      id: 'support-1',
      question: 'Wie erreiche ich den Kundensupport?',
      answer: 'Sie erreichen uns per E-Mail unter support@nova-indukt.de oder über unser Kontaktformular.',
      icon: MessageCircle,
      category: 'support'
    }
  ]

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const filteredItems = faqItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === null || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Breadcrumbs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 text-sm">
            <Link href="/" className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors lg:hidden">
              <ArrowLeft className="w-4 h-4" />
              <span>Startseite</span>
            </Link>
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">Startseite</Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">FAQ</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-8">Häufig gestellte Fragen</h1>
          
          {/* Search */}
          <div className="relative mb-6 sm:mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Fragen durchsuchen..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 text-sm sm:text-base"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                selectedCategory === null 
                  ? 'bg-[#4ECCA3] text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Alle
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 sm:gap-2 ${
                  selectedCategory === cat.id 
                    ? 'bg-[#4ECCA3] text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <cat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{cat.label}</span>
                <span className="sm:hidden">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-3 sm:space-y-4">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden border border-gray-100"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 text-left"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#4ECCA3]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#4ECCA3]" />
                  </div>
                  <span className="flex-1 font-medium text-gray-900 text-sm sm:text-base pr-2">{item.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${openItems.includes(item.id) ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openItems.includes(item.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 pb-3 sm:pb-4 pl-14 sm:pl-20">
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Keine Ergebnisse gefunden</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
