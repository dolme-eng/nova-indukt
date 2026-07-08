import { Html, Head, Preview, Body, Container, Section, Text, Link, Button, Hr } from '@react-email/components'

interface EmailVerificationProps {
  firstName?: string
  verificationUrl: string
  expiresIn: string
}

export default function EmailVerificationEmail({
  firstName,
  verificationUrl,
  expiresIn,
}: EmailVerificationProps) {
  const greeting = firstName ? `Hallo ${firstName},` : 'Hallo,'

  return (
    <Html>
      <Head />
      <Preview>E-Mail-Adresse verifizieren - NOVA INDUKT</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>NOVA INDUKT</Text>
          </Section>

          <Section style={content}>
            <Text style={greetingStyle}>{greeting}</Text>

            <Text style={paragraph}>
              Vielen Dank für Ihre Registrierung bei NOVA INDUKT! Bitte verifizieren Sie Ihre E-Mail-Adresse, indem Sie auf den Button unten klicken.
            </Text>

            <Button style={button} href={verificationUrl}>
              E-Mail-Adresse verifizieren
            </Button>

            <Text style={smallText}>
              Dieser Link ist <strong>{expiresIn}</strong> gültig. Nach Ablauf müssen Sie eine neue Anfrage stellen.
            </Text>

            <Hr style={hr} />

            <Text style={smallText}>
              Wenn der Button nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:
            </Text>
            <Text style={urlText}>{verificationUrl}</Text>
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

const main = {
  backgroundColor: '#f5f5f5',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '20px',
}

const header = {
  textAlign: 'center' as const,
  padding: '30px 0',
}

const brand = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#0C211E',
  letterSpacing: '2px',
}

const content = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '40px',
  marginBottom: '20px',
}

const greetingStyle = {
  fontSize: '18px',
  fontWeight: 'bold' as const,
  color: '#0C211E',
  marginBottom: '20px',
}

const paragraph = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#374151',
  marginBottom: '30px',
}

const button = {
  backgroundColor: '#0C211E',
  color: '#ffffff',
  padding: '14px 28px',
  borderRadius: '12px',
  fontWeight: 'bold' as const,
  fontSize: '15px',
  textDecoration: 'none',
  display: 'inline-block',
}

const smallText = {
  fontSize: '13px',
  lineHeight: '1.5',
  color: '#6b7280',
  marginTop: '20px',
}

const hr = {
  borderTop: '1px solid #e5e7eb',
  margin: '20px 0',
}

const urlText = {
  fontSize: '12px',
  color: '#6b7280',
  wordBreak: 'break-all' as const,
}

const footer = {
  textAlign: 'center' as const,
  padding: '20px 0',
}

const footerText = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '5px 0',
}

const footerLink = {
  color: '#6b7280',
  textDecoration: 'underline',
}
