import { expect, test } from "@playwright/test";

test("can access the application", async ({ page }) => {
  await page.goto("/");

  // Wait for the page to load
  await page.waitForLoadState("networkidle");

  await expect(
    page.getByRole("heading", { name: "العربية الفصحى" }),
  ).toBeVisible();
});
