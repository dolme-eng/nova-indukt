import { Html, Head, Preview, Body, Container, Section, Text, Link, Hr, Row, Column } from '@react-email/components'

interface ContactNotificationEmailProps {
  name: string
  email: string
  subject: string
  message: string
  messageId: string
  createdAt: string
}

export default function ContactNotificationEmail({
  name,
  email,
  subject,
  message,
  messageId,
  createdAt,
}: ContactNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Neue Kontaktanfrage von {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>NOVA INDUKT</Text>
            <Text style={headerSubtitle}>Neue Kontaktanfrage</Text>
          </Section>

          <Section style={content}>
            <Text style={title}>Neue Nachricht erhalten</Text>

            <Section style={infoBox}>
              <Row>
                <Column>
                  <Text style={label}>Von:</Text>
                  <Text style={value}>{name} ({email})</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={label}>Betreff:</Text>
                  <Text style={value}>{subject}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={label}>Eingegangen:</Text>
                  <Text style={value}>{createdAt}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={label}>Nachrichten-ID:</Text>
                  <Text style={valueSmall}>{messageId}</Text>
                </Column>
              </Row>
            </Section>

            <Text style={sectionTitle}>Nachricht:</Text>
            <Section style={messageBox}>
              <Text style={messageText}>{message}</Text>
            </Section>

            <Hr style={hr} />

            <Text style={actionText}>
              Bitte antworten Sie direkt auf diese E-Mail oder über das Admin-Panel.
            </Text>

            <Link
              href={`https://nova-indukt.de/admin/contact/${messageId}`}
              style={button}
            >
              Im Admin-Panel öffnen
            </Link>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Dies ist eine automatische Benachrichtigung vom Kontaktformular.
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

const valueSmall = {
  fontSize: '12px',
  color: '#666666',
  fontFamily: 'monospace',
  margin: '0',
}

const sectionTitle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#0C211E',
  marginBottom: '12px',
}

const messageBox = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e5e5',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
}

const messageText = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#333333',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
}

const hr = {
  borderColor: '#e5e5e5',
  margin: '24px 0',
}

const actionText = {
  fontSize: '14px',
  color: '#666666',
  marginBottom: '16px',
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
