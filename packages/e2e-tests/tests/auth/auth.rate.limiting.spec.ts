import { BYPASS_RATE_LIMIT_HEADER_NAME } from "@lasl/app-contracts/api/headers";
import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { expect, test } from "@playwright/test";

test.describe("Auth Rate Limiting", () => {
  test.use({
    // biome-ignore lint/style/useNamingConvention: naming from playwright
    extraHTTPHeaders: {
      [BYPASS_RATE_LIMIT_HEADER_NAME]: "",
    },
  });
  test("locks out user after multiple failed attempts", async ({ page }) => {
    const email = `target-${Date.now()}@domain.com`;
    const wrongPassword = "WrongPassword123!";

    await page.goto(authRoutes.login);

    await page.getByRole("textbox", { name: /email/i }).fill(email);

    const attempts = 6;

    for (let i = 0; i < attempts; i++) {
      // biome-ignore lint/performance/noAwaitInLoops: ok in test
      await page
        .getByRole("textbox", { name: /password/i })
        .fill(wrongPassword);
      await page.getByRole("button", { name: /sign in/i }).click();

      await page.waitForResponse(
        (res) => res.url().includes("/api/auth") || res.status() === 429,
      );
    }

    await expect(page.getByText(/too many attempts/i)).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });
});
