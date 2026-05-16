/**
 * Shared PayPal utilities — single source of truth for auth and API config.
 *
 * Replaces the duplicated `getPayPalAccessToken` that was copy-pasted across
 * create-order, capture-order, and webhooks routes.
 */

export const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
export const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET

export const PAYPAL_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com"

export async function getPayPalAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64")

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: "grant_type=client_credentials",
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "")
    throw new Error(
      `Failed to get PayPal access token: ${response.status} ${errorBody}`
    )
  }

  const data = await response.json()
  return data.access_token
}
