import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
} from '@react-email/components'
import * as React from 'react'
import { SHOP_NAME, SUPPORT_EMAIL } from '@/lib/constants/shop'

interface OrderCancellationEmailProps {
  orderNumber: string
  customerName: string
  total: number
  reason?: string
}

export const OrderCancellationEmail = ({
  orderNumber,
  customerName,
  total,
  reason,
}: OrderCancellationEmailProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  return (
    <Html>
      <Head />
      <Preview>Ihre Bestellung {orderNumber} wurde storniert - {SHOP_NAME}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>{SHOP_NAME}</Heading>
          </Section>

          <Section style={section}>
            <Heading style={h2}>Bestellung storniert</Heading>
            <Text style={text}>Hallo {customerName},</Text>
            <Text style={text}>
              Ihre Bestellung <strong>{orderNumber}</strong> wurde erfolgreich storniert.
            </Text>
            {reason && (
              <Text style={text}>
                Grund: {reason}
              </Text>
            )}
          </Section>

          <Section style={infoBox}>
            <Text style={infoLabel}>Stornierte Bestellung</Text>
            <Text style={infoValue}>{orderNumber}</Text>
            <Text style={infoLabel}>Betrag</Text>
            <Text style={infoValue}>{formatPrice(total)}</Text>
          </Section>

          <Section style={section}>
            <Text style={text}>
              Falls eine Zahlung bereits erfolgt ist, wird der Betrag innerhalb von 5-10 Werktagen
              auf Ihr ursprüngliches Zahlungsmittel zurückerstattet.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={text}>
              Haben Sie Fragen? Kontaktieren Sie uns unter{' '}
              <Link href={`mailto:${SUPPORT_EMAIL}`} style={link}>
                {SUPPORT_EMAIL}
              </Link>
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} {SHOP_NAME}. Alle Rechte vorbehalten.
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

const text = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '10px',
}

const infoBox = {
  backgroundColor: '#fef2f2',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '30px',
  borderLeft: '4px solid #E17055',
}

const infoLabel = {
  color: '#718096',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  marginBottom: '5px',
}

const infoValue = {
  color: '#0C211E',
  fontSize: '16px',
  fontWeight: 'bold',
  marginBottom: '15px',
}

const hr = {
  borderColor: '#e2e8f0',
  margin: '30px 0',
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

export default OrderCancellationEmail
