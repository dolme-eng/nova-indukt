import { Html, Head, Preview, Body, Container, Section, Text, Link, Button, Hr } from '@react-email/components'

interface PasswordResetEmailProps {
  firstName?: string
  resetUrl: string
  expiresIn: string
}

export default function PasswordResetEmail({
  firstName,
  resetUrl,
  expiresIn,
}: PasswordResetEmailProps) {
  const greeting = firstName ? `Hallo ${firstName},` : 'Hallo,'

  return (
    <Html>
      <Head />
      <Preview>Passwort zurücksetzen - NOVA INDUKT</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>NOVA INDUKT</Text>
          </Section>

          <Section style={content}>
            <Text style={greetingStyle}>{greeting}</Text>

            <Text style={paragraph}>
              Sie haben angefordert, Ihr Passwort zurückzusetzen. Klicken Sie auf den Button unten, um ein neues Passwort zu erstellen.
            </Text>

            <Button style={button} href={resetUrl}>
              Passwort zurücksetzen
            </Button>

            <Text style={smallText}>
              Dieser Link ist <strong>{expiresIn}</strong> gültig. Wenn Sie kein neues Passwort angefordert haben, können Sie diese E-Mail ignorieren.
            </Text>

            <Hr style={hr} />

            <Text style={smallText}>
              Wenn der Button nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:
            </Text>
            <Text style={urlText}>{resetUrl}</Text>
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
  marginBottom: '24px',
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

const smallText = {
  fontSize: '14px',
  color: '#666666',
  lineHeight: '1.5',
}

const urlText = {
  fontSize: '12px',
  color: '#666666',
  wordBreak: 'break-all' as const,
  backgroundColor: '#f5f5f5',
  padding: '12px',
  borderRadius: '6px',
}

const hr = {
  borderColor: '#e5e5e5',
  margin: '24px 0',
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
