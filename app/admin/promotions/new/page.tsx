import PromotionForm from '../_components/promotion-form'

export default function NewPromotionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Neue Aktion</h1>
        <p className="mt-1 text-slate-500">Erstellen Sie ein manuelles Sonderangebot</p>
      </div>

      <PromotionForm />
    </div>
  )
}
