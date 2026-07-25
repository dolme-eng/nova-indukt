import { Page } from "@playwright/test";

export async function waitForPageReady(page: Page) {
  await page.waitForFunction(() => document.readyState === 'complete', { timeout: 30_000 }).catch(() => {});
  // Wait for Next.js hydration indicators instead of fixed timeout
  await page.waitForFunction(() => {
    const root = document.getElementById('__next');
    return root && root.children.length > 0;
  }, { timeout: 10_000 }).catch(() => {});
  await dismissOverlays(page);
}

export async function waitForHydration(page: Page) {
  await waitForPageReady(page);
  // Wait for any loading skeletons to disappear
  await page.waitForFunction(() => {
    return !document.querySelector('.animate-pulse');
  }, { timeout: 10_000 }).catch(() => {});
  await dismissOverlays(page);
}

export async function dismissOverlays(page: Page) {
  // Dismiss known overlays: cookie consent, promotion banner
  await page.evaluate(() => {
    // Hide elements with specific z-index patterns used by overlays
    document.querySelectorAll('[class*="cookie"], [class*="consent"], [data-testid*="cookie"]').forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.display = 'none';
      }
    });
  }).catch(() => {});
}
