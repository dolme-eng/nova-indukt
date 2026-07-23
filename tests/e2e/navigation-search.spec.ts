import { test, expect } from "@playwright/test";
import { waitForPageReady, dismissOverlays } from "./helpers";

test.describe("Search & Navigation", () => {
  test("search page loads with results", async ({ page }) => {
    await page.goto("/suche?q=Pfanne", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);
    await expect(page).not.toHaveTitle(/500|error/i);
  });

  test("catalog page loads with products", async ({ page }) => {
    await page.goto("/produkte", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);
    await expect(page.getByTestId("product-grid")).toBeVisible();

    const cards = page.getByTestId("product-card");
    await expect(cards.first()).toBeVisible();
  });

  test("category filter works on catalog", async ({ page }) => {
    await page.goto("/produkte", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);
    await expect(page.getByTestId("product-grid")).toBeVisible();

    await dismissOverlays(page);
    await page.getByTestId("category-filter-alle").click({ force: true });
    await expect(page.getByTestId("product-card").first()).toBeVisible();
  });

  test("sort select works on catalog", async ({ page }) => {
    await page.goto("/produkte", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);
    await expect(page.getByTestId("product-grid")).toBeVisible();

    const sortSelect = page.getByTestId("sort-select");
    await expect(sortSelect).toBeVisible();
  });

  test("grid/list view toggle works", async ({ page }) => {
    await page.goto("/produkte", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);
    await expect(page.getByTestId("product-grid")).toBeVisible();

    await dismissOverlays(page);
    await expect(page.getByTestId("grid-view-button")).toBeVisible();
    await expect(page.getByTestId("list-view-button")).toBeVisible();

    await page.getByTestId("list-view-button").click({ force: true });
    await page.getByTestId("grid-view-button").click({ force: true });
  });
});

test.describe("Blog", () => {
  test("blog page loads with articles", async ({ page }) => {
    await page.goto("/blog", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);
    await expect(page).not.toHaveTitle(/500|error/i);

    const articles = page.locator("article");
    await expect(articles.first()).toBeVisible({ timeout: 10_000 });
  });

  test("blog article page loads", async ({ page }) => {
    await page.goto("/blog", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);

    await dismissOverlays(page);
    const firstArticleLink = page.locator('a[href^="/blog/"]').first();
    if (await firstArticleLink.isVisible()) {
      await firstArticleLink.click({ force: true });
      await page.waitForURL(/\/blog\//, { timeout: 15_000 });
      await waitForPageReady(page);
      await expect(page.locator("article")).toBeVisible();
    }
  });
});

test.describe("Contact Form", () => {
  test("contact page loads with form", async ({ page }) => {
    await page.goto("/kontakt", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);
    await expect(page).not.toHaveTitle(/500|error/i);

    const inputs = page.locator("input");
    expect(await inputs.count()).toBeGreaterThan(0);
  });
});

test.describe("Responsive", () => {
  test("header renders correctly", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);

    await expect(page.getByTestId("site-header")).toBeVisible();
    await expect(page.getByTestId("mobile-menu-button")).toBeVisible();
    await expect(page.getByTestId("site-logo")).toBeVisible();
  });
});
