import { expect, test } from "@playwright/test";

test.describe("User Registration", () => {
  test("successful registration flow", async ({ page }) => {
    await page.goto("/register");

    const email = `test-${Date.now()}@example.com`;
    const password = "SecurePassword123!";

    // Fill registration form
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', password);
    await page.fill('[name="confirmPassword"]', password);
    await page.click('button[type="submit"]');

    // Should show success message
    await expect(page.locator("text=Check your email")).toBeVisible();

    // Should be on verification pending page
    await expect(page).toHaveURL(/\/verify-email/);
  });
});
