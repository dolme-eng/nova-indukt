import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AGB - Allgemeine Geschäftsbedingungen | NOVA INDUKT',
  description: 'Allgemeine Geschäftsbedingungen der NOVA INDUKT GmbH',
}

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Allgemeine Geschäftsbedingungen</h1>
        
        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-8">
          <p className="text-gray-600 text-sm">
            Stand: 15. März 2026
          </p>

          {/* § 1 Geltungsbereich */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">§ 1 Geltungsbereich</h2>
            <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                (1) Die folgenden Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") gelten für alle Verträge, 
                die ein Verbraucher oder Unternehmer (nachfolgend "Kunde") mit NOVA INDUKT GmbH, Industriestraße 123, 
                12345 Berlin, Deutschland (nachfolgend "Anbieter") über die im Internet-Shop des Anbieters dargestellten 
                Waren und/oder Dienstleistungen abschließt.
              </p>
              <p>
                (2) Maßgeblich ist jeweils die zum Zeitpunkt des Vertragsschlusses gültige Fassung der AGB.
              </p>
              <p>
                (3) Allgemeine Geschäftsbedingungen des Kunden finden keine Anwendung, es sei denn, ihre Geltung 
                wurde ausdrücklich schriftlich vereinbart.
              </p>
            </div>
          </section>

          {/* § 2 Vertragsschluss */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">§ 2 Vertragsschluss</h2>
            <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                (1) Die Darstellung der Produkte im Internet-Shop stellt kein rechtlich bindendes Angebot, 
                sondern eine Aufforderung zur Abgabe einer Bestellung dar.
              </p>
              <p>
                (2) Mit der Absendung der Bestellung über das Online-Bestellformular des Internet-Shops gibt der 
                Kunde ein rechtsverbindliches Angebot zum Abschluss eines Kaufvertrages ab.
              </p>
              <p>
                (3) Der Anbieter bestätigt den Eingang der Bestellung des Kunden durch eine automatisch generierte 
                E-Mail (Eingangsbestätigung). Diese Eingangsbestätigung stellt noch keine Vertragsannahme dar.
              </p>
              <p>
                (4) Der Vertrag kommt zustande, wenn der Anbieter die Annahme des Angebots durch eine ausdrückliche 
                Erklärung oder durch Auslieferung der Ware bestätigt.
              </p>
            </div>
          </section>

          {/* § 3 Preise und Zahlung */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">§ 3 Preise und Zahlung</h2>
            <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                (1) Alle angegebenen Preise verstehen sich in Euro (€) und enthalten die gesetzliche 
                Mehrwertsteuer von derzeit 19%. Versandkosten werden gesondert berechnet und sind auf der 
                Produktseite und im Warenkorb ersichtlich.
              </p>
              <p>
                (2) Die folgenden Zahlungsarten sind verfügbar:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Kreditkarte (Visa, Mastercard, American Express)</li>
                <li>PayPal</li>
                <li>Sofortüberweisung / Klarna</li>
                <li>Apple Pay</li>
                <li>Google Pay</li>
                <li>Kauf auf Rechnung (für Bestandskunden nach Prüfung)</li>
              </ul>
              <p>
                (3) Bei Zahlung per Kreditkarte erfolgt die Belastung des Kontos mit Vertragsschluss.
              </p>
              <p>
                (4) Der Kunde verpflichtet sich, die angegebenen Kontodaten korrekt und vollständig anzugeben.
              </p>
            </div>
          </section>

          {/* § 4 Lieferung */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">§ 4 Lieferung, Versandkosten</h2>
            <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                (1) Die Lieferung erfolgt innerhalb Deutschlands und in EU-Länder.
              </p>
              <p>
                (2) Die Versandkosten betragen:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Deutschland: 5,90 € (ab 500 € Warenwert versandkostenfrei)</li>
                <li>EU-Länder: 14,90 €</li>
              </ul>
              <p>
                (3) Die Lieferzeit beträgt innerhalb Deutschlands 2-3 Werktage, innerhalb der EU 5-10 Werktage, 
                sofern am Lager. Sollte ein Artikel kurzfristig nicht lieferbar sein, wird der Kunde unverzüglich 
                informiert.
              </p>
              <p>
                (4) Das Lieferrisiko trägt der Anbieter, soweit der Kunde Verbraucher ist.
              </p>
            </div>
          </section>

          {/* § 5 Eigentumsvorbehalt */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">§ 5 Eigentumsvorbehalt</h2>
            <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                (1) Bis zur vollständigen Bezahlung aller Forderungen aus dem Kaufvertrag bleibt die gelieferte 
                Ware Eigentum des Anbieters.
              </p>
              <p>
                (2) Bei Unternehmern gilt darüber hinaus: Der Anbieter behält sich das Eigentum an der Ware vor, 
                bis alle Forderungen aus der laufenden Geschäftsbeziehung beglichen sind.
              </p>
            </div>
          </section>

          {/* § 6 Widerrufsrecht */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">§ 6 Widerrufsrecht</h2>
            <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                (1) Verbraucher haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag 
                zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von 
                Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben.
              </p>
              <p>
                (2) Die Einzelheiten zum Widerrufsrecht finden Sie in unserer Widerrufsbelehrung unter 
                <a href="/widerruf" className="text-[#4ECCA3] hover:underline ml-1">/widerruf</a>.
              </p>
            </div>
          </section>

          {/* § 7 Gewährleistung */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">§ 7 Gewährleistung und Garantie</h2>
            <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                (1) Es gilt die gesetzliche Gewährleistungspflicht. Die Gewährleistungsfrist beträgt bei 
                Verbrauchern zwei Jahre ab Übergabe der Ware.
              </p>
              <p>
                (2) Für sämtliche Produkte gewährt NOVA INDUKT GmbH zusätzlich eine Herstellergarantie von 
                24 Monaten ab Kaufdatum. Die Garantie deckt Material- und Herstellungsfehler ab. Sie gilt 
                weltweit und ist auf den ursprünglichen Käufer übertragbar.
              </p>
              <p>
                (3) Von der Garantie ausgeschlossen sind Schäden durch:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Normale Abnutzung</li>
                <li>Missbrauch oder unsachgemäße Behandlung</li>
                <li>Nichtbeachtung der Gebrauchsanweisung</li>
                <li>Äußere Einwirkungen (Fehlbedienung, Unfall)</li>
              </ul>
            </div>
          </section>

          {/* § 8 Haftung */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">§ 8 Haftung</h2>
            <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                (1) Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie bei 
                Fehlen einer zugesicherten Eigenschaft.
              </p>
              <p>
                (2) Bei leichter Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher 
                Vertragspflichten (Kardinalpflichten), deren Verletzung die Erreichung des Vertragszwecks 
                gefährdet, oder bei Verletzung von Pflichten, deren Erfüllung die ordnungsgemäße Durchführung 
                des Vertrags überhaupt erst ermöglichen und auf deren Einhaltung der Kunde regelmäßig vertrauen darf.
              </p>
              <p>
                (3) Die Haftung für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit 
                bleibt unberührt.
              </p>
            </div>
          </section>

          {/* § 9 Datenschutz */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">§ 9 Datenschutz</h2>
            <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                (1) Der Anbieter erhebt, verarbeitet und nutzt personenbezogene Daten des Kunden nur im 
                Rahmen der gesetzlichen Bestimmungen, insbesondere der Datenschutz-Grundverordnung (DSGVO).
              </p>
              <p>
                (2) Einzelheiten zum Datenschutz finden Sie in unserer Datenschutzerklärung unter 
                <a href="/datenschutz" className="text-[#4ECCA3] hover:underline ml-1">/datenschutz</a>.
              </p>
            </div>
          </section>

          {/* § 10 Salvatorische Klausel */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">§ 10 Salvatorische Klausel</h2>
            <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise unwirksam sein oder werden, 
                berührt dies nicht die Wirksamkeit der übrigen Bestimmungen. Anstelle der unwirksamen 
                Bestimmung tritt eine wirksame Regelung, die dem wirtschaftlichen Zweck der unwirksamen 
                Bestimmung möglichst nahekommt.
              </p>
            </div>
          </section>

          {/* § 11 Anwendbares Recht und Gerichtsstand */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">§ 11 Anwendbares Recht und Gerichtsstand</h2>
            <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
              </p>
              <p>
                (2) Ist der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches 
                Sondervermögen, ist ausschließlicher Gerichtsstand für alle Streitigkeiten aus diesem 
                Vertragsverhältnis der Sitz des Anbieters in Berlin.
              </p>
              <p>
                (3) Dies gilt auch, wenn der Kunde keinen allgemeinen Gerichtsstand in Deutschland hat oder 
                der Wohnsitz oder gewöhnliche Aufenthalt zum Zeitpunkt der Klageerhebung nicht bekannt ist.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
