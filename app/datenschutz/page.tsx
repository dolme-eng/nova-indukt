import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | NOVA INDUKT',
  description: 'Datenschutzerklärung der NOVA INDUKT GmbH gemäß DSGVO',
}

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Datenschutzerklärung</h1>
        
        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-8">
          <p className="text-gray-600 text-sm">
            Stand: 15. März 2026
          </p>

          {/* Einleitung */}
          <section>
            <p className="text-gray-700 text-sm leading-relaxed">
              Wir freuen uns über Ihr Interesse an unserem Online-Shop. Der Schutz Ihrer Privatsphäre ist für uns 
              sehr wichtig. Nachstehend informieren wir Sie ausführlich über den Umgang mit Ihren Daten.
            </p>
          </section>

          {/* Verantwortlicher */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Verantwortlicher und Datenschutzbeauftragter</h2>
            <div className="space-y-2 text-gray-700 text-sm leading-relaxed">
              <p className="font-medium">Verantwortlicher:</p>
              <p>NOVA INDUKT GmbH</p>
              <p>Industriestraße 123</p>
              <p>12345 Berlin</p>
              <p>Deutschland</p>
              <p className="mt-2">E-Mail: datenschutz@nova-indukt.de</p>
              <p>Telefon: +49 (0) 30 12345678</p>
              
              <p className="font-medium mt-4">Datenschutzbeauftragter:</p>
              <p>Max Mustermann</p>
              <p>E-Mail: datenschutz@nova-indukt.de</p>
            </div>
          </section>

          {/* Erhebung und Speicherung */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Erhebung und Speicherung personenbezogener Daten sowie Art und Zweck der Verwendung</h2>
            
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 text-sm">a) Beim Besuch der Website</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Beim Aufrufen unserer Website werden durch den auf Ihrem Endgerät zum Einsatz kommenden Browser 
                automatisch Informationen an den Server unserer Website gesendet. Diese Informationen werden 
                temporär in einem sogenannten Logfile gespeichert. Folgende Informationen werden dabei ohne 
                Ihr Zutun erfasst und bis zur automatisierten Löschung gespeichert:
              </p>
              <ul className="list-disc list-inside ml-4 text-gray-700 text-sm space-y-1">
                <li>IP-Adresse des anfordernden Rechners</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Name und URL der abgerufenen Datei</li>
                <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
                <li>Verwendeter Browser und ggf. das Betriebssystem Ihres Rechners</li>
                <li>Name Ihres Access-Providers</li>
              </ul>
              <p className="text-gray-700 text-sm leading-relaxed">
                Die genannten Daten werden durch uns zu folgenden Zwecken verarbeitet:
              </p>
              <ul className="list-disc list-inside ml-4 text-gray-700 text-sm space-y-1">
                <li>Gewährleistung eines reibungslosen Verbindungsaufbaus der Website</li>
                <li>Gewährleistung einer komfortablen Nutzung unserer Website</li>
                <li>Auswertung der Systemsicherheit und -stabilität</li>
                <li>Zu weiteren administrativen Zwecken</li>
              </ul>
              <p className="text-gray-700 text-sm leading-relaxed">
                Rechtsgrundlage für die Datenverarbeitung ist Art. 6 Abs. 1 S. 1 lit. f DSGVO. Unser 
                berechtigtes Interesse folgt aus oben aufgelisteten Zwecken zur Datenerhebung.
              </p>

              <h3 className="font-medium text-gray-900 text-sm mt-4">b) Bei Bestellung oder Eröffnung eines Kundenkontos</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Bei Bestellung über unseren Internet-Shop oder Eröffnung eines Kundenkontos erheben wir 
                folgende personenbezogene Daten:
              </p>
              <ul className="list-disc list-inside ml-4 text-gray-700 text-sm space-y-1">
                <li>Anrede, Vorname, Nachname</li>
                <li>Eine gültige E-Mail-Adresse</li>
                <li>Rechnungs- und Lieferanschrift</li>
                <li>Telefonnummer (optional)</li>
                <li>Bankverbindung/Zahlungsdaten</li>
                <li>Bestelldaten (Artikel, Menge, Preis)</li>
              </ul>
              <p className="text-gray-700 text-sm leading-relaxed">
                Die Erhebung dieser Daten erfolgt, um den Vertrag zu erfüllen (Art. 6 Abs. 1 S. 1 lit. b DSGVO) 
                und Ihnen die gewünschten Produkte zu liefern.
              </p>
            </div>
          </section>

          {/* Weitergabe von Daten */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Weitergabe von Daten</h2>
            <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den im Folgenden aufgeführten 
                Zwecken findet nicht statt.
              </p>
              <p>
                Wir geben Ihre persönlichen Daten nur an Dritte weiter, wenn:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Sie Ihre ausdrückliche Einwilligung dazu erteilt haben (Art. 6 Abs. 1 S. 1 lit. a DSGVO)</li>
                <li>die Weitergabe zur Erfüllung von vertraglichen Pflichten erforderlich ist (Art. 6 Abs. 1 S. 1 lit. b DSGVO)</li>
                <li>für die Weitergabe eine gesetzliche Verpflichtung besteht (Art. 6 Abs. 1 S. 1 lit. c DSGVO)</li>
                <li>die Weitergabe zur Wahrung berechtigter Interessen erforderlich ist (Art. 6 Abs. 1 S. 1 lit. f DSGVO)</li>
              </ul>
              <p>
                Empfänger personenbezogener Daten können sein:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Versanddienstleister (DHL, DPD, UPS) zur Zustellung der Ware</li>
                <li>Zahlungsdienstleister (PayPal, Klarna, Stripe) zur Abwicklung von Zahlungen</li>
                <li>Webhosting-Provider (zur technischen Bereitstellung der Website)</li>
                <li>IT-Dienstleister (zur Wartung unserer Systeme)</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Cookies</h2>
            <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                Wir setzen auf unserer Website Cookies ein. Cookies sind kleine Dateien, die Ihr Browser 
                automatisch erstellt und die auf Ihrem Endgerät gespeichert werden.
              </p>
              <p>
                Wir verwenden folgende Cookie-Kategorien:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Notwendige Cookies:</strong> Erforderlich für den Betrieb der Website (Warenkorb, Login)</li>
                <li><strong>Analyse-Cookies:</strong> Statistische Auswertungen zur Optimierung (Google Analytics)</li>
                <li><strong>Marketing-Cookies:</strong> Personalisierte Werbung (Facebook Pixel, Google Ads)</li>
              </ul>
              <p>
                Die genauen verwendeten Cookies und Ihre Einstellungsmöglichkeiten finden Sie in unserem 
                Cookie-Banner und unter Einstellungen.
              </p>
            </div>
          </section>

          {/* Betroffenenrechte */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Betroffenenrechte</h2>
            <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>Sie haben das Recht:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  <strong>Auskunft (Art. 15 DSGVO):</strong> Über Ihre bei uns gespeicherten personenbezogenen 
                  Daten einschließlich Herkunft, Empfänger und Zweck der Verarbeitung.
                </li>
                <li>
                  <strong>Berichtigung (Art. 16 DSGVO):</strong> Unverzügliche Berichtigung unrichtiger Daten 
                  oder Vervollständigung Ihrer bei uns gespeicherten Daten.
                </li>
                <li>
                  <strong>Löschung (Art. 17 DSGVO):</strong> Löschung Ihrer bei uns gespeicherten Daten, soweit 
                  nicht die Verarbeitung zur Erfüllung einer rechtlichen Verpflichtung erforderlich ist.
                </li>
                <li>
                  <strong>Einschränkung (Art. 18 DSGVO):</strong> Einschränkung der Verarbeitung, wenn die 
                  Richtigkeit der Daten bestritten wird oder die Verarbeitung unrechtmäßig ist.
                </li>
                <li>
                  <strong>Datenübertragbarkeit (Art. 20 DSGVO):</strong> Erhalt Ihrer Daten in einem strukturierten, 
                  gängigen und maschinenlesbaren Format.
                </li>
                <li>
                  <strong>Widerruf (Art. 7 Abs. 3 DSGVO):</strong> Ihre einmal erteilte Einwilligung jederzeit 
                  gegenüber uns zu widerrufen.
                </li>
                <li>
                  <strong>Beschwerde (Art. 77 DSGVO):</strong> Sich bei der Aufsichtsbehörde zu beschweren, 
                  wenn Sie der Ansicht sind, dass die Verarbeitung gegen die DSGVO verstößt.
                </li>
              </ul>
            </div>
          </section>

          {/* Widerrufsrecht bei Einwilligung */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Widerrufsrecht bei Einwilligungen</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Haben Sie uns eine Einwilligung erteilt, können Sie diese jederzeit mit Wirkung für die Zukunft 
              widerrufen. Die Rechtmäßigkeit der aufgrund der Einwilligung bis zum Widerruf erfolgten Verarbeitung 
              bleibt davon unberührt. Sie können den Widerruf über folgende Kanäle erklären:
            </p>
            <ul className="list-disc list-inside ml-4 text-gray-700 text-sm space-y-1 mt-2">
              <li>E-Mail an: datenschutz@nova-indukt.de</li>
              <li>Post an die oben genannte Adresse</li>
              <li>Cookie-Einstellungen auf der Website anpassen</li>
            </ul>
          </section>

          {/* Datensicherheit */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Datensicherheit</h2>
            <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren (Secure Socket Layer) 
                in Verbindung mit der jeweils höchsten Verschlüsselungsstufe, die von Ihrem Browser unterstützt wird.
              </p>
              <p>
                Darüber hinaus setzen wir technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten 
                gegen zufällige oder vorsätzliche Manipulationen, teilweisen oder vollständigen Verlust, Zerstörung 
                oder gegen den unbefugten Zugriff Dritter zu schützen.
              </p>
            </div>
          </section>

          {/* Dauer der Speicherung */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Dauer der Speicherung</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Personenbezogene Daten werden gelöscht oder gesperrt, sobald der Zweck der Speicherung entfällt. 
              Eine Speicherung kann darüber hinaus erfolgen, wenn dies durch den europäischen oder nationalen 
              Gesetzgeber in unionsrechtlichen Verordnungen, Gesetzen oder sonstigen Vorschriften, denen der 
              Verantwortliche unterliegt, vorgesehen wurde. Sperrung oder Löschung der Daten erfolgt auch, wenn 
              eine durch die genannten Normen vorgeschriebene Speicherfrist abläuft, es sei denn, dass eine 
              Erforderlichkeit zur weiteren Speicherung der Daten für einen Vertragsabschluss oder eine 
              Vertragserfüllung besteht.
            </p>
          </section>

          {/* Kontaktformular */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Kontaktformular und E-Mail-Kontakt</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Auf unserer Website ist ein Kontaktformular vorhanden, welches für die elektronische Kontaktaufnahme 
              genutzt werden kann. Nehmen Sie dieses Angebot wahr, so werden die in der Eingabemaske eingegebenen 
              Daten an uns übermittelt und gespeichert. Rechtsgrundlage für die Verarbeitung ist Art. 6 Abs. 1 
              lit. f DSGVO. Die Verarbeitung der personenbezogenen Daten aus der Eingabemaske dient uns allein 
              zur Bearbeitung der Kontaktaufnahme.
            </p>
          </section>

          {/* Newsletter */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Newsletter</h2>
            <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                Auf unserer Website besteht die Möglichkeit, einen kostenfreien Newsletter zu abonnieren. 
                Dabei werden die von der Eingabemaske an uns übermittelten Daten übernommen. Für die 
                Verarbeitung der Daten wird im Rahmen des Anmeldevorgangs Ihre Einwilligung eingeholt 
                und auf diese Datenschutzerklärung verwiesen.
              </p>
              <p>
                Rechtsgrundlage für die Verarbeitung der Daten nach Anmeldung zum Newsletter ist bei Vorliegen 
                einer Einwilligung des Nutzers Art. 6 Abs. 1 lit. a DSGVO. Das Abonnement des Newsletters 
                können Sie jederzeit über den Abmeldelink im Newsletter oder durch Nachricht an uns widerrufen.
              </p>
            </div>
          </section>

          {/* Änderung der Datenschutzerklärung */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Änderung der Datenschutzerklärung</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen 
              rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der 
              Datenschutzerklärung umzusetzen. Für Ihren erneuten Besuch gilt dann die neue 
              Datenschutzerklärung.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
