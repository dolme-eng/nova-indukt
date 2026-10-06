import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.PW_PORT ?? "3000";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: `npx next dev --webpack -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    // Pin to the port under test: otherwise a dev server the developer already
    // had running on :3000 silently serves the whole suite, masking the state of
    // the current branch.
    reuseExistingServer: false,
    timeout: 5 * 60 * 1000,
    env: {
      // Windows-only shim (see readlink-patch.cjs). On Linux/macOS NODE_OPTIONS
      // is left untouched.
      ...(process.platform === 'win32' ? { NODE_OPTIONS: '--require ./readlink-patch.cjs' } : {}),
      // These tests mutate data (site.spec.ts creates then deletes products and
      // blog posts). Point them at a throwaway database so a developer's local
      // data is never touched.
      ...(process.env.PW_DATABASE_URL ? { DATABASE_URL: process.env.PW_DATABASE_URL } : {}),
    },
  },
  workers: 1,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});

