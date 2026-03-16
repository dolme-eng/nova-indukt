import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Widerrufsrecht | NOVA INDUKT',
  description: 'Widerrufsbelehrung und Widerrufsformular der NOVA INDUKT GmbH',
}

export default function WiderrufPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Widerrufsrecht</h1>
        
        <div className="space-y-8">
          {/* Widerrufsbelehrung */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Widerrufsbelehrung</h2>
            
            <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
              <div className="bg-[#4ECCA3]/10 rounded-xl p-4 border-l-4 border-[#4ECCA3]">
                <h3 className="font-semibold text-gray-900 mb-2">Widerrufsrecht</h3>
                <p>
                  Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. 
                  Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter 
                  Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Um Ihr Widerrufsrecht auszuüben, müssen Sie uns</h3>
                <div className="space-y-2">
                  <p className="font-medium">NOVA INDUKT GmbH</p>
                  <p>Industriestraße 123</p>
                  <p>12345 Berlin</p>
                  <p>Telefon: +49 (0) 30 12345678</p>
                  <p>E-Mail: widerruf@nova-indukt.de</p>
                </div>
                <p className="mt-4">
                  mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief, Telefax oder E-Mail) 
                  über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte 
                  <Link href="#widerrufsformular" className="text-[#4ECCA3] hover:underline ml-1">Muster-Widerrufsformular</Link> verwenden, das jedoch nicht vorgeschrieben ist.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Zur Wahrung der Widerrufsfrist reicht es aus,</h3>
                <p>
                  dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
                </p>
              </div>

              <div className="bg-red-50 rounded-xl p-4 border-l-4 border-red-500">
                <h3 className="font-semibold text-gray-900 mb-2">Folgen des Widerrufs</h3>
                <p className="mb-3">
                  Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, 
                  einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass 
                  Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), 
                  unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung 
                  über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
                </p>
                <p className="mb-3">
                  Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion 
                  eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall 
                  werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
                </p>
                <p>
                  Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis Sie den 
                  Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches der frühere Zeitpunkt ist.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Rücksendung der Waren</h3>
                <p className="mb-3">
                  Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an 
                  dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns zurückzusenden oder zu übergeben. 
                  Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden.
                </p>
                <p className="mb-3">
                  Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.
                </p>
                <p>
                  Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen 
                  zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang 
                  mit ihnen zurückzuführen ist.
                </p>
              </div>
            </div>
          </div>

          {/* Muster-Widerrufsformular */}
          <div id="widerrufsformular" className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Muster-Widerrufsformular</h2>
            <p className="text-gray-700 text-sm mb-6">
              (Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden Sie es zurück.)
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">An</label>
                    <div className="bg-white p-3 rounded-lg text-sm text-gray-600 border">
                      <p>NOVA INDUKT GmbH</p>
                      <p>Industriestraße 123</p>
                      <p>12345 Berlin</p>
                      <p>E-Mail: widerruf@nova-indukt.de</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)</label>
                  <textarea 
                    rows={3}
                    placeholder="Artikelnummer und Bezeichnung der Ware(n)"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bestellt am (*)/erhalten am (*)</label>
                  <input 
                    type="date" 
                    className="w-full md:w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name des/der Verbraucher(s)</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Anschrift des/der Verbraucher(s)</label>
                  <textarea 
                    rows={2}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)</label>
                    <div className="h-20 bg-white border border-gray-300 rounded-lg border-dashed flex items-center justify-center text-gray-400 text-sm">
                      (Unterschrift)
                    </div>
                  </div>
                  <div className="flex items-end">
                    <p className="text-gray-500 text-xs">(*) Unzutreffendes streichen</p>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 text-sm text-gray-700">
                  <p className="font-medium mb-2">Hinweis:</p>
                  <p>
                    Dieses Formular können Sie ausfüllen, ausdrucken und per Post an die oben genannte Adresse 
                    senden. Alternativ können Sie uns Ihren Widerruf auch per E-Mail an widerruf@nova-indukt.de 
                    mitteilen. Eine telefonische Widerrufserklärung ist nicht ausreichend.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Ausgeschlossene Waren */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Vom Widerruf ausgeschlossene Waren</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung von Waren, die nicht vorgefertigt sind 
              und für deren Herstellung eine individuelle Wahl oder Bestimmung durch den Verbraucher maßgeblich ist 
              oder die eindeutig auf die persönlichen Bedürfnisse des Verbrauchers zugeschnitten sind.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Das Widerrufsrecht erlischt vorzeitig bei Verträgen zur Lieferung versiegelter Waren, die aus Gründen 
              des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet sind, wenn ihre Versiegelung nach 
              der Lieferung entfernt wurde.
            </p>
          </div>

          {/* Kontakt für Widerruf */}
          <div className="bg-[#4ECCA3]/10 rounded-2xl p-8 border-l-4 border-[#4ECCA3]">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">So erreichen Sie uns für Ihren Widerruf</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Per Post</h3>
                <p className="text-sm text-gray-700">
                  NOVA INDUKT GmbH<br />
                  Industriestraße 123<br />
                  12345 Berlin<br />
                  <span className="text-gray-500">Bitte vermerken: "Widerruf"</span>
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Per E-Mail</h3>
                <p className="text-sm text-gray-700">
                  widerruf@nova-indukt.de<br />
                  <span className="text-gray-500">Betreff: Widerruf - Bestellnummer</span>
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Per Telefax</h3>
                <p className="text-sm text-gray-700">
                  +49 (0) 30 12345679<br />
                  <span className="text-gray-500">Bitte Bestelldaten angeben</span>
                </p>
              </div>
            </div>
          </div>

          {/* Rücksendeadresse */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rücksendeadresse für Ware</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Deutschland</h3>
                <p className="text-sm text-gray-700">
                  NOVA INDUKT GmbH - Retouren<br />
                  Retourenabteilung<br />
                  Logistikstraße 45<br />
                  12345 Berlin
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Wichtige Hinweise</h3>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Bitte beilegen Sie eine Kopie der Rechnung oder Lieferschein</li>
                  <li>Verwenden Sie wenn möglich die Originalverpackung</li>
                  <li>Bitte vermerken Sie Ihre Bestellnummer deutlich</li>
                  <li>Senden Sie die Ware ausreichend frankiert</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bearbeitungszeit */}
          <div className="bg-gray-100 rounded-2xl p-6 text-center">
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">Bearbeitungszeit:</span> Wir bearbeiten Widerrufe innerhalb von 
              3-5 Werktagen nach Eingang. Die Rückzahlung erfolgt auf dem ursprünglichen Zahlungsweg.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
