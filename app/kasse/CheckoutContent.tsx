'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useDeTranslations } from '@/lib/i18n/useDeTranslations'
import { 
  ChevronRight, Check, CreditCard, Truck, 
  AlertCircle, Lock, ArrowLeft, ChevronDown,
  Package, Shield, MapPin, CheckCircle
} from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useAuth } from '@/lib/store/auth'
import Link from 'next/link'
import { formatPriceDe } from '@/lib/utils/vat'

const SHIPPING_COST = 9.99
const FREE_SHIPPING_THRESHOLD = 500

export default function CheckoutContent() {
  const router = useRouter()
  // const t = useDeTranslations('checkout')
  // const tc = useDeTranslations('cart')
  const { items, totalPrice, clearCart, isHydrated } = useCart()
  const { user, isAuthenticated } = useAuth()
  const mounted = useRef(false)

  // Hardcoded safe translations for checkout
  const t = (key: string, vars?: any) => {
    const dict: Record<string, string> = {
      'title': 'Kasse',
      'backToCart': 'Zurück zum Warenkorb',
      'nav.home': 'Startseite',
      'cart.title': 'Warenkorb',
      'emptyCart': 'Warenkorb ist leer',
      'emptyCartMessage': 'Bitte füge Artikel hinzu, um fortzufahren.',
      'backToProducts': 'Zu den Produkten',
      'step1': 'Versand',
      'step2': 'Zahlung',
      'step3': 'Bestätigung',
      'shipping.title': 'Versandadresse',
      'shipping.firstName': 'Vorname',
      'shipping.lastName': 'Nachname',
      'shipping.email': 'E-Mail',
      'shipping.phone': 'Telefon (optional)',
      'shipping.address': 'Straße und Hausnummer',
      'shipping.zipCode': 'PLZ',
      'shipping.city': 'Stadt',
      'shipping.country': 'Land',
      'shipping.continue': 'Weiter zur Zahlung',
      'payment.title': 'Zahlungsmethode',
      'payment.card': 'Kreditkarte',
      'payment.cardName': 'Name auf der Karte',
      'payment.cardNumber': 'Kartennummer',
      'payment.expiry': 'Gültig bis',
      'payment.cvc': 'CVC',
      'payment.paypal': 'PayPal',
      'payment.sofort': 'Sofortüberweisung',
      'payment.secure': 'Ihre Zahlungsdaten werden sicher verschlüsselt.',
      'payment.back': 'Zurück zum Versand',
      'payment.pay': 'Zahlungspflichtig bestellen',
      'payment.processing': 'Verarbeite Zahlung...',
      'summary.title': 'Bestellübersicht',
      'summary.orderNumber': 'Bestellnummer',
      'success.title': 'Vielen Dank für Ihre Bestellung!',
      'success.subtitle': 'Wir haben eine Bestätigung an Ihre E-Mail gesendet.',
      'success.backProducts': 'Weiter Einkaufen',
      'success.backHome': 'Zur Startseite',
      'item': 'Artikel',
      'items': 'Artikel'
    }
    return dict[key] || key
  }

  const tc = (key: string, vars?: any) => {
    const dict: Record<string, string> = {
      'subtotal': 'Zwischensumme',
      'shipping': 'Versand',
      'freeShipping': 'Kostenlos',
      'total': 'Gesamtsumme',
      'vat': 'Inkl. 19% MwSt.',
      'securePayment': 'Sichere Bezahlung',
      'deliveryTime': 'Lieferung: 1-3 Werktage'
    }
    return dict[key] || key
  }

  useEffect(() => {
    mounted.current = true
    if (mounted.current && !isAuthenticated) router.push('/anmelden?redirect=/kasse')
  }, [isAuthenticated, router])

  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [showMobileSummary, setShowMobileSummary] = useState(false)
  
  const [shippingData, setShippingData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    zipCode: '',
    city: '',
    country: 'Deutschland'
  })
  
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  })
  
  if (!isHydrated) return null // Hide until cart hydrated to prevent flashing

  const subtotal = totalPrice
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shipping
  
  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="flex items-center gap-2 py-4 text-xs sm:text-sm font-medium">
              <Link href="/warenkorb" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>{t('backToCart')}</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transform -rotate-3">
              <AlertCircle className="w-12 h-12 text-gray-300" />
            </div>
            <h1 className="text-3xl font-bold text-[#0C211E] mb-4 font-heading">{t('emptyCart')}</h1>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">{t('emptyCartMessage')}</p>
            <Link 
              href="/produkte"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#0C211E] text-white font-bold rounded-2xl hover:bg-[#17423C] transition-all shadow-xl shadow-[#0C211E]/20 hover:-translate-y-1"
            >
              <Package className="w-5 h-5" />
              {t('backToProducts')}
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate payment process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    setOrderComplete(true)
    clearCart()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const steps = [
    { id: 1, label: t('step1'), icon: Truck },
    { id: 2, label: t('step2'), icon: CreditCard },
    { id: 3, label: t('step3'), icon: Check }
  ]
  
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-20 selection:bg-[#4ECCA3]/30">
        <div className="container mx-auto px-4 py-12 sm:py-20 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100 p-8 sm:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-[#4ECCA3]" />
            
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border-[6px] border-white shadow-lg shadow-green-100">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0C211E] mb-4 font-heading">{t('success.title')}</h1>
            <p className="text-gray-500 mb-8 text-lg">{t('success.subtitle')}</p>
            
            <div className="bg-gray-50/80 rounded-[2rem] p-6 sm:p-8 mb-10 text-left border border-gray-100">
              <div className="flex items-center justify-between border-b border-gray-200/60 pb-4 mb-4">
                <span className="text-gray-500 font-medium">{t('summary.orderNumber')}</span>
                <span className="font-mono font-bold text-[#0C211E] bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">
                  NOV-{Date.now().toString(36).toUpperCase()}
                </span>
              </div>
              
              <h3 className="font-bold text-[#0C211E] mb-5 text-xl">{t('summary.title')}</h3>
              
              <div className="space-y-4 text-[15px]">
                <div className="flex justify-between items-center text-gray-600">
                  <span>{tc('total')}</span>
                  <span className="font-bold text-[#0C211E] text-lg sm:text-xl tabular-nums whitespace-nowrap">{formatPriceDe(total)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span>{t('payment.title')}</span>
                  <div className="flex items-center gap-2 font-medium">
                    <CreditCard className="w-4 h-4"/>
                    {paymentMethod === 'card' ? t('payment.card') : paymentMethod === 'paypal' ? 'PayPal' : 'Sofort'}
                  </div>
                </div>
                <div className="flex items-start justify-between text-gray-500 pt-2 border-t border-gray-200/60">
                  <span>{t('shipping.title')}</span>
                  <span className="text-right text-sm font-medium max-w-[200px] leading-relaxed">
                    {shippingData.firstName} {shippingData.lastName}<br/>
                    {shippingData.address}<br/>
                    {shippingData.zipCode} {shippingData.city}<br/>
                    {shippingData.country}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/produkte"
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0C211E] text-white font-bold rounded-2xl hover:bg-[#17423C] transition-colors shadow-lg shadow-[#0C211E]/20"
              >
                <Package className="w-5 h-5" />
                {t('success.backProducts')}
              </Link>
              <Link 
                href="/"
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-50 border border-gray-200 text-[#0C211E] font-bold rounded-2xl hover:bg-gray-100 transition-colors"
              >
                {t('success.backHome')}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-32 lg:pb-16 selection:bg-[#4ECCA3]/30">
      
      {/* Navbar Minimalist for Checkout */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium tracking-wide">
              <Link href="/warenkorb" className="flex items-center gap-1.5 text-gray-500 hover:text-[#0C211E] transition-colors bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:block">{t('backToCart')}</span>
              </Link>
            </div>
            <div className="flex items-center gap-2 text-[#0C211E] font-black font-heading tracking-wider">
               NOVA <span className="font-light text-gray-400">|</span> KASSE
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
               <Lock className="w-4 h-4 text-[#4ECCA3]"/> <span className="hidden sm:block">SSL-Sicher</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        
        {/* Progress Tracker */}
        <div className="mb-10 lg:mb-14">
          <div className="flex items-center justify-center max-w-3xl mx-auto">
            {steps.map((s, index) => {
              const Icon = s.icon
              const isActive = step === s.id
              const isCompleted = step > s.id
              
              return (
                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center relative z-10">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-300 shadow-sm ${
                      isActive ? 'bg-[#0C211E] text-white scale-110 shadow-xl shadow-[#0C211E]/20' : 
                      isCompleted ? 'bg-[#4ECCA3] text-[#0C211E] shadow-lg shadow-[#4ECCA3]/20' : 'bg-white text-gray-400 border border-gray-100'
                    }`}>
                      {isCompleted ? <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" /> : <Icon className="w-5 h-5 sm:w-6 sm:h-6" />}
                    </div>
                    <span className={`text-xs sm:text-sm mt-3 font-bold transition-colors absolute top-full whitespace-nowrap pt-1 ${isActive ? 'text-[#0C211E]' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1.5 mx-2 rounded-full transition-colors duration-500 ${isCompleted ? 'bg-[#4ECCA3]' : 'bg-gray-200'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mt-16 sm:mt-20">
          
          {/* Main Forms */}
          <div className="lg:col-span-7 xl:col-span-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-10"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-[#0C211E] rounded-xl flex items-center justify-center shadow-lg shadow-[#0C211E]/10">
                      <MapPin className="w-6 h-6 text-[#4ECCA3]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#0C211E] font-heading">{t('shipping.title')}</h2>
                  </div>
                  
                  <form onSubmit={handleShippingSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 ml-1">{t('shipping.firstName')} *</label>
                        <input
                          type="text" required value={shippingData.firstName}
                          onChange={(e) => setShippingData({...shippingData, firstName: e.target.value})}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none transition-all font-medium text-[#0C211E]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 ml-1">{t('shipping.lastName')} *</label>
                        <input
                          type="text" required value={shippingData.lastName}
                          onChange={(e) => setShippingData({...shippingData, lastName: e.target.value})}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none transition-all font-medium text-[#0C211E]"
                        />
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 ml-1">{t('shipping.email')} *</label>
                        <input
                          type="email" required value={shippingData.email}
                          onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none transition-all font-medium text-[#0C211E]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 ml-1">{t('shipping.phone')}</label>
                        <input
                          type="tel" value={shippingData.phone}
                          onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none transition-all font-medium text-[#0C211E]"
                          placeholder="+49 "
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-gray-700 ml-1">{t('shipping.address')} *</label>
                      <input
                        type="text" required value={shippingData.address}
                        onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                        className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none transition-all font-medium text-[#0C211E]"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-5">
                      <div className="col-span-1 space-y-1">
                        <label className="text-sm font-bold text-gray-700 ml-1">{t('shipping.zipCode')} *</label>
                        <input
                          type="text" required value={shippingData.zipCode}
                          onChange={(e) => setShippingData({...shippingData, zipCode: e.target.value})}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none transition-all font-medium text-[#0C211E]"
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-sm font-bold text-gray-700 ml-1">{t('shipping.city')} *</label>
                        <input
                          type="text" required value={shippingData.city}
                          onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none transition-all font-medium text-[#0C211E]"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-gray-700 ml-1">{t('shipping.country')} *</label>
                      <div className="relative">
                        <select
                          value={shippingData.country}
                          onChange={(e) => setShippingData({...shippingData, country: e.target.value})}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none transition-all font-bold text-[#0C211E] appearance-none"
                        >
                          <option value="Deutschland">Deutschland</option>
                          <option value="Österreich">Österreich</option>
                          <option value="Schweiz">Schweiz</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0C211E] pointer-events-none" />
                      </div>
                    </div>
                    
                    <div className="pt-6">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        className="w-full py-4 bg-[#0C211E] text-white font-bold rounded-2xl hover:bg-[#17423C] transition-colors flex items-center justify-center gap-3 text-lg shadow-xl shadow-[#0C211E]/20"
                      >
                        {t('shipping.continue')} <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}
              
              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-10"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-[#0C211E] rounded-xl flex items-center justify-center shadow-lg shadow-[#0C211E]/10">
                      <CreditCard className="w-6 h-6 text-[#4ECCA3]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#0C211E] font-heading">{t('payment.title')}</h2>
                  </div>
                  
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <div className="space-y-3">
                      
                      {/* Payment Method Cards */}
                      {[
                        { id: 'card', icon: CreditCard, title: t('payment.card'), desc: 'Visa, Mastercard, Amex' },
                        { id: 'paypal', icon: Shield, title: t('payment.paypal'), desc: 'Sichere Zahlung über PayPal' },
                      ].map((pm) => (
                        <label key={pm.id} className={`flex items-center gap-5 p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                          paymentMethod === pm.id ? 'border-[#0C211E] bg-gray-50/80 shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            paymentMethod === pm.id ? 'border-[#0C211E]' : 'border-gray-300'
                          }`}>
                            {paymentMethod === pm.id && <div className="w-3 h-3 rounded-full bg-[#0C211E]" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <pm.icon className="w-5 h-5 text-[#0C211E]" />
                              <span className="font-bold text-[#0C211E] text-base">{pm.title}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-500 mt-0.5">{pm.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    
                    {/* Credit Card Form Expand */}
                    <AnimatePresence>
                      {paymentMethod === 'card' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }} 
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 bg-[#0C211E] rounded-2xl space-y-5">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-[#4ECCA3] uppercase tracking-wider">{t('payment.cardNumber')}</label>
                              <div className="relative">
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                  type="text" required maxLength={19}
                                  value={cardData.number}
                                  onChange={(e) => setCardData({...cardData, number: e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')})}
                                  className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:bg-white/15 focus:border-[#4ECCA3] outline-none transition-all font-mono text-white placeholder-white/30"
                                  placeholder="0000 0000 0000 0000"
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-5">
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-[#4ECCA3] uppercase tracking-wider">{t('payment.expiry')}</label>
                                <input
                                  type="text" required maxLength={5}
                                  value={cardData.expiry}
                                  onChange={(e) => setCardData({...cardData, expiry: e.target.value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/')})}
                                  className="w-full px-4 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:bg-white/15 focus:border-[#4ECCA3] outline-none transition-all font-mono text-white placeholder-white/30"
                                  placeholder="MM/YY"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-[#4ECCA3] uppercase tracking-wider">{t('payment.cvc')}</label>
                                <input
                                  type="text" required maxLength={4}
                                  value={cardData.cvc}
                                  onChange={(e) => setCardData({...cardData, cvc: e.target.value.replace(/\D/g, '')})}
                                  className="w-full px-4 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:bg-white/15 focus:border-[#4ECCA3] outline-none transition-all font-mono text-white placeholder-white/30"
                                  placeholder="123"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-bold text-[#4ECCA3] uppercase tracking-wider">{t('payment.cardName')}</label>
                              <input
                                type="text" required value={cardData.name}
                                onChange={(e) => setCardData({...cardData, name: e.target.value})}
                                className="w-full px-4 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:bg-white/15 focus:border-[#4ECCA3] outline-none transition-all text-white placeholder-white/30 font-medium tracking-wide"
                                placeholder="Z.b. MAX MUSTERMANN"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400 py-2">
                      <Lock className="w-4 h-4 text-[#4ECCA3]" />
                      <span>{t('payment.secure')}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="sm:w-1/3 py-4 bg-gray-50 border border-gray-200 text-[#0C211E] font-bold rounded-2xl hover:bg-gray-100 transition-colors"
                      >
                        {t('payment.back')}
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={isProcessing}
                        className="sm:w-2/3 flex-1 py-4 bg-[#0C211E] text-white font-bold rounded-2xl hover:bg-[#17423C] transition-colors flex items-center justify-center gap-3 disabled:opacity-50 text-lg shadow-xl shadow-[#0C211E]/20"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {t('payment.processing')}
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            {t('payment.pay')} {formatPriceDe(total)}
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Summary Sidebar */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100 p-8 sticky top-32">
              <h3 className="font-bold text-[#0C211E] mb-6 text-2xl font-heading">{t('summary.title')}</h3>
              
              <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-3 bg-gray-50/50 rounded-2xl border border-gray-100">
                    <div className="relative w-20 h-20 bg-white rounded-xl flex-shrink-0 border border-gray-100 overflow-hidden shadow-sm">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name.de}
                        fill
                        className="object-contain p-2 mix-blend-multiply"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-sm font-bold text-[#0C211E] line-clamp-2 leading-snug mb-1">
                        {item.product.name.de}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs font-bold text-gray-500 bg-white px-2 py-0.5 rounded-md border border-gray-200">Menge: {item.quantity}</span>
                        <span className="text-sm font-black text-[#0C211E]">
                          {formatPriceDe(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-100 pt-6 space-y-3">
                <div className="flex justify-between text-[15px] font-medium">
                  <span className="text-gray-500">{tc('subtotal')}</span>
                  <span className="font-bold text-[#0C211E] tabular-nums whitespace-nowrap">{formatPriceDe(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[15px] font-medium">
                  <span className="text-gray-500">{tc('shipping')}</span>
                  <span className={shipping === 0 ? 'text-green-600 font-bold px-2 py-0.5 bg-green-50 rounded-md' : 'font-bold text-[#0C211E]'}>
                    {shipping === 0 ? tc('freeShipping') : formatPriceDe(shipping)}
                  </span>
                </div>
                
                <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-end">
                  <span className="font-bold text-xl text-[#0C211E]">{tc('total')}</span>
                  <span className="font-black text-2xl sm:text-3xl tracking-tight text-[#0C211E] tabular-nums whitespace-nowrap">{formatPriceDe(total)}</span>
                </div>
                <p className="text-[11px] font-bold text-gray-400 text-right uppercase tracking-widest mt-1">
                  {tc('vat')}
                </p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                  <Shield className="w-5 h-5 text-[#4ECCA3]" />
                  <span>{tc('securePayment')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                  <Truck className="w-5 h-5 text-[#4ECCA3]" />
                  <span>{tc('deliveryTime')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Summary Button */}
      {items.length > 0 && !orderComplete && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.06)]"
        >
          <button 
            onClick={() => setShowMobileSummary(!showMobileSummary)}
            className="w-full flex items-center justify-between p-4 bg-gray-50/50"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0C211E]">{t('summary.title')}</span>
              <span className="text-xs font-bold text-white bg-[#0C211E] px-2 py-0.5 rounded-full">{items.length}</span>
            </div>
            <motion.div animate={{ rotate: showMobileSummary ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-5 h-5 text-gray-500" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showMobileSummary && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-b border-gray-100 bg-white px-4"
              >
                <div className="space-y-3 py-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between text-sm py-2">
                      <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                        <span className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">{item.quantity}</span>
                        <span className="font-bold text-[#0C211E] line-clamp-1">{item.product.name.de}</span>
                      </div>
                      <span className="font-black text-[#0C211E] tabular-nums whitespace-nowrap">{formatPriceDe(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between text-sm pt-4 border-t border-gray-50 font-medium text-gray-500">
                    <span>{tc('subtotal')}</span>
                    <span className="text-[#0C211E] font-bold tabular-nums whitespace-nowrap">{formatPriceDe(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 font-medium text-gray-500">
                    <span>{tc('shipping')}</span>
                    <span className={shipping === 0 ? 'text-green-600 font-bold' : 'text-[#0C211E] font-bold'}>
                      {shipping === 0 ? tc('freeShipping') : formatPriceDe(shipping)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{tc('total')}</p>
              <p className="text-xl sm:text-2xl font-black text-[#0C211E] tracking-tight tabular-nums whitespace-nowrap">{formatPriceDe(total)}</p>
            </div>
            {step === 1 ? (
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                className="flex-1 max-w-xs py-3.5 bg-[#0C211E] text-white font-bold rounded-xl hover:bg-[#17423C] transition-colors shadow-xl shadow-[#0C211E]/20"
              >
                {t('shipping.continue')}
              </motion.button>
            ) : (
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                disabled={isProcessing}
                className="flex-1 max-w-xs py-3.5 bg-[#0C211E] text-white font-bold rounded-xl hover:bg-[#17423C] transition-colors disabled:opacity-50 shadow-xl shadow-[#0C211E]/20"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </span>
                ) : (
                  `${t('payment.pay')}`
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
