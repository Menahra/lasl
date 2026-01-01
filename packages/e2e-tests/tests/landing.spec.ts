import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { expect, test } from "@playwright/test";

test.describe("Landing Page", () => {
  test("can access the application", async ({ page }) => {
    await page.goto(authRoutes.home);

    await expect(
      page.getByRole("heading", { name: "العربية الفصحى" }),
    ).toBeVisible();

    await expect(page).toHaveURL(authRoutes.home);
  });

  test("CTA navigates to register page", async ({ page }) => {
    await page.goto(authRoutes.home);

    await page.getByRole("button", { name: /start learning free/i }).click();

    await expect(page).toHaveURL(authRoutes.register);
  });

  test("bottom cta navigates to register page", async ({ page }) => {
    await page.goto(authRoutes.home);

    const bottomCta = page.getByRole("button", {
      name: /create your free account/i,
    });

    await bottomCta.scrollIntoViewIfNeeded();
    await bottomCta.click();

    await expect(page).toHaveURL(authRoutes.register);
  });
});
