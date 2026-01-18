import { expect, test } from "@playwright/test";
import { login } from "@/utils/auth/login.ts";

test.describe("User Logout", () => {
  test("user can logout", async ({ page, request }) => {
    await login(page, request);

    await page.getByRole("button", { name: /logout/i }).click();
    await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
  });

  test("reload does not restore session", async ({ page, request }) => {
    await login(page, request);

    await page.getByRole("button", { name: /logout/i }).click();
    await expect(page.getByRole("button", { name: /login/i })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
  });

  // TODO: add test to ensure back button does not work once we have protected routes
});
