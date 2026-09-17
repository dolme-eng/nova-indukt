import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.PW_ADMIN_EMAIL ?? ''
const ADMIN_PASSWORD = process.env.PW_ADMIN_PASSWORD ?? ''

function skipIfNoAdmin() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    test.skip(true, 'PW_ADMIN_EMAIL and PW_ADMIN_PASSWORD env vars required')
  }
}

const publicPages = [
  "/",
  "/produkte",
  "/suche",
  "/faq",
  "/impressum",
  "/datenschutz",
  "/agb",
  "/widerruf",
  "/lieferung",
  "/rueckgabe",
  "/kontakt",
  "/uber-uns",
  "/technologie",
  "/blog",
  "/anmelden",
  "/registrieren",
  "/passwort-vergessen",
  "/passwort-zuruecksetzen",
  "/warenkorb",
  "/wunschliste",
  "/danke",
];

const adminPages = [
  "/admin",
  "/admin/orders",
  "/admin/products",
  "/admin/blog",
  "/admin/customers",
  "/admin/promotions",
  "/admin/reviews",
  "/admin/newsletter",
  "/admin/settings",
];

test("public pages load", async ({ context }) => {
  // Use a fresh page per route to avoid cross-route SPA navigations
  for (const route of publicPages) {
    const page = await context.newPage();
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page).not.toHaveTitle(/500|error/i);
    await page.close();
  }
});

test("homepage product cards link to PDP", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const productLinks = await page.locator('a[href^="/produkt/"]').evaluateAll((els) =>
    Array.from(new Set(els.map((e) => (e as HTMLAnchorElement).getAttribute("href")).filter(Boolean) as string[]))
  );

  // At least one product link should exist on homepage
  expect(productLinks.length).toBeGreaterThan(0);

  // Check first 10 links max (avoid huge suites)
  for (const href of productLinks.slice(0, 10)) {
    const res = await page.goto(href, { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(200);
    await expect(page).toHaveURL(new RegExp(`/produkt/`));
  }
});

test("protected pages redirect to login when logged out", async ({ page }) => {
  await page.goto("/admin", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/anmelden\?redirect=/);

  await page.goto("/mein-konto", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/anmelden\?redirect=/);
});

test("checkout is public (guest checkout allowed)", async ({ page }) => {
  const res = await page.goto("/kasse", { waitUntil: "domcontentloaded" });
  expect(res?.status()).toBe(200);
  await expect(page).toHaveURL(/\/kasse/);
});

test("admin login works via UI and admin pages load", async ({ page }) => {
  skipIfNoAdmin()
  await page.goto("/anmelden", { waitUntil: "domcontentloaded" });
  await page.getByTestId("login-email").fill(ADMIN_EMAIL);
  await page.getByTestId("login-password").fill(ADMIN_PASSWORD);
  await page.getByTestId("login-submit").click();

  // Login is async; UI may not reliably navigate in headless.
  // Assert success state first, then verify protected pages are accessible.
  await expect(page.getByText("Erfolgreich angemeldet!")).toBeVisible({ timeout: 30_000 });

  await page.goto("/mein-konto", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/mein-konto/);

  for (const route of adminPages) {
    const res = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(200);
    await expect(page).toHaveURL(new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("admin business actions (create/update/delete) via API", async ({ page }) => {
  skipIfNoAdmin()

  // Login via UI first — page.request shares the session cookies.
  await page.goto("/anmelden", { waitUntil: "domcontentloaded" });
  await page.getByTestId("login-email").fill(ADMIN_EMAIL);
  await page.getByTestId("login-password").fill(ADMIN_PASSWORD);
  await page.getByTestId("login-submit").click();
  await expect(page.getByText("Erfolgreich angemeldet!")).toBeVisible({ timeout: 30_000 });

  // Our API requires the double-submit CSRF header; the token lives in the
  // `csrf-token` cookie set by CsrfProvider (client-side JS).
  const csrfToken = await page.evaluate(
    () => document.cookie.match(/(?:^| )csrf-token=([^;]+)/)?.[1] ?? ''
  );
  expect(csrfToken).toBeTruthy();
  const apiHeaders = { 'x-csrf-token': csrfToken };

  // Need category id for product
  const catsRes = await page.request.get("/api/admin/categories");
  expect(catsRes.ok()).toBeTruthy();
  const cats = await catsRes.json();
  const categoryId = cats?.[0]?.id;
  expect(categoryId).toBeTruthy();

  const unique = Date.now().toString(36);
  const productPayload = {
    nameDe: `PW Test Produkt ${unique}`,
    slug: `pw-test-produkt-${unique}`,
    price: 99.99,
    categoryId,
    isActive: true,
    images: [{ url: "https://res.cloudinary.com/demo/image/upload/sample.jpg", alt: "test" }],
  };

  // Create product
  const createProduct = await page.request.post("/api/admin/products", {
    data: productPayload,
    headers: apiHeaders,
  });
  expect(createProduct.ok()).toBeTruthy();
  const createdProduct = await createProduct.json();
  expect(createdProduct?.id).toBeTruthy();

  // Update product
  const patchProduct = await page.request.patch(`/api/admin/products/${createdProduct.id}`, {
    data: { ...productPayload, nameDe: `PW Test Produkt Updated ${unique}`, price: 89.99 },
    headers: apiHeaders,
  });
  expect(patchProduct.ok()).toBeTruthy();

  // Create blog post
  const blogPayload = {
    titleDe: `PW Test Blog ${unique}`,
    slug: `pw-test-blog-${unique}`,
    excerptDe: "Test excerpt",
    contentDe: "Test content",
    image: null,
    category: "Test",
    author: "Playwright",
    readTime: "2 min",
    isPublished: false,
  };

  const createBlog = await page.request.post("/api/admin/blog", {
    data: blogPayload,
    headers: apiHeaders,
  });
  expect(createBlog.ok()).toBeTruthy();
  const createdBlog = await createBlog.json();
  expect(createdBlog?.id).toBeTruthy();

  // Update blog post
  const putBlog = await page.request.put(`/api/admin/blog/${createdBlog.id}`, {
    data: { ...blogPayload, titleDe: `PW Test Blog Updated ${unique}` },
    headers: apiHeaders,
  });
  expect(putBlog.ok()).toBeTruthy();

  // Cleanup
  const delBlog = await page.request.delete(`/api/admin/blog/${createdBlog.id}`, {
    headers: apiHeaders,
  });
  expect(delBlog.ok()).toBeTruthy();

  const delProduct = await page.request.delete(`/api/admin/products/${createdProduct.id}`, {
    headers: apiHeaders,
  });
  expect(delProduct.status()).toBe(204);
});
