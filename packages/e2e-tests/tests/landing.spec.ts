import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { expect, test } from "@playwright/test";

test("can access the application", async ({ page }) => {
  await page.goto(authRoutes.home);

  // Wait for the page to load
  await page.waitForLoadState("networkidle");

  await expect(
    page.getByRole("heading", { name: "العربية الفصحى" }),
  ).toBeVisible();
});

test("CTA navigates to register page", async ({ page }) => {
  await page.goto(authRoutes.home);

  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: /start learning free/i }).click();

  await expect(page).toHaveURL(authRoutes.register);
});
