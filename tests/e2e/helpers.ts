import { Page } from "@playwright/test";

export async function waitForPageReady(page: Page) {
  // Wait for window load event (what PageLoader listens for)
  await page.waitForFunction(() => document.readyState === 'complete', { timeout: 30_000 }).catch(() => {});
  // Wait for PageLoader's 200ms timeout + React hydration
  await page.waitForTimeout(2000);
  await dismissOverlays(page);
}

export async function waitForHydration(page: Page) {
  await waitForPageReady(page);
  // Extra wait for webpack dev server hydration
  await page.waitForTimeout(2000);
  await dismissOverlays(page);
}

export async function dismissOverlays(page: Page) {
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach((el) => {
      const s = getComputedStyle(el);
      if (s.position === 'fixed' && s.zIndex === '9999' && el instanceof HTMLElement) {
        el.style.display = 'none';
        el.style.pointerEvents = 'none';
      }
    });
  }).catch(() => {});
}
