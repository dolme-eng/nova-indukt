import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const publicPages = [
  "/",
  "/produkte",
  "/faq",
  "/kontakt",
  "/uber-uns",
  "/technologie",
  "/blog",
  "/impressum",
  "/datenschutz",
  "/agb",
  "/widerruf",
  "/lieferung",
  "/rueckgabe",
  "/anmelden",
];

test.describe("Accessibility (axe-core)", () => {
  for (const route of publicPages) {
    test(`no critical violations on ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "networkidle" });

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const critical = results.violations.filter(
        (v: { impact?: string | null }) => v.impact === "critical" || v.impact === "serious"
      );

      expect(
        critical,
        `Found ${critical.length} critical/serious a11y violations on ${route}:\n${critical
          .map((v: { impact?: string | null; id: string; description: string; nodes: unknown[] }) => `  - [${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} nodes)`)
          .join("\n")}`
      ).toHaveLength(0);
    });
  }
});
