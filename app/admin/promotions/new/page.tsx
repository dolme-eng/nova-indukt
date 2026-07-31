import PromotionForm from '../_components/promotion-form'

export default function NewPromotionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Neue Aktion</h1>
        <p className="mt-1 text-gray-400">Erstellen Sie ein manuelles Sonderangebot</p>
      </div>

      <PromotionForm />
    </div>
  )
}
