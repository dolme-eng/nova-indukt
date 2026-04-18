import PromotionForm from '../_components/promotion-form'

export default function NewPromotionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Nouvelle promotion</h1>
        <p className="text-gray-400 mt-1">Créez une offre promotionnelle manuellement</p>
      </div>
      
      <PromotionForm />
    </div>
  )
}
