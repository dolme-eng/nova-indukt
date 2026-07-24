import type { Metadata } from 'next'
import { getBankDetails } from '@/lib/data/bank-details'
import { COMPANY } from '@/lib/constants/company'

export const metadata: Metadata = {
  title: 'Informations de paiement',
  description: 'Instructions de paiement par virement bancaire pour vos commandes NOVA INDUKT',
  alternates: {
    canonical: '/informations-de-paiement',
  },
}

export default async function PaymentInfoPage() {
  const bank = await getBankDetails()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Informations de paiement</h1>

        <div className="space-y-8">
          {/* Main payment info */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#8B0000] mb-4">Paiement par virement bancaire</h2>
            <p className="text-gray-600 mb-6">
              Réglez votre commande par virement bancaire. Afin d&apos;accélérer le traitement de votre commande, 
              <strong> nous acceptons uniquement les virements instantanés</strong>.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de paiement</h3>
            <p className="text-gray-600 mb-6">
              Veuillez régler votre commande par virement vers notre compte bancaire.
            </p>

            {/* Bank details card */}
            <div className="bg-[#4ECCA3]/5 border-l-4 border-[#4ECCA3] rounded-xl p-6 mb-6">
              <h4 className="font-bold text-gray-900 mb-4">Coordonnées bancaires</h4>
              <div className="space-y-3 text-sm">
                {bank.bankName && (
                  <p><span className="font-semibold">Banque :</span> {bank.bankName}</p>
                )}
                <p><span className="font-semibold">IBAN :</span> <span className="font-mono">{bank.iban}</span></p>
                <p><span className="font-semibold">BIC :</span> <span className="font-mono">{bank.bic}</span></p>
                <p><span className="font-semibold">Titulaire du compte :</span> {bank.holder}</p>
                <p><span className="font-semibold">Concept du transfert :</span> Votre nom + numéro de commande</p>
                <p><span className="font-semibold">Type de transfert :</span> <span className="text-[#8B0000] font-bold">ÜBERWEISUNG</span></p>
              </div>
            </div>

            {/* Important notice */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-gray-900 mb-2">Important — Vérification du nom du bénéficiaire</h4>
              <p className="text-sm text-gray-700 mb-3">
                En raison des règles applicables aux virements instantanés, votre banque peut afficher le message suivant lors de la validation de la transaction :
              </p>
              <blockquote className="bg-white rounded-lg p-4 text-sm italic text-gray-600 border border-gray-200 mb-3">
                &laquo; Le nom du bénéficiaire associé à cet IBAN n&apos;a pas pu être vérifié. Si vous confirmez le virement, 
                il pourrait être crédité sur le compte d&apos;un autre bénéficiaire. &raquo;
              </blockquote>
              <p className="text-sm text-gray-700">
                Cela ne signifie pas nécessairement qu&apos;il y a une erreur. Les virements instantanés sont très rapides 
                et toutes les banques ne vérifient pas automatiquement le nom du titulaire du compte. 
                <strong> Pour un traitement optimal</strong>, veuillez indiquer le nom du titulaire du compte et la 
                référence de paiement exactement comme indiqué ci-dessus.
              </p>
            </div>

            {/* How to confirm */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comment confirmer votre paiement</h3>
            <p className="text-gray-600 mb-4">
              Après avoir effectué le virement, veuillez nous envoyer une preuve de paiement (capture d&apos;écran ou photo) 
              en utilisant l&apos;une des options suivantes :
            </p>
            <ul className="list-disc list-inside ml-4 text-gray-600 mb-6 space-y-2">
              <li>Par courriel : <a href={`mailto:${COMPANY.email.support}`} className="text-[#4ECCA3] hover:underline">{COMPANY.email.support}</a></li>
              <li>Par téléphone : <a href={`tel:${COMPANY.phone.number.replace(/\s/g, '')}`} className="text-[#4ECCA3] hover:underline">{COMPANY.phone.number}</a></li>
            </ul>
            <p className="text-gray-600">
              Nous traiterons votre commande dès réception et vérification de la preuve de paiement.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-[#4ECCA3]/10 rounded-2xl p-8 border-l-4 border-[#4ECCA3]">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact et assistance</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>{COMPANY.name}</strong></p>
              <p>Email : <a href={`mailto:${COMPANY.email.support}`} className="text-[#4ECCA3] hover:underline">{COMPANY.email.support}</a></p>
              <p>Téléphone : <a href={`tel:${COMPANY.phone.number.replace(/\s/g, '')}`} className="text-[#4ECCA3] hover:underline">{COMPANY.phone.number}</a></p>
            </div>
          </div>

          {/* Legal notices */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Avis juridiques</h2>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>Nous vous recommandons le virement instantané pour accélérer l&apos;expédition de votre commande.</li>
              <li>Si votre banque affiche un avertissement concernant la vérification du nom du titulaire du compte, vous pouvez contacter votre conseiller bancaire pour confirmation.</li>
              <li>Si vous avez effectué un paiement incorrect ou si le virement a été effectué avec des informations incorrectes, veuillez contacter immédiatement notre service clientèle.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
