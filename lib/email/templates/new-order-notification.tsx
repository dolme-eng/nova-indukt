import { Html, Head, Preview, Body, Container, Section, Text, Link, Hr, Row, Column } from '@react-email/components'
import { SHOP_DOMAIN } from '@/lib/constants/shop'

interface NewOrderNotificationEmailProps {
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number
  itemCount: number
  paymentMethod: string
  orderId: string
}

export default function NewOrderNotificationEmail({
  orderNumber,
  customerName,
  customerEmail,
  total,
  itemCount,
  paymentMethod,
  orderId,
}: NewOrderNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Neue Bestellung {orderNumber} — {total.toFixed(2)}€</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>NOVA INDUKT</Text>
            <Text style={headerSubtitle}>Neue Bestellung eingegangen</Text>
          </Section>

          <Section style={content}>
            <Text style={title}>Eine neue Bestellung wurde aufgegeben!</Text>

            <Section style={infoBox}>
              <Row>
                <Column>
                  <Text style={label}>Bestellnummer:</Text>
                  <Text style={valueBold}>{orderNumber}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={label}>Kunde:</Text>
                  <Text style={value}>{customerName} ({customerEmail})</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={label}>Artikel:</Text>
                  <Text style={value}>{itemCount} Artikel</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={label}>Gesamtsumme:</Text>
                  <Text style={valueBold}>{total.toFixed(2)}€</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={label}>Zahlungsmethode:</Text>
                  <Text style={value}>{paymentMethod === 'BANK_TRANSFER' ? 'Banküberweisung' : paymentMethod}</Text>
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            <Link
              href={`${SHOP_DOMAIN}/admin/bestellungen/${orderId}`}
              style={button}
            >
              Bestellung im Admin-Panel anzeigen
            </Link>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Dies ist eine automatische Benachrichtigung.
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} NOVA INDUKT. Alle Rechte vorbehalten.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f5f5f5',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
}

const header = {
  backgroundColor: '#0C211E',
  padding: '24px',
  textAlign: 'center' as const,
}

const brand = {
  color: '#4ECCA3',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
}

const headerSubtitle = {
  color: '#ffffff',
  fontSize: '14px',
  marginTop: '8px',
  opacity: 0.8,
}

const content = {
  padding: '32px 24px',
}

const title = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#0C211E',
  marginBottom: '24px',
}

const infoBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
}

const label = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#666666',
  textTransform: 'uppercase' as const,
  marginBottom: '4px',
  marginTop: '12px',
}

const value = {
  fontSize: '14px',
  color: '#0C211E',
  margin: '0',
}

const valueBold = {
  fontSize: '16px',
  fontWeight: '700',
  color: '#0C211E',
  margin: '0',
}

const hr = {
  borderColor: '#e5e5e5',
  margin: '24px 0',
}

const button = {
  backgroundColor: '#4ECCA3',
  color: '#0C211E',
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '14px',
  display: 'inline-block',
}

const footer = {
  backgroundColor: '#f5f5f5',
  padding: '24px',
  textAlign: 'center' as const,
}

const footerText = {
  fontSize: '12px',
  color: '#666666',
  margin: '4px 0',
}
