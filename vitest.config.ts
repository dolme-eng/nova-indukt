import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      CSRF_DISABLED: 'true',
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
