import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampleRate for a lower sample rate
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // See https://docs.sentry.io/platforms/javascript/guides/nextjs/
  enabled: process.env.NODE_ENV === "production",
  
  // Don't send PII
  sendDefaultPii: false,
  
  // Environment
  environment: process.env.NODE_ENV || "development",
});
