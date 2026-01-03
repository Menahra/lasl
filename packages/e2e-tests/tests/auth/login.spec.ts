import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { expect, test } from "@playwright/test";

test.describe("User Login", () => {
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: `test-${Date.now()}@example.com`,
    password: "SecurePassword123!",
  } as const;

  test("cannot login without verification of email", async ({ page }) => {
    await page.goto(authRoutes.register);

    await page
      .getByRole("textbox", { name: /first name/i })
      .fill(user.firstName);
    await page.getByRole("textbox", { name: /last name/i }).fill(user.lastName);
    await page.getByRole("textbox", { name: /email/i }).fill(user.email);
    await page
      .getByRole("textbox", { name: /^password$/i })
      .fill(user.password);
    await page
      .getByRole("textbox", { name: /confirm password/i })
      .fill(user.password);
    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page).toHaveURL(authRoutes.registerSuccess);
    await page.goto(authRoutes.login);

    await page.getByRole("textbox", { name: /email/i }).fill(user.email);
    await page
      .getByRole("textbox", { name: /^password$/i })
      .fill(user.password);

    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.getByText(/verify your email first/i)).toBeVisible();
  });
});
