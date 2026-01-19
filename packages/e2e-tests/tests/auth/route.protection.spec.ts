import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { expect, test } from "@playwright/test";
import { login } from "@/utils/auth/login.ts";

test.describe("Auth route protection", () => {
  test("redirects authenticated users away from auth routes", async ({
    page,
    request,
  }) => {
    await login(page, request);

    const protectedAuthRoutes = [
      authRoutes.login,
      authRoutes.register,
      authRoutes.resendVerificationMail,
      authRoutes.forgotPassword,
    ];

    for (const route of protectedAuthRoutes) {
      // biome-ignore lint/performance/noAwaitInLoops: ok in this scenario
      await page.goto(route);
      await expect(
        page.getByRole("heading", { name: /العربية الفصحى/i }),
      ).toBeVisible();
    }
  });
});
