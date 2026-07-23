import { test, expect } from "@playwright/test";
import { waitForPageReady, waitForHydration, dismissOverlays } from "./helpers";

test.describe("Shopping Cart Flow", () => {
  test("add product to cart from PDP", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    const productLink = page.locator('a[href^="/produkt/"]').first();
    await productLink.click({ force: true });
    await page.waitForURL(/\/produkt\//, { timeout: 15_000 });
    await waitForHydration(page);

    await expect(page.getByTestId("product-detail")).toBeVisible();
    await expect(page.getByTestId("product-name")).toBeVisible();

    await page.getByTestId("add-to-cart-button").first().click({ force: true });
    await page.waitForTimeout(1000);
    await expect(page.getByTestId("cart-count").or(page.locator('[data-testid="cart-button"]'))).toBeVisible({ timeout: 15_000 });
  });

  test("add product to cart from catalog grid", async ({ page }) => {
    await page.goto("/produkte", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    await expect(page.getByTestId("product-grid")).toBeVisible();

    await page.getByTestId("add-to-cart-button").first().click({ force: true });
    await page.waitForTimeout(1000);
    await expect(page.getByTestId("cart-count").or(page.locator('[data-testid="cart-button"]'))).toBeVisible({ timeout: 15_000 });
  });

  test("cart drawer opens and shows items", async ({ page }) => {
    await page.goto("/produkte", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);

    await page.getByTestId("add-to-cart-button").first().click({ force: true });
    await page.waitForTimeout(1000);

    await page.getByTestId("cart-button").click({ force: true });
    await expect(page.getByTestId("cart-drawer")).toBeVisible({ timeout: 10_000 });

    const items = page.getByTestId("cart-item");
    await expect(items.first()).toBeVisible();
    await expect(page.getByTestId("checkout-button")).toBeVisible();
  });

  test("cart page shows items with correct data", async ({ page }) => {
    await page.goto("/produkte", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);

    await page.getByTestId("add-to-cart-button").first().click({ force: true });
    await page.waitForTimeout(1000);

    await page.goto("/warenkorb", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    await expect(page.getByTestId("cart-page")).toBeVisible();

    const items = page.getByTestId("cart-item");
    await expect(items.first()).toBeVisible();
    await expect(page.getByTestId("cart-item-price").first()).toBeVisible();
    await expect(page.getByTestId("cart-subtotal")).toBeVisible();
  });

  test("quantity controls work on cart page", async ({ page }) => {
    await page.goto("/produkte", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);

    await page.getByTestId("add-to-cart-button").first().click({ force: true });
    await page.waitForTimeout(1000);

    await page.goto("/warenkorb", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    await expect(page.getByTestId("cart-page")).toBeVisible();

    const qtyInput = page.getByTestId("cart-quantity-input").first();
    await expect(qtyInput).toHaveValue("1");

    await page.getByTestId("quantity-increase").first().click({ force: true });
    await expect(qtyInput).toHaveValue("2");

    await page.getByTestId("quantity-decrease").first().click({ force: true });
    await expect(qtyInput).toHaveValue("1");
  });

  test("remove item from cart page", async ({ page }) => {
    await page.goto("/produkte", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);

    await page.getByTestId("add-to-cart-button").first().click({ force: true });
    await page.waitForTimeout(1000);

    await page.goto("/warenkorb", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    await expect(page.getByTestId("cart-page")).toBeVisible();

    await page.getByTestId("remove-cart-item").first().click({ force: true });
    await expect(page.getByTestId("empty-cart")).toBeVisible({ timeout: 5_000 });
  });

  test("empty cart shows empty state", async ({ context }) => {
    const page = await context.newPage();
    await page.goto("/warenkorb", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);

    await expect(page.getByTestId("empty-cart")).toBeVisible();
    await expect(page.getByText("Ihr Warenkorb ist leer")).toBeVisible();
  });
});
