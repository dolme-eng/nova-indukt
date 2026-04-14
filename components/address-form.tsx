'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Check, Loader2 } from 'lucide-react'

interface Address {
  id?: string
  name: string
  street: string
  street2?: string | null
  postalCode: string
  city: string
  state?: string | null
  country: string
  phone?: string | null
  isDefaultShipping: boolean
  isDefaultBilling: boolean
}

interface AddressFormProps {
  address?: Address
  onSubmit: (data: Address) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

const germanStates = [
  'Baden-Württemberg',
  'Bayern',
  'Berlin',
  'Brandenburg',
  'Bremen',
  'Hamburg',
  'Hessen',
  'Mecklenburg-Vorpommern',
  'Niedersachsen',
  'Nordrhein-Westfalen',
  'Rheinland-Pfalz',
  'Saarland',
  'Sachsen',
  'Sachsen-Anhalt',
  'Schleswig-Holstein',
  'Thüringen'
]

export function AddressForm({ address, onSubmit, onCancel, isSubmitting }: AddressFormProps) {
  const [formData, setFormData] = useState<Address>({
    name: address?.name || '',
    street: address?.street || '',
    street2: address?.street2 || '',
    postalCode: address?.postalCode || '',
    city: address?.city || '',
    state: address?.state || '',
    country: address?.country || 'DE',
    phone: address?.phone || '',
    isDefaultShipping: address?.isDefaultShipping || false,
    isDefaultBilling: address?.isDefaultBilling || false,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({})

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Address, string>> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name ist erforderlich'
    if (!formData.street.trim()) newErrors.street = 'Straße ist erforderlich'
    if (!formData.postalCode.trim()) newErrors.postalCode = 'PLZ ist erforderlich'
    if (!formData.city.trim()) newErrors.city = 'Stadt ist erforderlich'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    await onSubmit(formData)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4ECCA3]/10 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#4ECCA3]" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {address?.id ? 'Adresse bearbeiten' : 'Neue Adresse'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ansprechpartner / Firma *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20 focus:border-[#4ECCA3] transition-all ${
                errors.name ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="z.B. Max Mustermann"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Street */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Straße und Hausnummer *
            </label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20 focus:border-[#4ECCA3] transition-all ${
                errors.street ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="z.B. Musterstraße 123"
            />
            {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
          </div>

          {/* Street 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresszusatz (optional)
            </label>
            <input
              type="text"
              value={formData.street2 || ''}
              onChange={(e) => setFormData({ ...formData, street2: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20 focus:border-[#4ECCA3] transition-all"
              placeholder="z.B. Etage 2, Wohnung 4"
            />
          </div>

          {/* Postal Code & City */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PLZ *
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20 focus:border-[#4ECCA3] transition-all ${
                  errors.postalCode ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="12345"
              />
              {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stadt *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20 focus:border-[#4ECCA3] transition-all ${
                  errors.city ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Musterstadt"
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bundesland
            </label>
            <select
              value={formData.state || ''}
              onChange={(e) => setFormData({ ...formData, state: e.target.value || null })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20 focus:border-[#4ECCA3] transition-all bg-white"
            >
              <option value="">Bitte wählen</option>
              {germanStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Land
            </label>
            <select
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20 focus:border-[#4ECCA3] transition-all bg-white"
            >
              <option value="DE">Deutschland</option>
              <option value="AT">Österreich</option>
              <option value="CH">Schweiz</option>
              <option value="NL">Niederlande</option>
              <option value="BE">Belgien</option>
              <option value="FR">Frankreich</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon (optional)
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20 focus:border-[#4ECCA3] transition-all"
              placeholder="+49 123 456789"
            />
          </div>

          {/* Default Options */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                formData.isDefaultShipping 
                  ? 'bg-[#4ECCA3] border-[#4ECCA3]' 
                  : 'border-gray-300'
              }`}>
                {formData.isDefaultShipping && <Check className="w-3 h-3 text-white" />}
              </div>
              <input
                type="checkbox"
                checked={formData.isDefaultShipping}
                onChange={(e) => setFormData({ ...formData, isDefaultShipping: e.target.checked })}
                className="sr-only"
              />
              <div>
                <p className="font-medium text-gray-900">Standard-Lieferadresse</p>
                <p className="text-xs text-gray-500">Wird automatisch bei Bestellungen ausgewählt</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                formData.isDefaultBilling 
                  ? 'bg-[#4ECCA3] border-[#4ECCA3]' 
                  : 'border-gray-300'
              }`}>
                {formData.isDefaultBilling && <Check className="w-3 h-3 text-white" />}
              </div>
              <input
                type="checkbox"
                checked={formData.isDefaultBilling}
                onChange={(e) => setFormData({ ...formData, isDefaultBilling: e.target.checked })}
                className="sr-only"
              />
              <div>
                <p className="font-medium text-gray-900">Standard-Rechnungsadresse</p>
                <p className="text-xs text-gray-500">Wird automatisch für Rechnungen verwendet</p>
              </div>
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-white transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 bg-[#4ECCA3] text-white font-medium rounded-xl hover:bg-[#3BA88A] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {address?.id ? 'Speichern' : 'Hinzufügen'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
