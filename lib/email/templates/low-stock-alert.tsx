import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Hr,
  Button,
} from '@react-email/components'
import * as React from 'react'

interface LowStockAlertEmailProps {
  lowStockProducts: Array<{
    id: string
    name: string
    stock: number
    category?: string
    adminUrl: string
  }>
  outOfStockProducts: Array<{
    id: string
    name: string
    category?: string
    adminUrl: string
  }>
  date: string
}

export const LowStockAlertEmail = ({
  lowStockProducts,
  outOfStockProducts,
  date,
}: LowStockAlertEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>⚠️ Lagerbestands-Warnung - {date}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>⚠️ Lagerbestand-Alert</Heading>
          </Section>

          {/* Summary */}
          <Section style={section}>
            <Text style={text}>
              Dies ist die automatische Lagerbestands-Überwachung für <strong>{date}</strong>.
            </Text>
          </Section>

          {/* Low Stock Section */}
          {lowStockProducts.length > 0 && (
            <>
              <Section style={alertSection}>
                <Heading style={h2}>🔴 Niedriger Bestand ({lowStockProducts.length} Produkte)</Heading>
                <Text style={alertText}>
                  Diese Produkte haben weniger als 5 Einheiten auf Lager:
                </Text>
              </Section>

              <Section style={tableSection}>
                <Row style={tableHeader}>
                  <Column style={colProduct}>Produkt</Column>
                  <Column style={colCategory}>Kategorie</Column>
                  <Column style={colStock}>Bestand</Column>
                  <Column style={colAction}>Aktion</Column>
                </Row>
                
                {lowStockProducts.map((product) => (
                  <Row key={product.id} style={tableRow}>
                    <Column style={colProduct}>
                      <Text style={productName}>{product.name}</Text>
                    </Column>
                    <Column style={colCategory}>
                      <Text style={cellText}>{product.category || '-'}</Text>
                    </Column>
                    <Column style={colStock}>
                      <Text style={{ ...cellText, color: '#E17055', fontWeight: 'bold' }}>
                        {product.stock}
                      </Text>
                    </Column>
                    <Column style={colAction}>
                      <Button href={product.adminUrl} style={actionButton}>
                        Bearbeiten
                      </Button>
                    </Column>
                  </Row>
                ))}
              </Section>

              <Hr style={hr} />
            </>
          )}

          {/* Out of Stock Section */}
          {outOfStockProducts.length > 0 && (
            <>
              <Section style={dangerSection}>
                <Heading style={h2}>🚫 Außerhalb des Lagers ({outOfStockProducts.length} Produkte)</Heading>
                <Text style={dangerText}>
                  Diese Produkte sind jetzt <strong>vergriffen</strong> und wurden automatisch deaktiviert:
                </Text>
              </Section>

              <Section style={tableSection}>
                <Row style={tableHeader}>
                  <Column style={colProduct}>Produkt</Column>
                  <Column style={colCategory}>Kategorie</Column>
                  <Column style={colAction}>Aktion</Column>
                </Row>
                
                {outOfStockProducts.map((product) => (
                  <Row key={product.id} style={tableRow}>
                    <Column style={colProduct}>
                      <Text style={productName}>{product.name}</Text>
                    </Column>
                    <Column style={colCategory}>
                      <Text style={cellText}>{product.category || '-'}</Text>
                    </Column>
                    <Column style={colAction}>
                      <Button href={product.adminUrl} style={actionButton}>
                        Nachbestellen
                      </Button>
                    </Column>
                  </Row>
                ))}
              </Section>

              <Hr style={hr} />
            </>
          )}

          {/* No Issues */}
          {lowStockProducts.length === 0 && outOfStockProducts.length === 0 && (
            <Section style={successSection}>
              <Heading style={successH2}>✅ Alles in Ordnung</Heading>
              <Text style={successText}>
                Alle Produkte haben ausreichend Lagerbestand. Keine Maßnahmen erforderlich.
              </Text>
            </Section>
          )}

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Dies ist eine automatische Benachrichtigung des NOVA INDUKT Systems.
            </Text>
            <Text style={footerText}>
              Nächste Prüfung: Morgen um 09:00 Uhr
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default LowStockAlertEmail

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px',
  maxWidth: '700px',
}

const header = {
  backgroundColor: '#E17055',
  padding: '20px',
  borderRadius: '8px 8px 0 0',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
}

const section = {
  padding: '20px 0',
}

const text = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
}

const hr = {
  borderColor: '#e2e8f0',
  margin: '20px 0',
}

const alertSection = {
  backgroundColor: '#FFF5F5',
  border: '1px solid #FED7D7',
  borderRadius: '8px',
  padding: '16px',
}

const h2 = {
  color: '#C53030',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px',
}

const alertText = {
  color: '#742A2A',
  fontSize: '14px',
  margin: '0',
}

const tableSection = {
  padding: '10px 0',
}

const tableHeader = {
  borderBottom: '2px solid #e2e8f0',
  padding: '10px 0',
}

const tableRow = {
  borderBottom: '1px solid #e2e8f0',
  padding: '12px 0',
}

const colProduct = { width: '40%' }
const colCategory = { width: '25%' }
const colStock = { width: '15%', textAlign: 'center' as const }
const colAction = { width: '20%', textAlign: 'right' as const }

const productName = {
  color: '#0C211E',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
}

const cellText = {
  color: '#4a5568',
  fontSize: '14px',
  margin: '0',
}

const actionButton = {
  backgroundColor: '#4ECCA3',
  color: '#0C211E',
  padding: '6px 12px',
  borderRadius: '4px',
  textDecoration: 'none',
  fontSize: '12px',
  fontWeight: 'bold',
}

const dangerSection = {
  backgroundColor: '#FFF5F5',
  border: '1px solid #FED7D7',
  borderLeft: '4px solid #E53E3E',
  borderRadius: '8px',
  padding: '16px',
}

const dangerText = {
  color: '#742A2A',
  fontSize: '14px',
  margin: '0',
}

const successSection = {
  backgroundColor: '#F0FFF4',
  border: '1px solid #9AE6B4',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center' as const,
}

const successH2 = {
  color: '#276749',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 12px',
}

const successText = {
  color: '#2F855A',
  fontSize: '16px',
  margin: '0',
}

const footer = {
  textAlign: 'center' as const,
  padding: '20px 0',
}

const footerText = {
  color: '#718096',
  fontSize: '12px',
  margin: '4px 0',
}
