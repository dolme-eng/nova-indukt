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
import { SHOP_NAME, SUPPORT_EMAIL } from '@/lib/constants/shop'
import { getBankDetailsSync } from '@/lib/data/bank-details'

interface OrderItem {
  name: string
  quantity: number
  price: number
  image?: string
}

interface OrderConfirmationEmailProps {
  orderNumber: string
  customerName: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  paymentMethod?: string
  shippingAddress: {
    name: string
    street: string
    street2?: string
    postalCode: string
    city: string
    country: string
  }
  estimatedDelivery: string
}

export const OrderConfirmationEmail = ({
  orderNumber,
  customerName,
  items,
  subtotal,
  shipping,
  tax,
  total,
  paymentMethod,
  shippingAddress,
  estimatedDelivery,
}: OrderConfirmationEmailProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  const bank = getBankDetailsSync()

  return (
    <Html>
      <Head />
      <Preview>Ihre Bestellung bei NOVA INDUKT - {orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>{SHOP_NAME}</Heading>
          </Section>

          {/* Thank You */}
          <Section style={section}>
            <Heading style={h2}>Vielen Dank für Ihre Bestellung!</Heading>
            <Text style={text}>Hallo {customerName},</Text>
            <Text style={text}>
              Wir haben Ihre Bestellung erhalten und bearbeiten diese umgehend.
              Hier sind die Details zu Ihrer Bestellung:
            </Text>
          </Section>

          {/* Order Info */}
          <Section style={orderInfo}>
            <Row>
              <Column>
                <Text style={label}>Bestellnummer</Text>
                <Text style={value}>{orderNumber}</Text>
              </Column>
              <Column>
                <Text style={label}>Bestelldatum</Text>
                <Text style={value}>{new Date().toLocaleDateString('de-DE')}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Items */}
          <Section style={section}>
            <Heading style={h3}>Bestellte Artikel</Heading>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={itemColumn}>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemMeta}>Menge: {item.quantity}</Text>
                </Column>
                <Column style={priceColumn}>
                  <Text style={itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={hr} />

          {/* Totals */}
          <Section style={totalsSection}>
            <Row style={totalRow}>
              <Column style={totalLabel}>Zwischensumme</Column>
              <Column style={totalValue}>{formatPrice(subtotal)}</Column>
            </Row>
            <Row style={totalRow}>
              <Column style={totalLabel}>Versand</Column>
              <Column style={totalValue}>{shipping === 0 ? 'Kostenlos' : formatPrice(shipping)}</Column>
            </Row>
            <Row style={totalRow}>
              <Column style={totalLabel}>MwSt. (19%)</Column>
              <Column style={totalValue}>{formatPrice(tax)}</Column>
            </Row>
            <Row style={grandTotalRow}>
              <Column style={grandTotalLabel}>Gesamtsumme</Column>
              <Column style={grandTotalValue}>{formatPrice(total)}</Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Shipping Address */}
          <Section style={section}>
            <Heading style={h3}>Lieferadresse</Heading>
            <Text style={addressText}>
              {shippingAddress.name}
              <br />
              {shippingAddress.street}
              {shippingAddress.street2 && (
                <>
                  <br />
                  {shippingAddress.street2}
                </>
              )}
              <br />
              {shippingAddress.postalCode} {shippingAddress.city}
              <br />
              {shippingAddress.country}
            </Text>
          </Section>

          {/* Payment Info for Bank Transfer */}
          {paymentMethod === 'BANK_TRANSFER' && (
            <Section style={bankSection}>
              <Heading style={h3}>Zahlungsinformationen (Vorkasse)</Heading>
              <Text style={text}>
                Bitte überweisen Sie den Gesamtbetrag auf das folgende Konto:
              </Text>
              <Section style={bankDetailsCard}>
                <Row>
                  <Column style={bankLabel}>Kontoinhaber:</Column>
                  <Column style={bankValue}>{bank.holder}</Column>
                </Row>
                <Row>
                  <Column style={bankLabel}>IBAN:</Column>
                  <Column style={bankValue}>{bank.iban}</Column>
                </Row>
                <Row>
                  <Column style={bankLabel}>BIC:</Column>
                  <Column style={bankValue}>{bank.bic}</Column>
                </Row>
                <Row>
                  <Column style={bankLabel}>Bank:</Column>
                  <Column style={bankValue}>{bank.bankName}</Column>
                </Row>
                <Row>
                  <Column style={bankLabel}>Verwendungszweck:</Column>
                  <Column style={bankValue}>{orderNumber}</Column>
                </Row>
              </Section>
              <Text style={smallText}>
                Hinweis: Ihre Bestellung wird erst nach Zahlungseingang versendet.
              </Text>
            </Section>
          )}

          {/* Delivery Estimate */}
          <Section style={deliverySection}>
            <Text style={deliveryText}>
              Geschätzte Lieferung: <strong>{estimatedDelivery}</strong>
            </Text>
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Button
              href={`https://nova-indukt.de/mein-konto/orders`}
              style={button}
            >
              Bestellung verfolgen
            </Button>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Bei Fragen zu Ihrer Bestellung kontaktieren Sie uns unter{' '}
              <Link href={`mailto:${SUPPORT_EMAIL}`} style={link}>
                {SUPPORT_EMAIL}
              </Link>
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} {SHOP_NAME}. Alle Rechte vorbehalten.
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

const orderInfo = {
  backgroundColor: '#f7fafc',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '30px',
}

const label = {
  color: '#718096',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  marginBottom: '5px',
}

const value = {
  color: '#0C211E',
  fontSize: '16px',
  fontWeight: 'bold',
}

const hr = {
  borderColor: '#e2e8f0',
  margin: '30px 0',
}

const itemRow = {
  marginBottom: '15px',
}

const itemColumn = {
  width: '70%',
}

const priceColumn = {
  width: '30%',
  textAlign: 'right' as const,
}

const itemName = {
  color: '#0C211E',
  fontSize: '16px',
  fontWeight: '600',
  marginBottom: '5px',
}

const itemMeta = {
  color: '#718096',
  fontSize: '14px',
}

const itemPrice = {
  color: '#0C211E',
  fontSize: '16px',
  fontWeight: '600',
}

const totalsSection = {
  marginBottom: '30px',
}

const totalRow = {
  marginBottom: '10px',
}

const totalLabel = {
  color: '#718096',
  fontSize: '14px',
  width: '70%',
}

const totalValue = {
  color: '#0C211E',
  fontSize: '14px',
  width: '30%',
  textAlign: 'right' as const,
}

const grandTotalRow = {
  marginTop: '15px',
  paddingTop: '15px',
  borderTop: '2px solid #e2e8f0',
}

const grandTotalLabel = {
  color: '#0C211E',
  fontSize: '18px',
  fontWeight: 'bold',
  width: '70%',
}

const grandTotalValue = {
  color: '#0C211E',
  fontSize: '18px',
  fontWeight: 'bold',
  width: '30%',
  textAlign: 'right' as const,
}

const addressText = {
  color: '#4a5568',
  fontSize: '14px',
  lineHeight: '22px',
}

const deliverySection = {
  backgroundColor: '#4ECCA3',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center' as const,
  marginBottom: '30px',
}

const deliveryText = {
  color: '#0C211E',
  fontSize: '16px',
  margin: '0',
}

const ctaSection = {
  textAlign: 'center' as const,
  marginBottom: '30px',
}

const button = {
  backgroundColor: '#0C211E',
  color: '#ffffff',
  padding: '15px 30px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  display: 'inline-block',
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

const bankSection = {
  marginBottom: '30px',
  padding: '20px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  backgroundColor: '#f8fafc',
}

const bankDetailsCard = {
  marginBottom: '15px',
}

const bankLabel = {
  color: '#718096',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  width: '40%',
}

const bankValue = {
  color: '#0C211E',
  fontSize: '14px',
  fontWeight: 'bold',
  width: '60%',
}

const smallText = {
  color: '#718096',
  fontSize: '12px',
  lineHeight: '18px',
  fontStyle: 'italic',
}

export default OrderConfirmationEmail
