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
  Hr,
  Link,
} from '@react-email/components'
import * as React from 'react'

interface WelcomeEmailProps {
  firstName: string
  unsubscribeUrl: string
}

export const WelcomeEmail = ({
  firstName,
  unsubscribeUrl,
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Willkommen bei NOVA INDUKT! Ihr 10% Rabatt wartet auf Sie 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>NOVA INDUKT</Heading>
            <Text style={tagline}>Premium-Induktionskochgeschirr</Text>
          </Section>

          {/* Welcome */}
          <Section style={heroSection}>
            <Heading style={h2}>Willkommen, {firstName}!</Heading>
            <Text style={heroText}>
              Vielen Dank für Ihre Anmeldung zum NOVA INDUKT Newsletter. 
              Ab sofort erhalten Sie exklusive Angebote, neue Produktneuheiten 
              und Expertentipps rund um das Thema Induktionskochen.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Discount Code */}
          <Section style={discountSection}>
            <Heading style={discountTitle}>🎁 Ihr Willkommensgeschenk</Heading>
            <Text style={discountText}>
              Als Dankeschön für Ihre Anmeldung schenken wir Ihnen:
            </Text>
            <Section style={codeBox}>
              <Text style={codeLabel}>Ihr Rabattcode:</Text>
              <Text style={code}>WILLKOMMEN10</Text>
              <Text style={codeValue}>10% Rabatt auf Ihre erste Bestellung</Text>
            </Section>
            <Button
              href="https://nova-indukt.de/produkte"
              style={ctaButton}
            >
              Jetzt shoppen 🛒
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Benefits */}
          <Section style={benefitsSection}>
            <Heading style={h3}>Das erwartet Sie:</Heading>
            
            <Section style={benefitItem}>
              <Text style={benefitTitle}>🔥 Exklusive Flash Deals</Text>
              <Text style={benefitText}>
                Als Newsletter-Abonnent erhalten Sie Zugang zu zeitlich begrenzten Angeboten 
                mit bis zu 30% Rabatt.
              </Text>
            </Section>

            <Section style={benefitItem}>
              <Text style={benefitTitle}>📧 Neue Produkte zuerst</Text>
              <Text style={benefitText}>
                Erfahren Sie als Erster von neuen Produkten und Kollektionen.
              </Text>
            </Section>

            <Section style={benefitItem}>
              <Text style={benefitTitle}>👨‍🍳 Expertentipps</Text>
              <Text style={benefitText}>
                Lernen Sie von Profis: Rezepte, Pflegetipps und Kochtechniken für Induktion.
              </Text>
            </Section>
          </Section>

          <Hr style={hr} />

          {/* Social Proof */}
          <Section style={socialSection}>
            <Text style={socialText}>
              Über 10.000 zufriedene Kunden vertrauen auf NOVA INDUKT
            </Text>
            <Text style={stars}>⭐⭐⭐⭐⭐</Text>
            <Text style={reviewText}>
              „Die beste Qualität, die ich je hatte. Absolut empfehlenswert!" - Maria K.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Sie erhalten diese E-Mail, weil Sie sich für den NOVA INDUKT Newsletter angemeldet haben.
            </Text>
            <Text style={footerText}>
              <Link href={unsubscribeUrl} style={unsubscribeLink}>
                Hier abmelden
              </Link>
            </Text>
            <Text style={footerText}>
              NOVA INDUKT GmbH · Musterstraße 123 · 12345 Berlin
            </Text>
            <Text style={footerText}>
              <Link href="https://nova-indukt.de" style={link}>www.nova-indukt.de</Link> ·{' '}
              <Link href="mailto:support@nova-indukt.de" style={link}>support@nova-indukt.de</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
}

const header = {
  backgroundColor: '#0C211E',
  padding: '30px 20px',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#4ECCA3',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 8px',
}

const tagline = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '0',
  opacity: 0.8,
}

const heroSection = {
  padding: '40px 30px',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#0C211E',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 20px',
}

const heroText = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0',
}

const hr = {
  borderColor: '#e2e8f0',
  margin: '0',
}

const discountSection = {
  backgroundColor: '#f0fdf4',
  padding: '40px 30px',
  textAlign: 'center' as const,
}

const discountTitle = {
  color: '#0C211E',
  fontSize: '22px',
  fontWeight: 'bold',
  margin: '0 0 16px',
}

const discountText = {
  color: '#4a5568',
  fontSize: '16px',
  margin: '0 0 24px',
}

const codeBox = {
  backgroundColor: '#ffffff',
  border: '2px dashed #4ECCA3',
  borderRadius: '12px',
  padding: '24px',
  margin: '0 0 24px',
}

const codeLabel = {
  color: '#718096',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0 0 8px',
}

const code = {
  color: '#0C211E',
  fontSize: '32px',
  fontWeight: 'bold',
  fontFamily: 'monospace',
  letterSpacing: '2px',
  margin: '0 0 8px',
}

const codeValue = {
  color: '#4ECCA3',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
}

const ctaButton = {
  backgroundColor: '#0C211E',
  color: '#ffffff',
  padding: '16px 32px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  display: 'inline-block',
}

const benefitsSection = {
  padding: '40px 30px',
}

const h3 = {
  color: '#0C211E',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 24px',
  textAlign: 'center' as const,
}

const benefitItem = {
  margin: '0 0 24px',
}

const benefitTitle = {
  color: '#0C211E',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 8px',
}

const benefitText = {
  color: '#4a5568',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
}

const socialSection = {
  backgroundColor: '#f7fafc',
  padding: '30px',
  textAlign: 'center' as const,
}

const socialText = {
  color: '#0C211E',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px',
}

const stars = {
  color: '#F6AD55',
  fontSize: '24px',
  margin: '0 0 12px',
  letterSpacing: '2px',
}

const reviewText = {
  color: '#718096',
  fontSize: '14px',
  fontStyle: 'italic',
  margin: '0',
}

const footer = {
  padding: '30px',
  textAlign: 'center' as const,
  backgroundColor: '#f7fafc',
}

const footerText = {
  color: '#718096',
  fontSize: '12px',
  margin: '8px 0',
  lineHeight: '18px',
}

const link = {
  color: '#4ECCA3',
  textDecoration: 'none',
}

const unsubscribeLink = {
  color: '#718096',
  textDecoration: 'underline',
}
