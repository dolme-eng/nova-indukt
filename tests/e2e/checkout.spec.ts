import { test, expect } from "@playwright/test";
import { waitForPageReady } from "./helpers";

test.describe("Checkout Flow (Bank Transfer)", () => {
  test("checkout page loads with cart items", async ({ page }) => {
    await page.goto("/produkte", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);

    await page.getByTestId("add-to-cart-button").first().click();
    await expect(page.getByTestId("cart-count")).toBeVisible({ timeout: 5_000 });

    await page.goto("/kasse", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);
    await expect(page.getByTestId("checkout-page")).toBeVisible();
  });

  test("empty cart shows empty state on checkout", async ({ page }) => {
    await page.goto("/kasse", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);
    await expect(page.getByText("Warenkorb ist leer")).toBeVisible({ timeout: 10_000 });
  });

  test("checkout step 1: fill shipping form", async ({ page }) => {
    await page.goto("/produkte", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);

    await page.getByTestId("add-to-cart-button").first().click();
    await expect(page.getByTestId("cart-count")).toBeVisible({ timeout: 5_000 });

    await page.goto("/kasse", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);
    await expect(page.getByTestId("checkout-page")).toBeVisible();

    await page.getByTestId("shipping-firstName").fill("Max");
    await page.getByTestId("shipping-lastName").fill("Mustermann");
    await page.getByTestId("shipping-email").fill("max@example.de");
    await page.getByTestId("shipping-address").fill("Berliner Straße 42");
    await page.getByTestId("shipping-zip").fill("10115");
    await page.getByTestId("shipping-city").fill("Berlin");

    await page.getByTestId("continue-to-payment").click();
    await expect(page.getByTestId("payment-section")).toBeVisible();
  });

  test("checkout step 2: bank transfer payment shown", async ({ page }) => {
    await page.goto("/produkte", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);

    await page.getByTestId("add-to-cart-button").first().click();
    await expect(page.getByTestId("cart-count")).toBeVisible({ timeout: 5_000 });

    await page.goto("/kasse", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);

    await page.getByTestId("shipping-firstName").fill("Max");
    await page.getByTestId("shipping-lastName").fill("Mustermann");
    await page.getByTestId("shipping-email").fill("max@example.de");
    await page.getByTestId("shipping-address").fill("Berliner Straße 42");
    await page.getByTestId("shipping-zip").fill("10115");
    await page.getByTestId("shipping-city").fill("Berlin");

    await page.getByTestId("continue-to-payment").click();
    await expect(page.getByTestId("payment-section")).toBeVisible();
    await expect(page.getByText("Banküberweisung")).toBeVisible();
  });

  test("checkout sidebar shows order summary", async ({ page }) => {
    await page.goto("/produkte", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);

    await page.getByTestId("add-to-cart-button").first().click();
    await expect(page.getByTestId("cart-count")).toBeVisible({ timeout: 5_000 });

    await page.goto("/kasse", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);

    await expect(page.getByText("Bestellübersicht")).toBeVisible();
    await expect(page.getByText("Zwischensumme")).toBeVisible();
    await expect(page.getByText("Versand")).toBeVisible();
    await expect(page.getByText("Gesamtsumme")).toBeVisible();
  });

  test("checkout coupon code flow", async ({ page }) => {
    await page.goto("/produkte", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);

    await page.getByTestId("add-to-cart-button").first().click();
    await expect(page.getByTestId("cart-count")).toBeVisible({ timeout: 5_000 });

    await page.goto("/kasse", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);

    await page.getByTestId("coupon-input").fill("INVALID-CODE");
    await page.getByTestId("apply-coupon").click();
    await expect(page.getByTestId("coupon-input")).toBeVisible({ timeout: 5_000 });
  });
});
