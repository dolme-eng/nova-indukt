'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Cookie, Shield, Settings, Check } from 'lucide-react'

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
    timestamp: new Date().toISOString()
  })

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookie-consent')
    if (!savedConsent) {
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    } else {
      setPreferences(JSON.parse(savedConsent))
    }
  }, [])

  const saveConsent = (newPreferences: CookieConsent) => {
    localStorage.setItem('cookie-consent', JSON.stringify(newPreferences))
    setPreferences(newPreferences)
    setIsVisible(false)
    applyConsentChoices(newPreferences)
  }

  const acceptAll = () => saveConsent({
    necessary: true, analytics: true, marketing: true,
    timestamp: new Date().toISOString()
  })

  const acceptNecessary = () => saveConsent({
    necessary: true, analytics: false, marketing: false,
    timestamp: new Date().toISOString()
  })

  const savePreferences = () => saveConsent({
    ...preferences, timestamp: new Date().toISOString()
  })

  const togglePreference = (key: 'analytics' | 'marketing') => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const applyConsentChoices = (consent: CookieConsent) => {
    console.log('Analytics:', consent.analytics ? 'enabled' : 'disabled')
    console.log('Marketing:', consent.marketing ? 'enabled' : 'disabled')
  }

  const openSettings = () => {
    setShowDetails(true)
    setIsVisible(true)
  }

  useEffect(() => {
    (window as any).openCookieSettings = openSettings
  }, [])

  if (!isVisible) {
    return (
      <button
        onClick={openSettings}
        className="fixed bottom-4 left-4 z-40 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
        title="Cookie-Einstellungen"
      >
        <Cookie className="w-5 h-5" />
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
          <div className="max-w-4xl mx-auto lg:max-w-xl xl:max-w-lg">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {!showDetails ? (
                <div className="p-4 sm:p-5 lg:p-4">
                  <div className="flex items-start gap-3 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-9 lg:h-9 bg-[#4ECCA3]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Cookie className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 text-[#4ECCA3]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm lg:text-xs">Wir verwenden Cookies</h3>
                      <p className="text-gray-600 text-xs lg:text-[11px] leading-relaxed mb-2">
                        Wir nutzen Cookies, um Ihr Einkaufserlebnis zu verbessern und unseren Service zu optimieren.{' '}
                        <Link href="/datenschutz" className="text-[#4ECCA3] hover:underline">Mehr erfahren</Link>
                      </p>
                      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 lg:gap-1.5">
                        <button 
                          onClick={acceptAll} 
                          className="px-3 sm:px-4 py-2 bg-[#4ECCA3] text-white font-medium rounded-lg hover:bg-[#3BA88A] transition-colors text-xs whitespace-nowrap"
                        >
                          Alle akzeptieren
                        </button>
                        <button 
                          onClick={acceptNecessary} 
                          className="px-3 sm:px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-xs whitespace-nowrap"
                        >
                          Nur notwendige
                        </button>
                        <button 
                          onClick={() => setShowDetails(true)} 
                          className="px-2 py-2 text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center sm:justify-start gap-1.5 text-xs"
                        >
                          <Settings className="w-3.5 h-3.5" /> Einstellungen
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsVisible(false)} 
                      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 -mt-1 -mr-1"
                      aria-label="Schließen"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-5 lg:p-4 max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-3 lg:mb-2">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm lg:text-xs">
                      <Shield className="w-4 h-4 lg:w-3.5 lg:h-3.5 text-[#4ECCA3]" /> Einstellungen
                    </h3>
                    <button 
                      onClick={() => setShowDetails(false)} 
                      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Schließen"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-2 lg:space-y-1.5 mb-3 lg:mb-2">
                    {/* Necessary */}
                    <div className="flex items-start gap-2 p-2.5 lg:p-2 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                          <span className="font-medium text-gray-900 text-xs">Notwendig</span>
                          <span className="px-1.5 py-0.5 bg-[#4ECCA3]/10 text-[#4ECCA3] text-[10px] rounded-full">Erforderlich</span>
                        </div>
                        <p className="text-[11px] text-gray-600 leading-tight">Diese Cookies sind für den Betrieb der Website zwingend erforderlich.</p>
                      </div>
                      <div className="w-8 h-4 sm:w-9 sm:h-5 bg-[#4ECCA3] rounded-full relative flex items-center flex-shrink-0">
                        <div className="absolute right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full" />
                        <Check className="w-2.5 h-2.5 text-white absolute left-1" />
                      </div>
                    </div>

                    {/* Analytics - Toggleable */}
                    <div className="flex items-start gap-2 p-2.5 lg:p-2 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                          <span className="font-medium text-gray-900 text-xs">Analyse</span>
                          <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 text-[10px] rounded-full">Optional</span>
                        </div>
                        <p className="text-[11px] text-gray-600 leading-tight">Helfen Sie uns, die Website durch anonyme Daten zu verbessern.</p>
                      </div>
                      <button
                        onClick={() => togglePreference('analytics')}
                        className={`w-8 h-4 sm:w-9 sm:h-5 rounded-full relative flex items-center transition-colors flex-shrink-0 ${preferences.analytics ? 'bg-[#4ECCA3]' : 'bg-gray-300'}`}
                        aria-label={preferences.analytics ? 'Analyse-Cookies deaktivieren' : 'Analyse-Cookies aktivieren'}
                      >
                        <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full absolute transition-all ${preferences.analytics ? 'right-0.5' : 'left-0.5'}`} />
                      </button>
                    </div>

                    {/* Marketing - Toggleable */}
                    <div className="flex items-start gap-2 p-2.5 lg:p-2 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                          <span className="font-medium text-gray-900 text-xs">Marketing</span>
                          <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 text-[10px] rounded-full">Optional</span>
                        </div>
                        <p className="text-[11px] text-gray-600 leading-tight">Ermöglicht es uns, Ihnen personalisierte Angebote zu zeigen.</p>
                      </div>
                      <button
                        onClick={() => togglePreference('marketing')}
                        className={`w-8 h-4 sm:w-9 sm:h-5 rounded-full relative flex items-center transition-colors flex-shrink-0 ${preferences.marketing ? 'bg-[#4ECCA3]' : 'bg-gray-300'}`}
                        aria-label={preferences.marketing ? 'Marketing-Cookies deaktivieren' : 'Marketing-Cookies aktivieren'}
                      >
                        <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full absolute transition-all ${preferences.marketing ? 'right-0.5' : 'left-0.5'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-100 rounded p-2 mb-3 lg:mb-2 text-[11px]">
                    <p className="text-gray-600">
                      Ihre Auswahl: <span className="font-medium text-gray-900">
                        Notwendig 
                        {preferences.analytics && ' + Analyse'} 
                        {preferences.marketing && ' + Marketing'}
                      </span> Cookies
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:gap-1.5">
                    <button 
                      onClick={savePreferences} 
                      className="px-3 sm:px-4 py-2 bg-[#4ECCA3] text-white font-medium rounded-lg hover:bg-[#3BA88A] transition-colors text-xs"
                    >
                      Auswahl speichern
                    </button>
                    <button 
                      onClick={acceptAll} 
                      className="px-3 sm:px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-xs"
                    >
                      Alle akzeptieren
                    </button>
                    <button 
                      onClick={() => setShowDetails(false)} 
                      className="px-2 py-2 text-gray-500 hover:text-gray-700 transition-colors text-xs"
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
    const saved = localStorage.getItem('cookie-consent')
    if (saved) setConsent(JSON.parse(saved))
  }, [])
  return {
    hasConsent: !!consent,
    analyticsAllowed: consent?.analytics ?? false,
    marketingAllowed: consent?.marketing ?? false,
    necessaryAllowed: true,
    openSettings: () => (window as any).openCookieSettings?.()
  }
}
