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

interface ReviewRequestEmailProps {
  orderNumber: string
  customerName: string
  items: Array<{
    productId: string
    name: string
    image?: string
    reviewUrl: string
  }>
}

export const ReviewRequestEmail = ({
  orderNumber,
  customerName,
  items,
}: ReviewRequestEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Bewerten Sie Ihre Bestellung {orderNumber} bei NOVA INDUKT</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>NOVA INDUKT</Heading>
          </Section>

          {/* Main Content */}
          <Section style={section}>
            <Heading style={h2}>Wie gefällt Ihnen Ihre Bestellung?</Heading>
            <Text style={text}>Hallo {customerName},</Text>
            <Text style={text}>
              Es ist nun eine Woche her, dass Sie Ihre Bestellung <strong>{orderNumber}</strong> erhalten haben.
            </Text>
            <Text style={text}>
              Wir hoffen, dass Sie mit Ihren Produkten zufrieden sind! Ihre Meinung ist uns wichtig – 
              helfen Sie anderen Kunden bei ihrer Entscheidung und teilen Sie Ihre Erfahrung.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Products */}
          <Section style={section}>
            <Heading style={h3}>Bewerten Sie Ihre Produkte:</Heading>
            
            {items.map((item, index) => (
              <Section key={item.productId} style={productSection}>
                <Row>
                  <Column>
                    <img
                      src={item.image || 'https://via.placeholder.com/80'}
                      alt={item.name}
                      width="80"
                      height="80"
                      style={productImage}
                    />
                  </Column>
                  <Column style={productInfo}>
                    <Text style={productName}>{item.name}</Text>
                    <Button
                      href={item.reviewUrl}
                      style={reviewButton}
                    >
                      Jetzt bewerten ⭐
                    </Button>
                  </Column>
                </Row>
                {index < items.length - 1 && <Hr style={productDivider} />}
              </Section>
            ))}
          </Section>

          <Hr style={hr} />

          {/* Incentive */}
          <Section style={highlightSection}>
            <Text style={highlightText}>
              🎁 <strong>Als Dankeschön</strong> erhalten Sie bei Ihrer nächsten Bestellung 
              <strong>10% Rabatt</strong> mit dem Code: <code style={code}>DANKE10</code>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Bei Fragen antworten Sie einfach auf diese E-Mail oder kontaktieren Sie uns unter{' '}
              <Link href="mailto:support@nova-indukt.de" style={link}>
                support@nova-indukt.de
              </Link>
            </Text>
            <Text style={footerText}>
              Mit freundlichen Grüßen,<br />
              Ihr NOVA INDUKT Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default ReviewRequestEmail

// Styles
const main = {
  backgroundColor: '#f6f9fc',
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
  padding: '20px',
  borderRadius: '8px 8px 0 0',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#4ECCA3',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
}

const section = {
  padding: '20px 0',
}

const h2 = {
  color: '#0C211E',
  fontSize: '22px',
  fontWeight: 'bold',
  margin: '0 0 16px',
}

const h3 = {
  color: '#0C211E',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px',
}

const text = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
}

const hr = {
  borderColor: '#e2e8f0',
  margin: '20px 0',
}

const productSection = {
  padding: '12px 0',
}

const productImage = {
  borderRadius: '8px',
  objectFit: 'cover' as const,
}

const productInfo = {
  paddingLeft: '16px',
}

const productName = {
  color: '#0C211E',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 8px',
}

const reviewButton = {
  backgroundColor: '#4ECCA3',
  color: '#0C211E',
  padding: '10px 20px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 'bold',
  display: 'inline-block',
}

const productDivider = {
  borderColor: '#e2e8f0',
  margin: '16px 0',
}

const highlightSection = {
  backgroundColor: '#f0fdf4',
  border: '1px solid #4ECCA3',
  borderRadius: '8px',
  padding: '16px',
}

const highlightText = {
  color: '#0C211E',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
  textAlign: 'center' as const,
}

const code = {
  backgroundColor: '#0C211E',
  color: '#4ECCA3',
  padding: '4px 8px',
  borderRadius: '4px',
  fontFamily: 'monospace',
  fontWeight: 'bold',
}

const footer = {
  textAlign: 'center' as const,
}

const footerText = {
  color: '#718096',
  fontSize: '14px',
  margin: '8px 0',
}

const link = {
  color: '#4ECCA3',
  textDecoration: 'none',
}
