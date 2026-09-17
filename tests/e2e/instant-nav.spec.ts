import { test, expect } from "@playwright/test";
import { instant } from "@next/playwright";

// Shell markers are sync h1 headings rendered in the prerendered static shell.
const NOTES_SHELL = "h1:has-text('All Notes')";
const GROUPS_SHELL = "h1:has-text('Bundles')";

test.describe("instant nav: /notes", () => {
  test("shell commits on initial load under instant()", async ({ page }) => {
    const url = "http://localhost:3000/notes";
    await instant(
      page,
      async () => {
        await page.goto(url);
        await expect(page.locator(NOTES_SHELL)).toBeVisible();
      },
      { baseURL: "http://localhost:3000" }
    );
  });
});

test.describe("instant nav: /groups", () => {
  test("shell commits on initial load under instant()", async ({ page }) => {
    const url = "http://localhost:3000/groups";
    await instant(
      page,
      async () => {
        await page.goto(url);
        await expect(page.locator(GROUPS_SHELL)).toBeVisible();
      },
      { baseURL: "http://localhost:3000" }
    );
  });
});
