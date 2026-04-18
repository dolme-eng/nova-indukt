import { Html, Head, Preview, Body, Container, Section, Text, Link, Button, Hr } from '@react-email/components'

interface NewsletterConfirmationEmailProps {
  firstName?: string
  email: string
  unsubscribeUrl: string
}

export default function NewsletterConfirmationEmail({
  firstName,
  email,
  unsubscribeUrl,
}: NewsletterConfirmationEmailProps) {
  const greeting = firstName ? `Hallo ${firstName},` : 'Hallo,'

  return (
    <Html>
      <Head />
      <Preview>Willkommen beim NOVA INDUKT Newsletter!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>NOVA INDUKT</Text>
          </Section>

          <Section style={content}>
            <Text style={greetingStyle}>{greeting}</Text>

            <Text style={paragraph}>
              Vielen Dank für Ihre Anmeldung zu unserem Newsletter! Sie erhalten jetzt regelmäßig:
            </Text>

            <ul style={list}>
              <li style={listItem}>Exklusive Angebote und Rabatte</li>
              <li style={listItem}>Neuigkeiten zu Induktionsprodukten</li>
              <li style={listItem}>Tipps und Tricks für die Küche</li>
              <li style={listItem}>Erstzugriff auf neue Produkte</li>
            </ul>

            <Button style={button} href="https://nova-indukt.de/produkte">
              Jetzt Produkte entdecken
            </Button>

            <Hr style={hr} />

            <Text style={smallText}>
              Sie haben sich mit der E-Mail-Adresse <strong>{email}</strong> angemeldet.
            </Text>

            <Text style={smallText}>
              Wenn Sie sich nicht angemeldet haben oder keine Newsletter mehr erhalten möchten, 
              können Sie sich{' '}
              <Link href={unsubscribeUrl} style={link}>
                hier abmelden
              </Link>
              .
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} NOVA INDUKT. Alle Rechte vorbehalten.
            </Text>
            <Text style={footerText}>
              <Link href="https://nova-indukt.de/datenschutz" style={footerLink}>
                Datenschutz
              </Link>{' '}
              |{' '}
              <Link href="https://nova-indukt.de/impressum" style={footerLink}>
                Impressum
              </Link>
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

const content = {
  padding: '32px 24px',
}

const greetingStyle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#0C211E',
  marginBottom: '16px',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#333333',
  marginBottom: '16px',
}

const list = {
  paddingLeft: '20px',
  marginBottom: '24px',
}

const listItem = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#333333',
  marginBottom: '8px',
}

const button = {
  backgroundColor: '#4ECCA3',
  color: '#0C211E',
  padding: '14px 28px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '16px',
  display: 'inline-block',
  marginBottom: '24px',
}

const hr = {
  borderColor: '#e5e5e5',
  margin: '24px 0',
}

const smallText = {
  fontSize: '14px',
  color: '#666666',
  lineHeight: '1.5',
}

const link = {
  color: '#4ECCA3',
  textDecoration: 'underline',
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

const footerLink = {
  color: '#4ECCA3',
  textDecoration: 'none',
}
