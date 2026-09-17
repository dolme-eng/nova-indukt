import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      CSRF_DISABLED: 'true',
      // NextAuth v5 throws at import time without a secret — test-only value.
      // Route files importing the real `@/lib/auth` (auth, orders, newsletter,
      // email suites) failed collection without it.
      AUTH_SECRET: 'test-only-auth-secret-32-chars-min',
      NEXTAUTH_URL: 'http://localhost:3000',
    },
    exclude: ['tests/e2e/**', 'node_modules/**', '_bak_corrupt/**', '_old_nm/**'],
    environmentMatchGlobs: [
      ['components/__tests__/**', 'jsdom'],
      ['app/**/__tests__/**', 'jsdom'],
    ],
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
})
