'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { 
  ChevronRight, Check, CreditCard, Truck, 
  AlertCircle, Lock, ArrowLeft, ChevronDown,
  Package, Shield, MapPin
} from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useAuth } from '@/lib/store/auth'
import Link from 'next/link'

interface CheckoutContentProps {
  locale: string
}

const SHIPPING_COST = 9.99
const FREE_SHIPPING_THRESHOLD = 500

function CheckoutContent({ locale }: CheckoutContentProps) {
  const router = useRouter()
  const t = useTranslations('checkout')
  const tc = useTranslations('cart')
  const { items, totalPrice, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [showMobileSummary, setShowMobileSummary] = useState(false)
  
  // Shipping form
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
  
  // Payment form
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  })
  
  const subtotal = totalPrice
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shipping
  
  // Redirect if cart is empty
  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumbs */}
        <nav className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 py-3 text-sm">
              <Link href="/warenkorb" className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="lg:hidden">{t('backToCart')}</span>
              </Link>
              <div className="hidden lg:flex items-center gap-2">
                <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">{t('nav.home')}</Link>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <Link href="/warenkorb" className="text-gray-500 hover:text-gray-900 transition-colors">{t('cart.title')}</Link>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 font-medium">{t('title')}</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-8 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{t('emptyCart')}</h1>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">{t('emptyCartMessage')}</p>
            <Link 
              href={`/${locale}/produkte`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#4ECCA3] text-white font-medium rounded-xl hover:bg-[#3BA88A] transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
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
    window.scrollTo(0, 0)
  }
  
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    setOrderComplete(true)
    clearCart()
    window.scrollTo(0, 0)
  }
  
  const steps = [
    { id: 1, label: t('step1'), icon: Truck },
    { id: 2, label: t('step2'), icon: CreditCard },
    { id: 3, label: t('step3'), icon: Check }
  ]
  
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Breadcrumbs */}
        <nav className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 py-3 text-sm">
              <div className="flex items-center gap-2">
                <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">{t('nav.home')}</Link>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 font-medium">{t('success.title')}</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8 md:p-12 text-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Check className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">{t('success.title')}</h1>
            <p className="text-gray-600 mb-2 text-sm sm:text-base">{t('success.subtitle')}</p>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">{t('summary.orderNumber')}: <span className="font-mono font-medium text-gray-900">NOV-{Date.now().toString(36).toUpperCase()}</span></p>
            
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">{t('summary.title')}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{tc('total')}</span>
                  <span className="font-semibold">{total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('payment.title')}</span>
                  <span>{paymentMethod === 'card' ? t('payment.card') : paymentMethod === 'paypal' ? 'PayPal' : 'Sofort'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('shipping.title')}</span>
                  <span className="text-right text-xs sm:text-sm">{shippingData.address}, {shippingData.zipCode} {shippingData.city}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href={`/${locale}/produkte`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#4ECCA3] text-white font-medium rounded-xl hover:bg-[#3BA88A] transition-colors text-sm sm:text-base"
              >
                <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                {t('success.backProducts') || 'Continue Shopping'}
              </Link>
              <Link 
                href={`/${locale}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-gray-300 transition-colors text-sm sm:text-base"
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
    <div className="min-h-screen bg-gray-50 pb-32 lg:pb-8">
      {/* Breadcrumbs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 text-sm">
            <Link href="/warenkorb" className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors lg:hidden">
              <ArrowLeft className="w-4 h-4" />
              <span>{t('backToCart')}</span>
            </Link>
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">{t('nav.home')}</Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link href="/warenkorb" className="text-gray-500 hover:text-gray-900 transition-colors">{t('cart.title')}</Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">{t('title')}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <Link href={`/${locale}/warenkorb`} className="hidden lg:inline-flex items-center gap-2 text-gray-600 hover:text-[#4ECCA3] transition-colors mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" />
            {t('backToCart')}
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{t('title')}</h1>
        </div>
        
        {/* Progress Steps - Mobile */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => {
              const Icon = s.icon
              const isActive = step === s.id
              const isCompleted = step > s.id
              
              return (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors ${
                      isActive ? 'bg-[#4ECCA3] text-white' : 
                      isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : s.id}
                    </div>
                    <span className={`text-xs mt-1 ${isActive ? 'text-[#4ECCA3] font-medium' : 'text-gray-500'}`}>
                      {s.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Progress Steps - Desktop */}
        <div className="hidden lg:flex mb-8">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {steps.map((s, index) => {
              const Icon = s.icon
              const isActive = step === s.id
              const isCompleted = step > s.id
              
              return (
                <div key={s.id} className="flex items-center">
                  <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'md:flex-row md:gap-3' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isActive ? 'bg-[#4ECCA3] text-white' : 
                      isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-sm mt-2 md:mt-0 ${isActive ? 'text-[#4ECCA3] font-medium' : 'text-gray-500'}`}>
                      {s.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-gray-300 mx-2 md:mx-4" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 bg-[#4ECCA3]/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#4ECCA3]" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t('shipping.title')}</h2>
                </div>
                
                <form onSubmit={handleShippingSubmit} className="space-y-3 sm:space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('shipping.firstName')} *</label>
                      <input
                        type="text"
                        required
                        value={shippingData.firstName}
                        onChange={(e) => setShippingData({...shippingData, firstName: e.target.value})}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 text-sm sm:text-base"
                        placeholder="Max"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('shipping.lastName')} *</label>
                      <input
                        type="text"
                        required
                        value={shippingData.lastName}
                        onChange={(e) => setShippingData({...shippingData, lastName: e.target.value})}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 text-sm sm:text-base"
                        placeholder="Mustermann"
                      />
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('shipping.email')} *</label>
                      <input
                        type="email"
                        required
                        value={shippingData.email}
                        onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 text-sm sm:text-base"
                        placeholder="max@example.de"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('shipping.phone')}</label>
                      <input
                        type="tel"
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 text-sm sm:text-base"
                        placeholder="+49 123 456789"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('shipping.address')} *</label>
                    <input
                      type="text"
                      required
                      value={shippingData.address}
                      onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 text-sm sm:text-base"
                      placeholder="Musterstraße 123"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('shipping.zipCode')} *</label>
                      <input
                        type="text"
                        required
                        value={shippingData.zipCode}
                        onChange={(e) => setShippingData({...shippingData, zipCode: e.target.value})}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 text-sm sm:text-base"
                        placeholder="12345"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('shipping.city')} *</label>
                      <input
                        type="text"
                        required
                        value={shippingData.city}
                        onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 text-sm sm:text-base"
                        placeholder="Berlin"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('shipping.country')} *</label>
                    <select
                      value={shippingData.country}
                      onChange={(e) => setShippingData({...shippingData, country: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 text-sm sm:text-base bg-white"
                    >
                      <option value="Deutschland">Deutschland</option>
                      <option value="Österreich">Österreich</option>
                      <option value="Schweiz">Schweiz</option>
                    </select>
                  </div>
                  
                  <div className="pt-2 sm:pt-4">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      className="w-full py-3.5 sm:py-4 bg-[#4ECCA3] text-white font-semibold rounded-xl hover:bg-[#3BA88A] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg shadow-[#4ECCA3]/20"
                    >
                      {t('shipping.continue')}
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
            
            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 bg-[#4ECCA3]/10 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#4ECCA3]" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t('payment.title')}</h2>
                </div>
                
                <form onSubmit={handlePaymentSubmit} className="space-y-4 sm:space-y-6">
                  {/* Payment Methods */}
                  <div className="space-y-2 sm:space-y-3">
                    <label className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === 'card' ? 'border-[#4ECCA3] bg-[#4ECCA3]/5' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-[#4ECCA3] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-gray-600" />
                          <span className="font-medium text-sm sm:text-base">{t('payment.card')}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500">Visa, Mastercard, Amex</p>
                      </div>
                    </label>
                    
                    <label className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === 'paypal' ? 'border-[#4ECCA3] bg-[#4ECCA3]/5' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-[#4ECCA3] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-sm sm:text-base">{t('payment.paypal')}</span>
                        <p className="text-xs sm:text-sm text-gray-500">Sichere Zahlung über PayPal</p>
                      </div>
                    </label>
                    
                    <label className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === 'sofort' ? 'border-[#4ECCA3] bg-[#4ECCA3]/5' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="sofort"
                        checked={paymentMethod === 'sofort'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-[#4ECCA3] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-sm sm:text-base">{t('payment.sofort')}</span>
                        <p className="text-xs sm:text-sm text-gray-500">Direkt von Ihrem Bankkonto</p>
                      </div>
                    </label>
                  </div>
                  
                  {/* Card Form */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('payment.cardName')} *</label>
                        <input
                          type="text"
                          required
                          value={cardData.name}
                          onChange={(e) => setCardData({...cardData, name: e.target.value})}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 text-sm sm:text-base"
                          placeholder="Max Mustermann"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('payment.cardNumber')} *</label>
                        <input
                          type="text"
                          required
                          maxLength={19}
                          value={cardData.number}
                          onChange={(e) => setCardData({...cardData, number: e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')})}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 font-mono text-sm sm:text-base"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t('payment.expiry')} *</label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={cardData.expiry}
                            onChange={(e) => setCardData({...cardData, expiry: e.target.value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/')})}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 font-mono text-sm sm:text-base"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t('payment.cvc')} *</label>
                          <input
                            type="text"
                            required
                            maxLength={4}
                            value={cardData.cvc}
                            onChange={(e) => setCardData({...cardData, cvc: e.target.value.replace(/\D/g, '')})}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 font-mono text-sm sm:text-base"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <Lock className="w-4 h-4 text-[#4ECCA3]" />
                    <span>{t('payment.secure')}</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="sm:flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 transition-colors text-sm sm:text-base"
                    >
                      {t('payment.back')}
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={isProcessing}
                      className="sm:flex-1 py-3 sm:py-4 bg-[#4ECCA3] text-white font-semibold rounded-xl hover:bg-[#3BA88A] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base shadow-lg shadow-[#4ECCA3]/20"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t('payment.processing')}
                        </>
                      ) : (
                        <>
                          {t('payment.pay')} {total.toFixed(2)} €
                          <Lock className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
          
          {/* Order Summary - Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">{t('summary.title')}</h3>
              
              {/* Items */}
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="relative w-14 h-14 bg-gray-100 rounded-lg flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name[locale as 'de' | 'en' | 'fr']}
                        fill
                        className="object-cover rounded-lg"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.product.name[locale as 'de' | 'en' | 'fr']}
                      </p>
                      <p className="text-xs text-gray-500">{item.quantity}x</p>
                      <p className="text-sm font-medium text-[#4ECCA3]">
                        {(item.product.price * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{tc('subtotal')}</span>
                  <span className="font-medium">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{tc('shipping')}</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                    {shipping === 0 ? tc('freeShipping') : `${shipping.toFixed(2)} €`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-500">
                    {tc('freeShippingHint', { amount: (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2) })}
                  </p>
                )}
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>{tc('total')}</span>
                  <span className="text-[#4ECCA3]">{total.toFixed(2)} €</span>
                </div>
                <p className="text-xs text-gray-500">
                  {tc('vat')}
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield className="w-4 h-4 text-[#4ECCA3]" />
                  <span>{tc('securePayment')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Truck className="w-4 h-4 text-[#4ECCA3]" />
                  <span>{tc('deliveryTime')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Summary */}
      {items.length > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 px-4 py-3 shadow-lg"
        >
          {/* Collapsible Summary Header */}
          <button 
            onClick={() => setShowMobileSummary(!showMobileSummary)}
            className="w-full flex items-center justify-between mb-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{t('summary.title')}</span>
              <span className="text-sm font-medium text-gray-900">({items.length} {items.length === 1 ? t('item') : t('items')})</span>
            </div>
            <motion.div
              animate={{ rotate: showMobileSummary ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </motion.div>
          </button>

          {/* Expanded Summary */}
          <AnimatePresence>
            {showMobileSummary && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 mb-3 pb-3 border-b">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 line-clamp-1 flex-1">{item.product.name[locale as 'de' | 'en' | 'fr']}</span>
                      <span className="font-medium ml-2">{(item.product.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{tc('subtotal')}</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-600">{tc('shipping')}</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? tc('freeShipping') : `${shipping.toFixed(2)} €`}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Total & CTA */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500">{tc('total')}</p>
              <p className="text-xl font-bold text-[#4ECCA3]">{total.toFixed(2)} €</p>
            </div>
            {step === 1 ? (
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                className="flex-1 max-w-xs py-3 bg-[#4ECCA3] text-white font-semibold rounded-xl hover:bg-[#3BA88A] transition-colors text-sm sm:text-base"
              >
                {t('shipping.continue')}
              </motion.button>
            ) : (
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                disabled={isProcessing}
                className="flex-1 max-w-xs py-3 bg-[#4ECCA3] text-white font-semibold rounded-xl hover:bg-[#3BA88A] transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('payment.processing')}
                  </span>
                ) : (
                  `${t('payment.pay')} ${total.toFixed(2)} €`
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default function CheckoutPage({ params }: { params: { locale: string } }) {
  return <CheckoutContent locale={params.locale} />
}
