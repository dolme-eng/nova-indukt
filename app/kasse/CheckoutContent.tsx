'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { 
  ChevronRight, Check, CreditCard, Truck, 
  AlertCircle, Lock, ArrowLeft, ChevronDown,
  Package, Shield, MapPin, CheckCircle, Mail
} from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useAuth } from '@/lib/store/auth'
import Link from 'next/link'
import { formatPriceDe } from '@/lib/utils/vat'

// Stripe imports
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

// PayPal import
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

const SHIPPING_COST = 9.99
const FREE_SHIPPING_THRESHOLD = 500

// Initialize Stripe
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

// Stripe Payment Form Component
function StripePaymentForm({ 
  clientSecret, 
  onSuccess, 
  onError, 
  isProcessing,
  setIsProcessing 
}: { 
  clientSecret: string
  onSuccess: () => void
  onError: (error: string) => void
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
}) {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      onError('Stripe ist noch nicht geladen')
      return
    }

    setIsProcessing(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/kasse?stripe=success`,
      },
      redirect: 'if_required',
    })

    if (error) {
      onError(error.message || 'Zahlung fehlgeschlagen')
      setIsProcessing(false)
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess()
    } else {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
        <PaymentElement 
          options={{
            layout: 'tabs',
            defaultValues: {
              billingDetails: {
                address: {
                  country: 'DE',
                }
              }
            }
          }}
        />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-4 bg-[#0C211E] text-white font-bold rounded-2xl hover:bg-[#17423C] transition-colors flex items-center justify-center gap-3 disabled:opacity-50 text-lg shadow-xl shadow-[#0C211E]/20"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Zahlung wird verarbeitet...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Jetzt bezahlen
          </>
        )}
      </button>
    </form>
  )
}

export default function CheckoutContent() {
  const router = useRouter()
  const { items, totalPrice, clearCart, isHydrated } = useCart()
  const { user, isAuthenticated } = useAuth()
  const mounted = useRef(false)

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
  
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'email'>('stripe')
  const [contactEmail, setContactEmail] = useState('')
  
  // Stripe state
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string>('')

  if (!isHydrated) return null

  const subtotal = totalPrice
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shipping

  // Create order and get Stripe client secret
  const createOrder = useCallback(async (currentPaymentMethod: string) => {
    try {
      const orderData = {
        items: items.map(item => ({
          id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          name: item.product.name.de,
          slug: item.product.slug,
        })),
        shippingData,
        paymentMethod: currentPaymentMethod.toUpperCase(),
        subtotal,
        shipping,
        total
      }
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create order')
      }
      
      const data = await response.json()
      setOrderId(data.id)
      setOrderNumber(data.orderNumber)
      
      // Create Stripe Payment Intent
      if (paymentMethod === 'stripe') {
        const stripeResponse = await fetch('/api/stripe/payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            orderId: data.id,
          })
        })
        
        if (!stripeResponse.ok) {
          throw new Error('Failed to create payment intent')
        }
        
        const stripeData = await stripeResponse.json()
        setClientSecret(stripeData.clientSecret)
      }
      
      return data
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }, [items, shippingData, subtotal, shipping, total, paymentMethod])

  useEffect(() => {
    if (step === 2 && paymentMethod === 'stripe' && !clientSecret && items.length > 0) {
      createOrder('STRIPE')
    }
  }, [step, paymentMethod, clientSecret, items.length, createOrder])

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="flex items-center gap-2 py-4 text-xs sm:text-sm font-medium">
              <Link href="/warenkorb" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Zurück zum Warenkorb</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transform -rotate-3">
              <AlertCircle className="w-12 h-12 text-gray-300" />
            </div>
            <h1 className="text-3xl font-bold text-[#0C211E] mb-4 font-heading">Warenkorb ist leer</h1>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">Bitte füge Artikel hinzu, um fortzufahren.</p>
            <Link 
              href="/produkte"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#0C211E] text-white font-bold rounded-2xl hover:bg-[#17423C] transition-all shadow-xl shadow-[#0C211E]/20 hover:-translate-y-1"
            >
              <Package className="w-5 h-5" />
              Zu den Produkten
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

  // Handle Stripe payment success
  const handleStripeSuccess = () => {
    setOrderComplete(true)
    clearCart()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle Stripe payment error
  const handleStripeError = (error: string) => {
    toast.error(error || 'Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.')
    setIsProcessing(false)
  }

  // Handle PayPal success
  const handlePayPalSuccess = async (details: any) => {
    setIsProcessing(true)
    try {
      // Create order first if not exists
      let currentOrderId = orderId
      if (!currentOrderId) {
        const orderData = await createOrder('PAYPAL')
        currentOrderId = orderData.id
      }

      // Capture PayPal order
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paypalOrderId: details.id,
          orderId: currentOrderId,
        })
      })

      if (!response.ok) {
        throw new Error('PayPal capture failed')
      }

      setOrderComplete(true)
      clearCart()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('PayPal error:', error)
      toast.error('PayPal-Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.')
      setIsProcessing(false)
    }
  }

  // Handle email payment (create order only)
  const handleEmailPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!contactEmail || !contactEmail.includes('@')) {
      toast.error('Bitte geben Sie eine gültige E-Mail-Adresse ein')
      return
    }

    setIsProcessing(true)

    try {
      const orderData = {
        items: items.map(item => ({
          id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          name: item.product.name.de,
          slug: item.product.slug,
        })),
        shippingData: { ...shippingData, email: contactEmail },
        paymentMethod: 'BANK_TRANSFER',
        subtotal,
        shipping,
        total
      }
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create order')
      }
      
      const data = await response.json()
      setOrderNumber(data.orderNumber)
      
      setIsProcessing(false)
      setOrderComplete(true)
      clearCart()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.')
      setIsProcessing(false)
    }
  }

  const steps = [
    { id: 1, label: 'Versand', icon: Truck },
    { id: 2, label: 'Zahlung', icon: CreditCard },
    { id: 3, label: 'Bestätigung', icon: Check }
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
            
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0C211E] mb-4 font-heading">Vielen Dank für Ihre Bestellung!</h1>
            <p className="text-gray-500 mb-8 text-lg">
              {paymentMethod === 'email' 
                ? 'Wir haben Ihre Bestellung erhalten und senden Ihnen in Kürze die Zahlungsinformationen per E-Mail.'
                : 'Ihre Zahlung wurde erfolgreich verarbeitet. Wir haben eine Bestätigung an Ihre E-Mail gesendet.'
              }
            </p>
            
            <div className="bg-gray-50/80 rounded-[2rem] p-6 sm:p-8 mb-10 text-left border border-gray-100">
              <div className="flex items-center justify-between border-b border-gray-200/60 pb-4 mb-4">
                <span className="text-gray-500 font-medium">Bestellnummer</span>
                <span className="font-mono font-bold text-[#0C211E] bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">
                  {orderNumber}
                </span>
              </div>
              
              <h3 className="font-bold text-[#0C211E] mb-5 text-xl">Bestellübersicht</h3>
              
              <div className="space-y-4 text-[15px]">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Gesamtsumme</span>
                  <span className="font-bold text-[#0C211E] text-lg sm:text-xl tabular-nums whitespace-nowrap">{formatPriceDe(total)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span>Zahlungsmethode</span>
                  <div className="flex items-center gap-2 font-medium">
                    <CreditCard className="w-4 h-4"/>
                    {paymentMethod === 'stripe' ? 'Kreditkarte (Stripe)' : paymentMethod === 'paypal' ? 'PayPal' : 'E-Mail-Bestätigung'}
                  </div>
                </div>
                <div className="flex items-start justify-between text-gray-500 pt-2 border-t border-gray-200/60">
                  <span>Versandadresse</span>
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
                Weiter Einkaufen
              </Link>
              <Link 
                href="/"
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-50 border border-gray-200 text-[#0C211E] font-bold rounded-2xl hover:bg-gray-100 transition-colors"
              >
                Zur Startseite
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-32 lg:pb-16 selection:bg-[#4ECCA3]/30">
      
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex items-center justify-between py-4">
            <Link href="/warenkorb" className="flex items-center gap-1.5 text-gray-500 hover:text-[#0C211E] transition-colors bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:block">Zurück zum Warenkorb</span>
            </Link>
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
        
        {/* Progress */}
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
                    <h2 className="text-2xl font-bold text-[#0C211E] font-heading">Versandadresse</h2>
                  </div>
                  
                  <form onSubmit={handleShippingSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 ml-1">Vorname *</label>
                        <input
                          type="text" required value={shippingData.firstName}
                          onChange={(e) => setShippingData({...shippingData, firstName: e.target.value})}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none transition-all font-medium text-[#0C211E]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 ml-1">Nachname *</label>
                        <input
                          type="text" required value={shippingData.lastName}
                          onChange={(e) => setShippingData({...shippingData, lastName: e.target.value})}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none transition-all font-medium text-[#0C211E]"
                        />
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 ml-1">E-Mail *</label>
                        <input
                          type="email" required value={shippingData.email}
                          onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none transition-all font-medium text-[#0C211E]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 ml-1">Telefon (optional)</label>
                        <input
                          type="tel" value={shippingData.phone}
                          onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none transition-all font-medium text-[#0C211E]"
                          placeholder="+49 "
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-gray-700 ml-1">Straße und Hausnummer *</label>
                      <input
                        type="text" required value={shippingData.address}
                        onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                        className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none transition-all font-medium text-[#0C211E]"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-5">
                      <div className="col-span-1 space-y-1">
                        <label className="text-sm font-bold text-gray-700 ml-1">PLZ *</label>
                        <input
                          type="text" required value={shippingData.zipCode}
                          onChange={(e) => setShippingData({...shippingData, zipCode: e.target.value})}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none transition-all font-medium text-[#0C211E]"
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-sm font-bold text-gray-700 ml-1">Stadt *</label>
                        <input
                          type="text" required value={shippingData.city}
                          onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none transition-all font-medium text-[#0C211E]"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-gray-700 ml-1">Land *</label>
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
                        Weiter zur Zahlung <ChevronRight className="w-5 h-5" />
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
                    <h2 className="text-2xl font-bold text-[#0C211E] font-heading">Zahlungsmethode</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Payment Method Selection */}
                    <div className="space-y-3">
                      <label 
                        className={`flex items-center gap-5 p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                          paymentMethod === 'stripe' ? 'border-[#0C211E] bg-gray-50/80 shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="stripe"
                          checked={paymentMethod === 'stripe'}
                          onChange={() => setPaymentMethod('stripe')}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          paymentMethod === 'stripe' ? 'border-[#0C211E]' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'stripe' && <div className="w-3 h-3 rounded-full bg-[#0C211E]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-[#0C211E]" />
                            <span className="font-bold text-[#0C211E] text-base">Kreditkarte</span>
                          </div>
                          <p className="text-sm font-medium text-gray-500 mt-0.5">Sichere Zahlung mit Stripe (Visa, Mastercard, Amex)</p>
                        </div>
                      </label>

                      <label 
                        className={`flex items-center gap-5 p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                          paymentMethod === 'paypal' ? 'border-[#0C211E] bg-gray-50/80 shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={() => setPaymentMethod('paypal')}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          paymentMethod === 'paypal' ? 'border-[#0C211E]' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'paypal' && <div className="w-3 h-3 rounded-full bg-[#0C211E]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-[#0C211E]" />
                            <span className="font-bold text-[#0C211E] text-base">PayPal</span>
                          </div>
                          <p className="text-sm font-medium text-gray-500 mt-0.5">Schnelle und sichere Zahlung über PayPal</p>
                        </div>
                      </label>

                      <label 
                        className={`flex items-center gap-5 p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                          paymentMethod === 'email' ? 'border-[#0C211E] bg-gray-50/80 shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="email"
                          checked={paymentMethod === 'email'}
                          onChange={() => setPaymentMethod('email')}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          paymentMethod === 'email' ? 'border-[#0C211E]' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'email' && <div className="w-3 h-3 rounded-full bg-[#0C211E]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-[#0C211E]" />
                            <span className="font-bold text-[#0C211E] text-base">Überweisung / E-Mail</span>
                          </div>
                          <p className="text-sm font-medium text-gray-500 mt-0.5">Wir senden Ihnen die Zahlungsinformationen per E-Mail</p>
                        </div>
                      </label>
                    </div>
                    
                    {/* Payment Form Based on Selection */}
                    <AnimatePresence mode="wait">
                      {paymentMethod === 'stripe' && (
                        <motion.div
                          key="stripe"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          {clientSecret ? (
                            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                              <StripePaymentForm 
                                clientSecret={clientSecret}
                                onSuccess={handleStripeSuccess}
                                onError={handleStripeError}
                                isProcessing={isProcessing}
                                setIsProcessing={setIsProcessing}
                              />
                            </Elements>
                          ) : (
                            <div className="p-6 bg-gray-50 rounded-2xl flex items-center justify-center">
                              <div className="w-6 h-6 border-2 border-[#0C211E]/30 border-t-[#0C211E] rounded-full animate-spin" />
                              <span className="ml-3 text-sm font-medium text-gray-600">Zahlungsformular wird geladen...</span>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {paymentMethod === 'paypal' && (
                        <motion.div
                          key="paypal"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <PayPalScriptProvider options={{ 
                            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test',
                            currency: 'EUR',
                            intent: 'capture'
                          }}>
                            <PayPalButtons
                              style={{ layout: 'vertical', shape: 'rect', label: 'paypal' }}
                              disabled={isProcessing}
                              createOrder={async () => {
                                const response = await fetch('/api/paypal/create-order', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ amount: total })
                                })
                                const orderData = await response.json()
                                return orderData.orderId
                              }}
                              onApprove={async (data, actions) => {
                                setIsProcessing(true)
                                await handlePayPalSuccess({ id: data.orderID })
                              }}
                              onError={(err) => {
                                console.error('PayPal error:', err)
                                alert('PayPal-Fehler: ' + err)
                                setIsProcessing(false)
                              }}
                            />
                          </PayPalScriptProvider>
                          {isProcessing && (
                            <div className="mt-4 flex items-center justify-center">
                              <div className="w-5 h-5 border-2 border-[#0C211E]/30 border-t-[#0C211E] rounded-full animate-spin" />
                              <span className="ml-2 text-sm font-medium text-gray-600">PayPal-Zahlung wird verarbeitet...</span>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {paymentMethod === 'email' && (
                        <motion.div
                          key="email"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <form onSubmit={handleEmailPayment} className="space-y-6">
                            <div className="p-6 bg-[#0C211E] rounded-2xl space-y-5">
                              <div className="space-y-3">
                                <label className="text-xs font-bold text-[#4ECCA3] uppercase tracking-wider">E-Mail für Rechnung</label>
                                <p className="text-sm text-white/70 leading-relaxed">
                                  Wir senden Ihnen eine Rechnung per E-Mail mit allen Zahlungsinformationen (Banküberweisung).
                                </p>
                                <div className="relative">
                                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                  <input
                                    type="email" required
                                    value={contactEmail || shippingData.email}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:bg-white/15 focus:border-[#4ECCA3] outline-none transition-all text-white placeholder-white/30"
                                    placeholder="ihre@email.de"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                              <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="sm:w-1/3 py-4 bg-gray-50 border border-gray-200 text-[#0C211E] font-bold rounded-2xl hover:bg-gray-100 transition-colors"
                              >
                                Zurück
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
                                    Wird verarbeitet...
                                  </>
                                ) : (
                                  <>
                                    <Mail className="w-4 h-4" />
                                    Bestellung aufgeben {formatPriceDe(total)}
                                  </>
                                )}
                              </motion.button>
                            </div>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Back button for Stripe/PayPal */}
                    {(paymentMethod === 'stripe' || paymentMethod === 'paypal') && (
                      <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400 py-2">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-[#0C211E] hover:underline"
                        >
                          ← Zurück zum Versand
                        </button>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400 py-2">
                      <Lock className="w-4 h-4 text-[#4ECCA3]" />
                      <span>Ihre Zahlungsdaten werden sicher verschlüsselt (SSL/TLS).</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Summary Sidebar */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100 p-8 sticky top-32">
              <h3 className="font-bold text-[#0C211E] mb-6 text-2xl font-heading">Bestellübersicht</h3>
              
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
                  <span className="text-gray-500">Zwischensumme</span>
                  <span className="font-bold text-[#0C211E] tabular-nums whitespace-nowrap">{formatPriceDe(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[15px] font-medium">
                  <span className="text-gray-500">Versand</span>
                  <span className={shipping === 0 ? 'text-green-600 font-bold px-2 py-0.5 bg-green-50 rounded-md' : 'font-bold text-[#0C211E]'}>
                    {shipping === 0 ? 'Kostenlos' : formatPriceDe(shipping)}
                  </span>
                </div>
                
                <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-end">
                  <span className="font-bold text-xl text-[#0C211E]">Gesamtsumme</span>
                  <span className="font-black text-2xl sm:text-3xl tracking-tight text-[#0C211E] tabular-nums whitespace-nowrap">{formatPriceDe(total)}</span>
                </div>
                <p className="text-[11px] font-bold text-gray-400 text-right uppercase tracking-widest mt-1">
                  Inkl. 19% MwSt.
                </p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                  <Shield className="w-5 h-5 text-[#4ECCA3]" />
                  <span>Sichere Zahlung mit SSL-Verschlüsselung</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                  <Truck className="w-5 h-5 text-[#4ECCA3]" />
                  <span>Lieferzeit: 2-4 Werktage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Summary */}
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
              <span className="text-xs font-bold uppercase tracking-widest text-[#0C211E]">Bestellübersicht</span>
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
                    <span>Zwischensumme</span>
                    <span className="text-[#0C211E] font-bold tabular-nums whitespace-nowrap">{formatPriceDe(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 font-medium text-gray-500">
                    <span>Versand</span>
                    <span className={shipping === 0 ? 'text-green-600 font-bold' : 'text-[#0C211E] font-bold'}>
                      {shipping === 0 ? 'Kostenlos' : formatPriceDe(shipping)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Gesamtsumme</p>
              <p className="text-xl sm:text-2xl font-black text-[#0C211E] tracking-tight tabular-nums whitespace-nowrap">{formatPriceDe(total)}</p>
            </div>
            {step === 1 ? (
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                className="flex-1 max-w-xs py-3.5 bg-[#0C211E] text-white font-bold rounded-xl hover:bg-[#17423C] transition-colors shadow-xl shadow-[#0C211E]/20"
              >
                Weiter zur Zahlung
              </motion.button>
            ) : (
              <motion.button 
                whileTap={{ scale: 0.95 }}
                disabled={isProcessing}
                className="flex-1 max-w-xs py-3.5 bg-[#0C211E] text-white font-bold rounded-xl hover:bg-[#17423C] transition-colors disabled:opacity-50 shadow-xl shadow-[#0C211E]/20"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </span>
                ) : (
                  'Zahlungspflichtig bestellen'
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
