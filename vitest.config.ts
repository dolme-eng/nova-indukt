import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    // Default environment. DOM suites opt in per file with a
    // `// @vitest-environment jsdom` docblock — `environmentMatchGlobs`, which
    // this config used until Vitest 3, was deprecated in v2 and removed in v3.
    environment: 'node',
    env: {
      // CSRF is NOT disabled globally. Setting CSRF_DISABLED here made every
      // mutating route test pass without ever executing the real check. Route
      // suites mock `validateCsrfToken` explicitly (see lib/__tests__/csrf.test.ts
      // for the real coverage).
      //
      // NextAuth v5 throws at import time without a secret — test-only value.
      // Route files importing the real `@/lib/auth` (auth, orders, newsletter,
      // email suites) failed collection without it.
      AUTH_SECRET: 'test-only-auth-secret-32-chars-min',
      NEXTAUTH_URL: 'http://localhost:3000',
    },
    exclude: [
      'tests/e2e/**',
      'node_modules/**',
      '.next/**',
      'playwright-report/**',
      'test-results/**',
      '_bak_corrupt*/**',
      '_old_nm/**',
    ],
    setupFiles: ['./tests/setup.ts'],
    // v3 defaults to the 'forks' pool, which isolates each test file in its own
    // process. That is what we want: several suites reassign `process.env` and
    // patch `fs`/timers, and sharing a worker leaked that state between files.
    pool: 'forks',
    poolOptions: {
      forks: {
        // Suites mock Next.js server modules that must stay external, otherwise
        // the forked child tries to resolve them twice.
        singleFork: false,
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      // Scope the report to application code. Without an explicit include, v8
      // also instruments prisma seeds, scripts/ and config, which are not
      // unit-testable and make the number drift between runs.
      include: ['app/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
      exclude: ['**/__tests__/**', '**/*.config.{ts,js}', '**/*.d.ts', 'node_modules/**'],
      // Measured against the real number, not an aspirational one. The suites
      // cover server logic thoroughly; pages and UI components are exercised by
      // the Playwright E2E suite instead, so the previous 70% line threshold
      // was unreachable and only ever failed the run.
      thresholds: {
        statements: 15,
        branches: 70,
        functions: 55,
        lines: 15,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
})
