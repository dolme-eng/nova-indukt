'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  ChevronRight,
  Check,
  Truck,
  AlertCircle,
  Lock,
  ArrowLeft,
  ChevronDown,
  Package,
  Shield,
  MapPin,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useAuth } from '@/lib/store/auth'
import Link from 'next/link'
import { formatPriceDe } from '@/lib/utils/vat'
import type { BankDetails } from '@/lib/data/bank-details'
import { logError } from '@/lib/logger'
import { useRecaptcha } from '@/hooks/use-recaptcha'

import { calculateShipping } from '@/lib/constants/shop'

const shippingSchema = z.object({
  firstName: z.string().min(1, 'Vorname ist erforderlich').max(100),
  lastName: z.string().min(1, 'Nachname ist erforderlich').max(100),
  email: z.string().min(1, 'E-Mail ist erforderlich').email('Ungültige E-Mail-Adresse'),
  phone: z.string().max(50).optional().or(z.literal('')),
  address: z.string().min(1, 'Adresse ist erforderlich').max(200),
  zipCode: z.string().min(1, 'PLZ ist erforderlich').max(20),
  city: z.string().min(1, 'Stadt ist erforderlich').max(100),
  country: z.string().min(1, 'Land ist erforderlich'),
})

type ShippingFormErrors = Partial<Record<keyof z.infer<typeof shippingSchema>, string>>

// Type du code promo validé retourné par /api/coupons/validate
interface AppliedPromo {
  code: string
  discountAmount: number
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT'
  discountValue: number
  promotionId: string
}

export default function CheckoutContent() {
  const isLocalProductImage = (src: string) => src?.startsWith('/images/products/') ?? false

  const { items, totalPrice, clearCart, isHydrated } = useCart()
  const { user, isAuthenticated } = useAuth()
  const mounted = useRef(false)
  const shippingFormRef = useRef<HTMLFormElement>(null)
  const paymentFormRef = useRef<HTMLFormElement>(null)

  // Guests are allowed — no forced redirect.
  // We track mount only to avoid SSR mismatches.
  useEffect(() => {
    mounted.current = true
  }, [])

  useEffect(() => {
    fetch('/api/bank-details')
      .then((r) => r.json())
      .then(setBankDetails)
      .catch(() => {})
  }, [])

  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [showMobileSummary, setShowMobileSummary] = useState(false)
  const { execute } = useRecaptcha()
  const [shippingErrors, setShippingErrors] = useState<ShippingFormErrors>({})
  const [shippingTouched, setShippingTouched] = useState<Record<string, boolean>>({})

  const [shippingData, setShippingData] = useState({
    firstName: user?.name?.split(' ')[0] ?? '',
    lastName: user?.name?.split(' ').slice(1).join(' ') ?? '',
    email: user?.email ?? '',
    phone: '',
    address: '',
    zipCode: '',
    city: '',
    country: 'Deutschland',
  })

  const [contactEmail, setContactEmail] = useState('')

  // Promo code state
  const [promoCode, setPromoCode] = useState('')
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null)

  const [, setOrderId] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string>('')
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    holder: '',
    iban: '',
    bic: '',
    bankName: '',
  })
  const subtotal = totalPrice
  const shipping = calculateShipping(subtotal)
  const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0
  const total = Math.max(0, subtotal + shipping - discountAmount)

  const validateShippingField = (name: string, value: string) => {
    const result = shippingSchema.safeParse({ ...shippingData, [name]: value })
    if (!result.success) {
      const fieldError = result.error.issues.find((i) => i.path[0] === name)
      return fieldError?.message || ''
    }
    return ''
  }

  const handleShippingBlur = (name: string, value: string) => {
    setShippingTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateShippingField(name, value)
    setShippingErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleShippingChange = (name: string, value: string) => {
    setShippingData((prev) => ({ ...prev, [name]: value }))
    if (shippingTouched[name]) {
      const error = validateShippingField(name as keyof ShippingFormErrors, value)
      setShippingErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const getShippingInputClass = (name: string) => {
    const hasError = shippingErrors[name as keyof ShippingFormErrors] && shippingTouched[name]
    return `w-full rounded-xl border bg-gray-50 px-5 py-3.5 font-medium text-[#0C211E] outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#4ECCA3]/10 ${
      hasError
        ? 'border-red-300 focus:border-red-400 focus:ring-red-400/10'
        : 'border-transparent focus:border-[#4ECCA3]'
    }`
  }

  const createOrder = useCallback(
    async (currentPaymentMethod: string, overrideEmail?: string) => {
      try {
        const orderData = {
          items: items.map((item) => ({
            id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            name: item.product.name.de,
            slug: item.product.slug,
          })),
          shippingData: {
            ...shippingData,
            email: overrideEmail || shippingData.email,
            country: normalizeCountry(shippingData.country),
          },
          paymentMethod: currentPaymentMethod.toUpperCase(),
          subtotal,
          shipping,
          discountAmount,
          appliedPromoCode: appliedPromo?.code ?? null,
          total,
        }

        const recaptchaToken = await execute('checkout')

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(recaptchaToken ? { 'x-recaptcha-token': recaptchaToken } : {}),
          },
          body: JSON.stringify(orderData),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || 'Fehler beim Erstellen der Bestellung')
        }

        const order = await response.json()
        setOrderId(order.id)
        setOrderNumber(order.orderNumber)
        return order
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Fehler beim Erstellen der Bestellung'
        toast.error(msg)
        return null
      }
    },
    [items, shippingData, subtotal, shipping, discountAmount, appliedPromo?.code, total, execute]
  )

  if (!isHydrated)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#4ECCA3]/30 border-t-[#4ECCA3]" />
          <p className="text-gray-600">Kasse wird geladen...</p>
        </div>
      </div>
    )

  const handleApplyPromo = async () => {
    if (!promoCode) return

    setIsApplyingPromo(true)
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode,
          amount: subtotal,
          items: items.map((item) => ({
            id: item.product.id,
            categoryId: item.product.category,
          })),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setAppliedPromo(data)
        toast.success(`Code "${data.code}" angewendet: -${formatPriceDe(data.discountAmount)}`)
      } else {
        toast.error(data.error || 'Code konnte nicht angewendet werden')
      }
    } catch {
      toast.error('Fehler bei der Validierung des Codes')
    } finally {
      setIsApplyingPromo(false)
    }
  }

  const removePromo = () => {
    setAppliedPromo(null)
    setPromoCode('')
    toast.success('Gutscheincode entfernt')
  }

  // Normalise le nom de pays (texte long → code ISO 2 lettres)
  const normalizeCountry = (country: string): string => {
    const map: Record<string, string> = {
      Deutschland: 'DE',
      Österreich: 'AT',
      Schweiz: 'CH',
      Germany: 'DE',
      Austria: 'AT',
      Switzerland: 'CH',
    }
    return map[country] ?? country.slice(0, 2).toUpperCase()
  }

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <nav className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 backdrop-blur-md">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center gap-2 py-4 text-xs font-medium sm:text-sm">
              <Link
                href="/warenkorb"
                className="flex items-center gap-1.5 text-gray-500 transition-colors hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Zurück zum Warenkorb</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="container mx-auto max-w-4xl px-4 py-16">
          <div className="rounded-[2.5rem] border border-gray-100 bg-white p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="mx-auto mb-6 flex h-24 w-24 -rotate-3 transform items-center justify-center rounded-[2rem] bg-gray-50">
              <AlertCircle className="h-12 w-12 text-gray-300" />
            </div>
            <h1 className="mb-4 font-heading text-3xl font-bold text-[#0C211E]">
              Warenkorb ist leer
            </h1>
            <p className="mx-auto mb-8 max-w-md text-lg text-gray-500">
              Bitte füge Artikel hinzu, um fortzufahren.
            </p>
            <Link
              href="/produkte"
              className="inline-flex items-center gap-3 rounded-2xl bg-[#0C211E] px-8 py-4 font-bold text-white shadow-xl shadow-[#0C211E]/20 transition-all hover:-translate-y-1 hover:bg-[#17423C]"
            >
              <Package className="h-5 w-5" />
              Zu den Produkten
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = shippingSchema.safeParse(shippingData)
    if (!result.success) {
      const fieldErrors: ShippingFormErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ShippingFormErrors
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      }
      setShippingErrors(fieldErrors)
      setShippingTouched({
        firstName: true,
        lastName: true,
        email: true,
        address: true,
        zipCode: true,
        city: true,
        country: true,
      })
      return
    }

    setShippingErrors({})
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle bank transfer (create order only)
  const handleBankTransfer = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!contactEmail || !contactEmail.includes('@')) {
      toast.error('Bitte geben Sie eine gültige E-Mail-Adresse ein')
      return
    }

    setIsProcessing(true)

    try {
      const order = await createOrder('BANK_TRANSFER', contactEmail)
      if (order) {
        setOrderComplete(true)
        clearCart()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (error) {
      logError('Order error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const steps = [
    { id: 1, label: 'Versand', icon: Truck },
    { id: 2, label: 'Bestellung', icon: Check },
  ]

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-20 selection:bg-[#4ECCA3]/30">
        <div className="container mx-auto max-w-3xl px-4 py-12 sm:py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white p-8 text-center shadow-[0_8px_40px_rgb(0,0,0,0.06)] sm:p-12"
          >
            <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-emerald-400 to-[#4ECCA3]" />

            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-white bg-green-50 shadow-lg shadow-green-100">
              <Check className="h-10 w-10 text-green-500" />
            </div>

            <h1 className="mb-4 font-heading text-3xl font-bold text-[#0C211E] sm:text-4xl">
              Vielen Dank für Ihre Bestellung!
            </h1>
            <p className="mb-8 text-lg text-gray-500">
              Wir haben Ihre Bestellung erhalten. Die Zahlungsinformationen werden Ihnen in Kürze
              per E-Mail zugesandt.
            </p>

            <div className="mb-10 rounded-[2rem] border border-gray-100 bg-gray-50/80 p-6 text-left sm:p-8">
              <div className="mb-4 flex items-center justify-between border-b border-gray-200/60 pb-4">
                <span className="font-medium text-gray-500">Bestellnummer</span>
                <span className="rounded-lg border border-gray-200 bg-white px-3 py-1 font-mono font-bold text-[#0C211E] shadow-sm">
                  {orderNumber}
                </span>
              </div>

              <h3 className="mb-5 text-xl font-bold text-[#0C211E]">Bestellübersicht</h3>

              <div className="space-y-4 text-[15px]">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Gesamtsumme</span>
                  <span className="whitespace-nowrap text-lg font-bold tabular-nums text-[#0C211E] sm:text-xl">
                    {formatPriceDe(total)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span>Zahlungsmethode</span>
                  <div className="flex items-center gap-2 font-medium">
                    <ShieldCheck className="h-4 w-4" />
                    Banküberweisung
                  </div>
                </div>
                <div className="flex items-start justify-between border-t border-gray-200/60 pt-2 text-gray-500">
                  <span>Versandadresse</span>
                  <span className="max-w-[200px] text-right text-sm font-medium leading-relaxed">
                    {shippingData.firstName} {shippingData.lastName}
                    <br />
                    {shippingData.address}
                    <br />
                    {shippingData.zipCode} {shippingData.city}
                    <br />
                    {shippingData.country}
                  </span>
                </div>
              </div>
            </div>

            {/* Bank Transfer Details */}
            <div className="mb-10 rounded-[2rem] bg-[#0C211E] p-6 text-left text-white sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <Mail className="h-6 w-6 text-[#4ECCA3]" />
                <h3 className="text-xl font-bold">Zahlungsinformationen</h3>
              </div>
              <p className="mb-6 text-white/70">
                Bitte überweisen Sie den Gesamtbetrag auf folgendes Konto. Verwenden Sie bitte Ihre
                Bestellnummer als Verwendungszweck.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Kontoinhaber</span>
                  <span className="font-bold">{bankDetails.holder}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">IBAN</span>
                  <span className="font-mono font-bold">{bankDetails.iban}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">BIC</span>
                  <span className="font-mono font-bold">{bankDetails.bic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Verwendungszweck</span>
                  <span className="font-mono font-bold">{orderNumber}</span>
                </div>
              </div>
              <div className="mt-6 rounded-xl bg-white/10 p-4">
                <p className="text-sm text-white/80">
                  Die Zahlungsinformationen wurden auch an Ihre E-Mail-Adresse gesendet. Bitte
                  beachten Sie, dass die Lieferung erst nach Eingang der Zahlung erfolgt.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/produkte"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0C211E] px-8 py-4 font-bold text-white shadow-lg shadow-[#0C211E]/20 transition-colors hover:bg-[#17423C]"
              >
                <Package className="h-5 w-5" />
                Weiter Einkaufen
              </Link>
              <Link
                href="/"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-8 py-4 font-bold text-[#0C211E] transition-colors hover:bg-gray-100"
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
    <div
      data-testid="checkout-page"
      className="min-h-screen bg-gray-50/50 pb-32 selection:bg-[#4ECCA3]/30 lg:pb-16"
    >
      {/* Navbar */}
      <nav className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 shadow-[0_4px_20px_rgb(0,0,0,0.02)] backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between py-2.5">
            <Link
              href="/warenkorb"
              className="group flex items-center gap-1 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-tighter text-gray-400 transition-colors hover:text-[#0C211E]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:block">Warenkorb</span>
            </Link>
            <div className="flex items-center gap-2 font-heading text-xs font-black uppercase tracking-widest text-[#0C211E]">
              NOVA <span className="font-light text-gray-300">|</span> KASSE
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400">
              <ShieldCheck className="h-3 w-3 text-nova-500" /> SSL
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Progress */}
        <div className="mb-8 lg:mb-10">
          <div className="mx-auto flex max-w-2xl items-center justify-center">
            {steps.map((s, index) => {
              const Icon = s.icon
              const isActive = step === s.id
              const isCompleted = step > s.id

              return (
                <div key={s.id} className="flex flex-1 items-center last:flex-none">
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      aria-current={isActive ? 'step' : undefined}
                      className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold transition-all duration-300 ${
                        isActive
                          ? 'scale-110 bg-[#0C211E] text-white shadow-lg shadow-[#0C211E]/10'
                          : isCompleted
                            ? 'bg-nova-500 text-[#0C211E]'
                            : 'border border-gray-100 bg-white text-gray-300'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4 stroke-[3]" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={`absolute top-full mt-2 whitespace-nowrap pt-0.5 text-[9px] font-black uppercase tracking-tighter transition-colors sm:text-[10px] ${isActive ? 'text-[#0C211E]' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-2 h-0.5 flex-1 rounded-full transition-colors duration-500 ${isCompleted ? 'bg-nova-500' : 'bg-gray-100'}`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-16 grid gap-8 sm:mt-20 lg:grid-cols-12 lg:gap-12">
          {/* Main Forms */}
          <div className="lg:col-span-7 xl:col-span-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8"
                >
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0C211E] shadow-lg shadow-[#0C211E]/10">
                      <MapPin className="h-5 w-5 text-nova-400" />
                    </div>
                    <h2 className="font-heading text-xl font-black uppercase tracking-tight text-[#0C211E]">
                      Versandadresse
                    </h2>
                  </div>

                  {/* Guest login prompt — optional, non-blocking */}
                  {!isAuthenticated && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#4ECCA3]/30 bg-[#4ECCA3]/10 p-4">
                      <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#4ECCA3]" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-[#0C211E]">
                          Haben Sie bereits ein Konto?
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          <Link
                            href={`/anmelden?redirect=/kasse`}
                            className="font-bold text-[#4ECCA3] hover:underline"
                          >
                            Jetzt anmelden
                          </Link>{' '}
                          um Ihre Bestellung zu verfolgen. Oder fahren Sie als Gast fort.
                        </p>
                      </div>
                    </div>
                  )}

                  <form ref={shippingFormRef} onSubmit={handleShippingSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label
                          htmlFor="shipping-firstName"
                          className="ml-1 text-sm font-bold text-gray-700"
                        >
                          Vorname *
                        </label>
                        <input
                          id="shipping-firstName"
                          data-testid="shipping-firstName"
                          type="text"
                          required
                          value={shippingData.firstName}
                          onChange={(e) => handleShippingChange('firstName', e.target.value)}
                          onBlur={() => handleShippingBlur('firstName', shippingData.firstName)}
                          aria-invalid={!!shippingErrors.firstName}
                          aria-describedby={
                            shippingErrors.firstName ? 'shipping-firstName-error' : undefined
                          }
                          className={getShippingInputClass('firstName')}
                        />
                        {shippingErrors.firstName && shippingTouched.firstName && (
                          <p id="shipping-firstName-error" className="ml-1 text-xs text-red-500">
                            {shippingErrors.firstName}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="shipping-lastName"
                          className="ml-1 text-sm font-bold text-gray-700"
                        >
                          Nachname *
                        </label>
                        <input
                          id="shipping-lastName"
                          data-testid="shipping-lastName"
                          type="text"
                          required
                          value={shippingData.lastName}
                          onChange={(e) => handleShippingChange('lastName', e.target.value)}
                          onBlur={() => handleShippingBlur('lastName', shippingData.lastName)}
                          aria-invalid={!!shippingErrors.lastName}
                          aria-describedby={
                            shippingErrors.lastName ? 'shipping-lastName-error' : undefined
                          }
                          className={getShippingInputClass('lastName')}
                        />
                        {shippingErrors.lastName && shippingTouched.lastName && (
                          <p id="shipping-lastName-error" className="ml-1 text-xs text-red-500">
                            {shippingErrors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label
                          htmlFor="shipping-email"
                          className="ml-1 text-sm font-bold text-gray-700"
                        >
                          E-Mail *
                        </label>
                        <input
                          id="shipping-email"
                          data-testid="shipping-email"
                          type="email"
                          required
                          value={shippingData.email}
                          onChange={(e) => handleShippingChange('email', e.target.value)}
                          onBlur={() => handleShippingBlur('email', shippingData.email)}
                          aria-invalid={!!shippingErrors.email}
                          aria-describedby={
                            shippingErrors.email ? 'shipping-email-error' : undefined
                          }
                          className={getShippingInputClass('email')}
                        />
                        {shippingErrors.email && shippingTouched.email && (
                          <p id="shipping-email-error" className="ml-1 text-xs text-red-500">
                            {shippingErrors.email}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="shipping-phone"
                          className="ml-1 text-sm font-bold text-gray-700"
                        >
                          Telefon (optional)
                        </label>
                        <input
                          id="shipping-phone"
                          data-testid="shipping-phone"
                          type="tel"
                          value={shippingData.phone}
                          onChange={(e) => handleShippingChange('phone', e.target.value)}
                          onBlur={() => handleShippingBlur('phone', shippingData.phone)}
                          className={getShippingInputClass('phone')}
                          placeholder="+49 "
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="shipping-address"
                        className="ml-1 text-sm font-bold text-gray-700"
                      >
                        Straße und Hausnummer *
                      </label>
                      <input
                        id="shipping-address"
                        data-testid="shipping-address"
                        type="text"
                        required
                        value={shippingData.address}
                        onChange={(e) => handleShippingChange('address', e.target.value)}
                        onBlur={() => handleShippingBlur('address', shippingData.address)}
                        aria-invalid={!!shippingErrors.address}
                        aria-describedby={
                          shippingErrors.address ? 'shipping-address-error' : undefined
                        }
                        className={getShippingInputClass('address')}
                      />
                      {shippingErrors.address && shippingTouched.address && (
                        <p id="shipping-address-error" className="ml-1 text-xs text-red-500">
                          {shippingErrors.address}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-5">
                      <div className="col-span-1 space-y-1">
                        <label
                          htmlFor="shipping-zip"
                          className="ml-1 text-sm font-bold text-gray-700"
                        >
                          PLZ *
                        </label>
                        <input
                          id="shipping-zip"
                          data-testid="shipping-zip"
                          type="text"
                          required
                          value={shippingData.zipCode}
                          onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                          onBlur={() => handleShippingBlur('zipCode', shippingData.zipCode)}
                          aria-invalid={!!shippingErrors.zipCode}
                          aria-describedby={
                            shippingErrors.zipCode ? 'shipping-zip-error' : undefined
                          }
                          className={getShippingInputClass('zipCode')}
                        />
                        {shippingErrors.zipCode && shippingTouched.zipCode && (
                          <p id="shipping-zip-error" className="ml-1 text-xs text-red-500">
                            {shippingErrors.zipCode}
                          </p>
                        )}
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label
                          htmlFor="shipping-city"
                          className="ml-1 text-sm font-bold text-gray-700"
                        >
                          Stadt *
                        </label>
                        <input
                          id="shipping-city"
                          data-testid="shipping-city"
                          type="text"
                          required
                          value={shippingData.city}
                          onChange={(e) => handleShippingChange('city', e.target.value)}
                          onBlur={() => handleShippingBlur('city', shippingData.city)}
                          aria-invalid={!!shippingErrors.city}
                          aria-describedby={shippingErrors.city ? 'shipping-city-error' : undefined}
                          className={getShippingInputClass('city')}
                        />
                        {shippingErrors.city && shippingTouched.city && (
                          <p id="shipping-city-error" className="ml-1 text-xs text-red-500">
                            {shippingErrors.city}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="shipping-country"
                        className="ml-1 text-sm font-bold text-gray-700"
                      >
                        Land *
                      </label>
                      <div className="relative">
                        <select
                          id="shipping-country"
                          value={shippingData.country}
                          onChange={(e) => handleShippingChange('country', e.target.value)}
                          onBlur={() => handleShippingBlur('country', shippingData.country)}
                          aria-invalid={!!shippingErrors.country}
                          className={`w-full appearance-none rounded-xl border bg-gray-50 px-5 py-3.5 font-bold text-[#0C211E] outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#4ECCA3]/10 ${
                            shippingErrors.country && shippingTouched.country
                              ? 'border-red-300 focus:border-red-400 focus:ring-red-400/10'
                              : 'border-transparent focus:border-[#4ECCA3]'
                          }`}
                        >
                          <option value="Deutschland">Deutschland</option>
                          <option value="Österreich">Österreich</option>
                          <option value="Schweiz">Schweiz</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0C211E]" />
                      </div>
                    </div>

                    <div className="pt-6">
                      <motion.button
                        data-testid="continue-to-payment"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#0C211E] py-4 text-lg font-bold text-white shadow-xl shadow-[#0C211E]/20 transition-colors hover:bg-[#17423C]"
                      >
                        Weiter zur Zahlung <ChevronRight className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  data-testid="payment-section"
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-10"
                >
                  <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0C211E] shadow-lg shadow-[#0C211E]/10">
                      <ShieldCheck className="h-6 w-6 text-[#4ECCA3]" />
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-[#0C211E]">
                      Zahlungsmethode
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Bank Transfer Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-5 rounded-2xl border-2 border-[#0C211E] bg-gray-50/80 p-5 shadow-sm">
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#0C211E]">
                          <div className="h-3 w-3 rounded-full bg-[#0C211E]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-[#0C211E]" />
                            <span className="text-base font-bold text-[#0C211E]">
                              Banküberweisung
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm font-medium text-gray-500">
                            Wir senden Ihnen die Zahlungsinformationen per E-Mail
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bank Transfer Form */}
                    <form ref={paymentFormRef} onSubmit={handleBankTransfer} className="space-y-6">
                      <div className="space-y-5 rounded-2xl bg-[#0C211E] p-6">
                        <div className="space-y-3">
                          <label
                            htmlFor="bank-transfer-email"
                            className="text-xs font-bold uppercase tracking-wider text-[#4ECCA3]"
                          >
                            E-Mail für Rechnung
                          </label>
                          <p className="text-sm leading-relaxed text-white/70">
                            Wir senden Ihnen eine Rechnung per E-Mail mit allen
                            Zahlungsinformationen (Banküberweisung).
                          </p>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                              id="bank-transfer-email"
                              type="email"
                              required
                              value={contactEmail || shippingData.email}
                              onChange={(e) => setContactEmail(e.target.value)}
                              className="w-full rounded-xl border border-white/20 bg-white/10 py-3.5 pl-12 pr-4 text-white placeholder-white/30 outline-none transition-all focus:border-[#4ECCA3] focus:bg-white/15"
                              placeholder="ihre@email.de"
                            />
                          </div>
                        </div>
                      </div>

                      <div className={`flex flex-col gap-4 sm:flex-row ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="rounded-2xl border border-gray-200 bg-gray-50 py-4 font-bold text-[#0C211E] transition-colors hover:bg-gray-100 sm:w-1/3"
                        >
                          Zurück
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          type="submit"
                          disabled={isProcessing}
                          className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-[#0C211E] py-4 text-lg font-bold text-white shadow-xl shadow-[#0C211E]/20 transition-colors hover:bg-[#17423C] disabled:opacity-50 sm:w-2/3"
                        >
                          {isProcessing ? (
                            <>
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              Wird verarbeitet...
                            </>
                          ) : (
                            <>
                              <Mail className="h-4 w-4" />
                              Bestellung aufgeben {formatPriceDe(total)}
                            </>
                          )}
                        </motion.button>
                      </div>
                    </form>

                    {/* Back button */}
                    <div className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-gray-400">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-[#0C211E] hover:underline"
                      >
                        ← Zurück zum Versand
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-gray-400">
                      <Lock className="h-4 w-4 text-[#4ECCA3]" />
                      <span>Ihre Zahlungsdaten werden sicher verschlüsselt (SSL/TLS).</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Summary Sidebar */}
          <div className="hidden lg:col-span-5 lg:block xl:col-span-4">
            <div className="sticky top-32 rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-[0_8px_40px_rgb(0,0,0,0.06)]">
              <h3 className="mb-6 font-heading text-2xl font-bold text-[#0C211E]">
                Bestellübersicht
              </h3>

              <div className="scrollbar-hide mb-6 max-h-[350px] space-y-4 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-3"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name.de}
                        fill
                        className="object-contain p-2 mix-blend-multiply"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <p className="mb-1 line-clamp-2 text-sm font-bold leading-snug text-[#0C211E]">
                        {item.product.name.de}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="rounded-md border border-gray-200 bg-white px-2 py-0.5 text-xs font-bold text-gray-500">
                          Menge: {item.quantity}
                        </span>
                        <span className="text-sm font-black text-[#0C211E]">
                          {formatPriceDe(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-6">
                {/* Promo Code Input */}
                {!appliedPromo ? (
                  <div className="mb-4 flex gap-2">
                    <label htmlFor="coupon-input" className="sr-only">
                      Gutscheincode
                    </label>
                    <input
                      id="coupon-input"
                      data-testid="coupon-input"
                      type="text"
                      placeholder="Gutscheincode"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 font-mono text-sm uppercase outline-none transition-all focus:border-[#4ECCA3]"
                    />
                    <button
                      data-testid="apply-coupon"
                      onClick={handleApplyPromo}
                      disabled={isApplyingPromo || !promoCode}
                      className="rounded-xl bg-[#0C211E] px-4 py-2 font-heading text-sm font-bold text-white transition-all hover:bg-[#17423C] disabled:opacity-50"
                    >
                      {isApplyingPromo ? '...' : 'OK'}
                    </button>
                  </div>
                ) : (
                  <div className="mb-4 flex items-center justify-between rounded-xl border border-green-100 bg-green-50 p-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-green-600">
                        Angewendet
                      </span>
                      <span className="font-mono text-sm font-bold text-green-700">
                        {appliedPromo.code}
                      </span>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-xs font-bold text-green-700 hover:text-green-900"
                    >
                      Entfernen
                    </button>
                  </div>
                )}

                <div className="flex justify-between text-[15px] font-medium">
                  <span className="text-gray-500">Zwischensumme</span>
                  <span className="whitespace-nowrap font-bold tabular-nums text-[#0C211E]">
                    {formatPriceDe(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[15px] font-medium">
                  <span className="text-gray-500">Versand</span>
                  <span
                    className={
                      shipping === 0
                        ? 'rounded-md bg-green-50 px-2 py-0.5 font-bold text-green-600'
                        : 'font-bold text-[#0C211E]'
                    }
                  >
                    {shipping === 0 ? 'Kostenlos' : formatPriceDe(shipping)}
                  </span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-[15px] font-medium text-green-600">
                    <span>Rabatt ({appliedPromo.code})</span>
                    <span className="whitespace-nowrap font-bold tabular-nums">
                      -{formatPriceDe(appliedPromo.discountAmount)}
                    </span>
                  </div>
                )}

                <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-4">
                  <span className="text-xl font-bold text-[#0C211E]">Gesamtsumme</span>
                  <span className="whitespace-nowrap text-2xl font-black tabular-nums tracking-tight text-[#0C211E] sm:text-3xl">
                    {formatPriceDe(total)}
                  </span>
                </div>
                <p className="mt-1 text-right text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Inkl. 19% MwSt.
                </p>
              </div>

              <div className="mt-8 space-y-3 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                  <Shield className="h-5 w-5 text-[#4ECCA3]" />
                  <span>Sichere Zahlung mit SSL-Verschlüsselung</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                  <Truck className="h-5 w-5 text-[#4ECCA3]" />
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
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white/95 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl lg:hidden"
        >
          <button
            onClick={() => setShowMobileSummary(!showMobileSummary)}
            aria-expanded={showMobileSummary}
            className="flex w-full items-center justify-between bg-gray-50/50 p-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0C211E]">
                Bestellübersicht
              </span>
              <span className="rounded-full bg-[#0C211E] px-2 py-0.5 text-xs font-bold text-white">
                {items.length}
              </span>
            </div>
            <motion.div
              animate={{ rotate: showMobileSummary ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-5 w-5 text-gray-500" />
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
                <div className="max-h-60 space-y-3 overflow-y-auto py-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between py-2 text-sm"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3 pr-4">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-500">
                          {item.quantity}
                        </span>
                        <span className="line-clamp-1 font-bold text-[#0C211E]">
                          {item.product.name.de}
                        </span>
                      </div>
                      <span className="whitespace-nowrap font-black tabular-nums text-[#0C211E]">
                        {formatPriceDe(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}

                  <div className="flex justify-between border-t border-gray-50 pt-4 text-sm font-medium text-gray-500">
                    <span>Zwischensumme</span>
                    <span className="whitespace-nowrap font-bold tabular-nums text-[#0C211E]">
                      {formatPriceDe(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 text-sm font-medium text-gray-500">
                    <span>Versand</span>
                    <span
                      className={
                        shipping === 0 ? 'font-bold text-green-600' : 'font-bold text-[#0C211E]'
                      }
                    >
                      {shipping === 0 ? 'Kostenlos' : formatPriceDe(shipping)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Gesamtsumme
              </p>
              <p className="whitespace-nowrap text-xl font-black tabular-nums tracking-tight text-[#0C211E] sm:text-2xl">
                {formatPriceDe(total)}
              </p>
            </div>
            {step === 1 ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => shippingFormRef.current?.requestSubmit()}
                className="max-w-xs flex-1 rounded-xl bg-[#0C211E] py-3.5 font-bold text-white shadow-xl shadow-[#0C211E]/20 transition-colors hover:bg-[#17423C]"
              >
                Weiter zur Zahlung
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={isProcessing}
                onClick={() => paymentFormRef.current?.requestSubmit()}
                className="max-w-xs flex-1 rounded-xl bg-[#0C211E] py-3.5 font-bold text-white shadow-xl shadow-[#0C211E]/20 transition-colors hover:bg-[#17423C] disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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
