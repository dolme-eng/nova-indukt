'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, MapPin, Check, Loader2 } from 'lucide-react'

interface Address {
  id?: string
  firstName: string
  lastName: string
  company?: string | null
  street: string
  street2?: string | null
  zipCode: string
  city: string
  country: string
  phone?: string | null
  isDefault: boolean
}

interface AddressFormProps {
  address?: Address
  onSubmit: (data: Address) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

export function AddressForm({ address, onSubmit, onCancel, isSubmitting }: AddressFormProps) {
  const [formData, setFormData] = useState<Address>({
    firstName: address?.firstName || '',
    lastName: address?.lastName || '',
    company: address?.company || '',
    street: address?.street || '',
    street2: address?.street2 || '',
    zipCode: address?.zipCode || '',
    city: address?.city || '',
    country: address?.country || 'DE',
    phone: address?.phone || '',
    isDefault: address?.isDefault || false,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({})

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Address, string>> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'Vorname ist erforderlich'
    if (!formData.lastName.trim()) newErrors.lastName = 'Nachname ist erforderlich'
    if (!formData.street.trim()) newErrors.street = 'Straße ist erforderlich'
    if (!formData.zipCode.trim()) newErrors.zipCode = 'PLZ ist erforderlich'
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4ECCA3]/10">
              <MapPin className="h-5 w-5 text-[#4ECCA3]" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {address?.id ? 'Adresse bearbeiten' : 'Neue Adresse'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-h-[60vh] space-y-4 overflow-y-auto p-6">
          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700">Vorname *</label>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className={`w-full rounded-xl border px-4 py-2.5 transition-all focus:border-[#4ECCA3] focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20 ${
                  errors.firstName ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="z.B. Max"
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-gray-700">Nachname *</label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className={`w-full rounded-xl border px-4 py-2.5 transition-all focus:border-[#4ECCA3] focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20 ${
                  errors.lastName ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="z.B. Mustermann"
              />
              {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="mb-1 block text-sm font-medium text-gray-700">Firma (optional)</label>
            <input
              id="company"
              type="text"
              value={formData.company || ''}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 transition-all focus:border-[#4ECCA3] focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20"
              placeholder="z.B. Muster GmbH"
            />
          </div>

          {/* Street */}
          <div>
            <label htmlFor="street" className="mb-1 block text-sm font-medium text-gray-700">
              Straße und Hausnummer *
            </label>
            <input
              id="street"
              type="text"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className={`w-full rounded-xl border px-4 py-2.5 transition-all focus:border-[#4ECCA3] focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20 ${
                errors.street ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="z.B. Musterstraße 123"
            />
            {errors.street && <p className="mt-1 text-xs text-red-500">{errors.street}</p>}
          </div>

          {/* Street 2 */}
          <div>
            <label htmlFor="street2" className="mb-1 block text-sm font-medium text-gray-700">
              Adresszusatz (optional)
            </label>
            <input
              id="street2"
              type="text"
              value={formData.street2 || ''}
              onChange={(e) => setFormData({ ...formData, street2: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 transition-all focus:border-[#4ECCA3] focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20"
              placeholder="z.B. Etage 2, Wohnung 4"
            />
          </div>

          {/* Zip Code & City */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="zipCode" className="mb-1 block text-sm font-medium text-gray-700">PLZ *</label>
              <input
                id="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                className={`w-full rounded-xl border px-4 py-2.5 transition-all focus:border-[#4ECCA3] focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20 ${
                  errors.zipCode ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="12345"
              />
              {errors.zipCode && <p className="mt-1 text-xs text-red-500">{errors.zipCode}</p>}
            </div>
            <div>
              <label htmlFor="city" className="mb-1 block text-sm font-medium text-gray-700">Stadt *</label>
              <input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className={`w-full rounded-xl border px-4 py-2.5 transition-all focus:border-[#4ECCA3] focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20 ${
                  errors.city ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Musterstadt"
              />
              {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
            </div>
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="mb-1 block text-sm font-medium text-gray-700">Land</label>
            <select
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 transition-all focus:border-[#4ECCA3] focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20"
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
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
              Telefon (optional)
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 transition-all focus:border-[#4ECCA3] focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/20"
              placeholder="+49 123 456789"
            />
          </div>

          {/* Default Options */}
          <div className="space-y-3 border-t border-gray-100 pt-2">
            <label htmlFor="isDefault" className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-3 transition-colors hover:bg-gray-50">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                  formData.isDefault ? 'border-[#4ECCA3] bg-[#4ECCA3]' : 'border-gray-300'
                }`}
              >
                {formData.isDefault && <Check className="h-3 w-3 text-white" />}
              </div>
              <input
                id="isDefault"
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="sr-only"
              />
              <div>
                <p className="font-medium text-gray-900">Standardadresse</p>
                <p className="text-xs text-gray-500">
                  Wird automatisch bei Bestellungen ausgewählt
                </p>
              </div>
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-white"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#4ECCA3] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[#3BA88A] disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {address?.id ? 'Speichern' : 'Hinzufügen'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
