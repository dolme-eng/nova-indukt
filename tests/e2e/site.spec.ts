import { test, expect, request } from "@playwright/test";

const ADMIN_EMAIL = process.env.PW_ADMIN_EMAIL ?? "admin@nova-indukt.de";
const ADMIN_PASSWORD = process.env.PW_ADMIN_PASSWORD ?? "NOVA-Test-Admin-2026!";

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

  await page.goto("/kasse", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/anmelden\?redirect=/);
});

test("admin login works via UI and admin pages load", async ({ page }) => {
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

test("admin business actions (create/update/delete) via API", async ({ baseURL }) => {
  if (!baseURL) throw new Error("Missing baseURL");

  const ctx = await request.newContext({ baseURL });

  // Get CSRF (NextAuth)
  const csrfRes = await ctx.get("/api/auth/csrf");
  expect(csrfRes.ok()).toBeTruthy();
  const csrf = await csrfRes.json();

  // Login to get session cookies
  const loginRes = await ctx.post("/api/auth/callback/credentials?redirect=false", {
    form: {
      csrfToken: csrf.csrfToken,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      json: "true",
    },
  });
  expect([200, 302]).toContain(loginRes.status());

  // Need category id for product
  const catsRes = await ctx.get("/api/admin/categories");
  expect(catsRes.ok()).toBeTruthy();
  const cats = await catsRes.json();
  const categoryId = cats?.[0]?.id;
  expect(categoryId).toBeTruthy();

  const unique = Date.now().toString(36);
  const productPayload = {
    nameDe: `PW Test Produkt ${unique}`,
    slug: `pw-test-produkt-${unique}`,
    price: 99.99,
    stock: 3,
    categoryId,
    isActive: true,
    images: [{ url: "https://res.cloudinary.com/demo/image/upload/sample.jpg", alt: "test" }],
  };

  // Create product
  const createProduct = await ctx.post("/api/admin/products", { data: productPayload });
  expect(createProduct.ok()).toBeTruthy();
  const createdProduct = await createProduct.json();
  expect(createdProduct?.id).toBeTruthy();

  // Update product
  const patchProduct = await ctx.patch(`/api/admin/products/${createdProduct.id}`, {
    data: { ...productPayload, nameDe: `PW Test Produkt Updated ${unique}`, price: 89.99 },
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

  const createBlog = await ctx.post("/api/admin/blog", { data: blogPayload });
  expect(createBlog.ok()).toBeTruthy();
  const createdBlog = await createBlog.json();
  expect(createdBlog?.id).toBeTruthy();

  // Update blog post
  const putBlog = await ctx.put(`/api/admin/blog/${createdBlog.id}`, {
    data: { ...blogPayload, titleDe: `PW Test Blog Updated ${unique}` },
  });
  expect(putBlog.ok()).toBeTruthy();

  // Cleanup
  const delBlog = await ctx.delete(`/api/admin/blog/${createdBlog.id}`);
  expect(delBlog.ok()).toBeTruthy();

  const delProduct = await ctx.delete(`/api/admin/products/${createdProduct.id}`);
  expect(delProduct.status()).toBe(204);
});

