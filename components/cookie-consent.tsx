'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Cookie, Shield, Settings, Check } from 'lucide-react'
import { setGAConsent } from './google-analytics'

declare global {
  interface Window {
    openCookieSettings?: () => void
  }
}

interface CookieConsent {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  timestamp: string
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<CookieConsent>({
    necessary: true,
    analytics: false,
    marketing: false,
    timestamp: new Date().toISOString(),
  })

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookie-consent')
    if (!savedConsent) {
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    } else {
      try {
        const parsed = JSON.parse(savedConsent)
        setPreferences(parsed)
        applyConsentChoices(parsed)
      } catch {
        localStorage.removeItem('cookie-consent')
        const timer = setTimeout(() => setIsVisible(true), 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [])

  const saveConsent = (newPreferences: CookieConsent) => {
    localStorage.setItem('cookie-consent', JSON.stringify(newPreferences))
    setPreferences(newPreferences)
    setIsVisible(false)
    applyConsentChoices(newPreferences)
  }

  const acceptAll = () =>
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    })

  const acceptNecessary = () =>
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    })

  const savePreferences = () =>
    saveConsent({
      ...preferences,
      timestamp: new Date().toISOString(),
    })

  const togglePreference = (key: 'analytics' | 'marketing') => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const applyConsentChoices = (consent: CookieConsent) => {
    setGAConsent(consent.analytics)
  }

  const openSettings = () => {
    setShowDetails(true)
    setIsVisible(true)
  }

  useEffect(() => {
    window.openCookieSettings = openSettings
    return () => {
      delete window.openCookieSettings
    }
  }, [])

  if (!isVisible) {
    return (
      <button
        onClick={openSettings}
        className="fixed bottom-4 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-colors hover:bg-gray-800"
        title="Cookie-Einstellungen"
        aria-label="Cookie-Einstellungen"
      >
        <Cookie className="h-5 w-5" />
      </button>
    )
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 lg:p-4"
        >
          <div className="mx-auto max-w-4xl lg:max-w-xl xl:max-w-lg">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl sm:rounded-2xl">
              {!showDetails ? (
                <div className="p-4 sm:p-5 lg:p-4">
                  <div className="flex items-start gap-3 sm:gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#4ECCA3]/10 sm:h-10 sm:w-10 lg:h-9 lg:w-9">
                      <Cookie className="h-4 w-4 text-[#4ECCA3] sm:h-5 sm:w-5 lg:h-4 lg:w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 text-sm font-semibold text-gray-900 lg:text-xs">
                        Wir verwenden Cookies
                      </h3>
                      <p className="mb-2 text-xs leading-relaxed text-gray-600 lg:text-[11px]">
                        Wir nutzen Cookies, um Ihr Einkaufserlebnis zu verbessern und unseren
                        Service zu optimieren.{' '}
                        <Link href="/datenschutz" className="text-[#4ECCA3] hover:underline">
                          Mehr erfahren
                        </Link>
                      </p>
                      <div className="flex flex-col flex-wrap items-stretch gap-2 sm:flex-row sm:items-center lg:gap-1.5">
                        <button
                          onClick={acceptAll}
                          className="whitespace-nowrap rounded-lg bg-[#4ECCA3] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#3BA88A] sm:px-4"
                        >
                          Alle akzeptieren
                        </button>
                        <button
                          onClick={acceptNecessary}
                          className="whitespace-nowrap rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:px-4"
                        >
                          Nur notwendige
                        </button>
                        <button
                          onClick={() => setShowDetails(true)}
                          className="flex items-center justify-center gap-1.5 px-2 py-2 text-xs text-gray-500 transition-colors hover:text-gray-700 sm:justify-start"
                        >
                          <Settings className="h-3.5 w-3.5" /> Einstellungen
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsVisible(false)}
                      className="-mr-1 -mt-1 flex-shrink-0 rounded-full p-1.5 transition-colors hover:bg-gray-100"
                      aria-label="Schließen"
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="max-h-[80vh] overflow-y-auto p-4 sm:p-5 lg:p-4">
                  <div className="mb-3 flex items-center justify-between lg:mb-2">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 lg:text-xs">
                      <Shield className="h-4 w-4 text-[#4ECCA3] lg:h-3.5 lg:w-3.5" /> Einstellungen
                    </h3>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="rounded-full p-1.5 transition-colors hover:bg-gray-100"
                      aria-label="Schließen"
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>

                  <div className="mb-3 space-y-2 lg:mb-2 lg:space-y-1.5">
                    {/* Necessary */}
                    <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-2.5 lg:p-2">
                      <div className="min-w-0 flex-1">
                        <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-medium text-gray-900">Notwendig</span>
                          <span className="rounded-full bg-[#4ECCA3]/10 px-1.5 py-0.5 text-[10px] text-[#4ECCA3]">
                            Erforderlich
                          </span>
                        </div>
                        <p className="text-[11px] leading-tight text-gray-600">
                          Diese Cookies sind für den Betrieb der Website zwingend erforderlich.
                        </p>
                      </div>
                      <div className="relative flex h-4 w-8 flex-shrink-0 items-center rounded-full bg-[#4ECCA3] sm:h-5 sm:w-9">
                        <div className="absolute right-0.5 h-2.5 w-2.5 rounded-full bg-white sm:h-3 sm:w-3" />
                        <Check className="absolute left-1 h-2.5 w-2.5 text-white" />
                      </div>
                    </div>

                    {/* Analytics - Toggleable */}
                    <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-2.5 lg:p-2">
                      <div className="min-w-0 flex-1">
                        <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-medium text-gray-900">Analyse</span>
                          <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] text-gray-600">
                            Optional
                          </span>
                        </div>
                        <p className="text-[11px] leading-tight text-gray-600">
                          Helfen Sie uns, die Website durch anonyme Daten zu verbessern.
                        </p>
                      </div>
                      <button
                        onClick={() => togglePreference('analytics')}
                        className={`relative flex h-4 w-8 flex-shrink-0 items-center rounded-full transition-colors sm:h-5 sm:w-9 ${preferences.analytics ? 'bg-[#4ECCA3]' : 'bg-gray-300'}`}
                        aria-label={
                          preferences.analytics
                            ? 'Analyse-Cookies deaktivieren'
                            : 'Analyse-Cookies aktivieren'
                        }
                      >
                        <div
                          className={`absolute h-2.5 w-2.5 rounded-full bg-white transition-all sm:h-3 sm:w-3 ${preferences.analytics ? 'right-0.5' : 'left-0.5'}`}
                        />
                      </button>
                    </div>

                    {/* Marketing - Toggleable */}
                    <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-2.5 lg:p-2">
                      <div className="min-w-0 flex-1">
                        <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-medium text-gray-900">Marketing</span>
                          <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] text-gray-600">
                            Optional
                          </span>
                        </div>
                        <p className="text-[11px] leading-tight text-gray-600">
                          Ermöglicht es uns, Ihnen personalisierte Angebote zu zeigen.
                        </p>
                      </div>
                      <button
                        onClick={() => togglePreference('marketing')}
                        className={`relative flex h-4 w-8 flex-shrink-0 items-center rounded-full transition-colors sm:h-5 sm:w-9 ${preferences.marketing ? 'bg-[#4ECCA3]' : 'bg-gray-300'}`}
                        aria-label={
                          preferences.marketing
                            ? 'Marketing-Cookies deaktivieren'
                            : 'Marketing-Cookies aktivieren'
                        }
                      >
                        <div
                          className={`absolute h-2.5 w-2.5 rounded-full bg-white transition-all sm:h-3 sm:w-3 ${preferences.marketing ? 'right-0.5' : 'left-0.5'}`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="mb-3 rounded bg-gray-100 p-2 text-[11px] lg:mb-2">
                    <p className="text-gray-600">
                      Ihre Auswahl:{' '}
                      <span className="font-medium text-gray-900">
                        Notwendig
                        {preferences.analytics && ' + Analyse'}
                        {preferences.marketing && ' + Marketing'}
                      </span>{' '}
                      Cookies
                    </p>
                  </div>

                  <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center lg:gap-1.5">
                    <button
                      onClick={savePreferences}
                      className="rounded-lg bg-[#4ECCA3] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#3BA88A] sm:px-4"
                    >
                      Auswahl speichern
                    </button>
                    <button
                      onClick={acceptAll}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:px-4"
                    >
                      Alle akzeptieren
                    </button>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="px-2 py-2 text-xs text-gray-500 transition-colors hover:text-gray-700"
                    >
                      Zurück
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cookie-consent')
      if (saved) setConsent(JSON.parse(saved))
    } catch {
      localStorage.removeItem('cookie-consent')
    }
  }, [])
  return {
    hasConsent: !!consent,
    analyticsAllowed: consent?.analytics ?? false,
    marketingAllowed: consent?.marketing ?? false,
    necessaryAllowed: true,
    openSettings: () => window.openCookieSettings?.(),
  }
}
