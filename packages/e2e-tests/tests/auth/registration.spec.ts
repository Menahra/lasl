import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { expect, test } from "@playwright/test";

test.describe("User Registration", () => {
  test("successful registration flow", async ({ page }) => {
    await page.goto("/register");

    const email = `test-${Date.now()}@example.com`;
    const password = "SecurePassword123!";

    await page.getByRole("textbox", { name: /first name/i }).fill("John");
    await page.getByRole("textbox", { name: /last name/i }).fill("Doe");
    await page.getByRole("textbox", { name: /email/i }).fill(email);
    await page.getByRole("textbox", { name: /^password$/i }).fill(password);
    await page
      .getByRole("textbox", { name: /confirm password/i })
      .fill(password);
    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page.locator("text=Check your email")).toBeVisible();

    await expect(page).toHaveURL(authRoutes.registerSuccess);
  });
});
