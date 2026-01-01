import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { legalRoutes } from "@lasl/app-contracts/routes/legal";
import { expect, test } from "@playwright/test";

test.describe("Footer links", () => {
  test("privacy policy link works", async ({ page }) => {
    await page.goto(authRoutes.home);

    await page.getByRole("link", { name: /privacy policy/i }).click();
    await expect(page).toHaveURL(legalRoutes.privacy);
  });

  test("terms of service link works", async ({ page }) => {
    await page.goto(authRoutes.home);

    await page.getByRole("link", { name: /terms of service/i }).click();
    await expect(page).toHaveURL(legalRoutes.terms);
  });

  test("imprint link works", async ({ page }) => {
    await page.goto(authRoutes.home);

    await page.getByRole("link", { name: /imprint/i }).click();
    await expect(page).toHaveURL(legalRoutes.imprint);
  });
});
