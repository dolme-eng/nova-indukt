import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Row,
  Column,
  Hr,
  Link,
} from '@react-email/components'
import * as React from 'react'

interface ShippingNotificationEmailProps {
  orderNumber: string
  customerName: string
  trackingNumber: string
  carrier: string
  trackingUrl: string
  items: Array<{ name: string; quantity: number }>
  shippingAddress: {
    name: string
    street: string
    city: string
    postalCode: string
  }
}

export const ShippingNotificationEmail = ({
  orderNumber,
  customerName,
  trackingNumber,
  carrier,
  trackingUrl,
  items,
  shippingAddress,
}: ShippingNotificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Ihre Bestellung wurde versandt! - {orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>NOVA INDUKT</Heading>
          </Section>

          {/* Main Content */}
          <Section style={section}>
            <Heading style={h2}>Ihre Bestellung ist unterwegs!</Heading>
            <Text style={text}>Hallo {customerName},</Text>
            <Text style={text}>
              Gute Nachrichten! Ihre Bestellung <strong>#{orderNumber}</strong> wurde soeben von unserem Lager versandt.
            </Text>
          </Section>

          {/* Tracking Info */}
          <Section style={trackingSection}>
            <Heading style={h3}>Sendungsverfolgung</Heading>
            <Row style={infoRow}>
              <Column style={infoLabel}>Tracking-Nummer</Column>
              <Column style={infoValue}>{trackingNumber}</Column>
            </Row>
            <Row style={infoRow}>
              <Column style={infoLabel}>Versanddienstleister</Column>
              <Column style={infoValue}>{carrier}</Column>
            </Row>
            <Section style={buttonSection}>
              <Button href={trackingUrl} style={button}>
                Sendung verfolgen
              </Button>
            </Section>
          </Section>

          <Hr style={hr} />

          {/* Items Summary */}
          <Section style={section}>
            <Heading style={h3}>Versandte Artikel</Heading>
            {items.map((item, index) => (
              <Text key={index} style={itemText}>
                • {item.name} (Menge: {item.quantity})
              </Text>
            ))}
          </Section>

          {/* Shipping Address */}
          <Section style={addressSection}>
            <Heading style={h3}>Lieferadresse</Heading>
            <Text style={addressText}>
              {shippingAddress.name}
              <br />
              {shippingAddress.street}
              <br />
              {shippingAddress.postalCode} {shippingAddress.city}
            </Text>
          </Section>

          {/* Info Box */}
          <Section style={infoBox}>
            <Text style={infoText}>
              Die geschätzte Lieferzeit beträgt 2-3 Werktage innerhalb Deutschlands. 
              Sie erhalten weitere Updates, sobald Ihre Sendung die nächsten Stationen erreicht.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Bei Fragen zu Ihrer Sendung kontaktieren Sie uns unter{' '}
              <Link href="mailto:support@nova-indukt.de" style={link}>
                support@nova-indukt.de
              </Link>
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

// Styles
const main = {
  backgroundColor: '#f5f5f5',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
}

const header = {
  backgroundColor: '#0C211E',
  padding: '30px 20px',
  textAlign: 'center' as const,
  margin: '-20px -20px 30px -20px',
}

const h1 = {
  color: '#4ECCA3',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  letterSpacing: '2px',
}

const section = {
  marginBottom: '30px',
}

const h2 = {
  color: '#0C211E',
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
}

const h3 = {
  color: '#0C211E',
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '15px',
}

const text = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '10px',
}

const trackingSection = {
  backgroundColor: '#4ECCA3',
  padding: '25px',
  borderRadius: '8px',
  marginBottom: '30px',
}

const infoRow = {
  marginBottom: '10px',
}

const infoLabel = {
  color: '#0C211E',
  fontSize: '14px',
  fontWeight: '600',
  width: '40%',
}

const infoValue = {
  color: '#0C211E',
  fontSize: '14px',
  width: '60%',
}

const buttonSection = {
  marginTop: '20px',
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#0C211E',
  color: '#4ECCA3',
  padding: '15px 30px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  display: 'inline-block',
}

const hr = {
  borderColor: '#e2e8f0',
  margin: '30px 0',
}

const itemText = {
  color: '#4a5568',
  fontSize: '14px',
  marginBottom: '5px',
}

const addressSection = {
  backgroundColor: '#f7fafc',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '30px',
}

const addressText = {
  color: '#4a5568',
  fontSize: '14px',
  lineHeight: '22px',
}

const infoBox = {
  backgroundColor: '#fffaf0',
  border: '1px solid #fed7aa',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '30px',
}

const infoText = {
  color: '#c05621',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
}

const footer = {
  borderTop: '1px solid #e2e8f0',
  paddingTop: '30px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#718096',
  fontSize: '14px',
  marginBottom: '10px',
}

const link = {
  color: '#4ECCA3',
  textDecoration: 'none',
}

export default ShippingNotificationEmail
