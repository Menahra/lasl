import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { expect, test } from "@playwright/test";
import { createVerifiedUser } from "@/utils/auth/createVerifiedUser.ts";

test.describe("User Login", () => {
  test("cannot login without verification of email", async ({ page }) => {
    const user = {
      firstName: "John",
      lastName: "Doe",
      email: `something-${Date.now()}-${Math.random()}@domain.com`,
      password: "SecurePassword123!",
    } as const;
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

  test("unverified user can also not login with other password", async ({
    page,
  }) => {
    const user = {
      firstName: "John",
      lastName: "Doe",
      email: `something-${Date.now()}-${Math.random()}@domain.com`,
      password: "SecurePassword123!",
    } as const;
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
      .fill(`${user.password}1`);

    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.getByText(/verify your email first/i)).toBeVisible();
  });

  test("verified user can login", async ({ page, request }) => {
    const user = await createVerifiedUser(page, request);

    await page.goto(authRoutes.login);

    await page.getByRole("textbox", { name: /email/i }).fill(user.email);
    await page.getByRole("textbox", { name: /password/i }).fill(user.password);

    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();
  });

  test("authenticated session persists on reload", async ({
    page,
    request,
  }) => {
    const user = await createVerifiedUser(page, request);

    await page.goto(authRoutes.login);

    await page.getByRole("textbox", { name: /email/i }).fill(user.email);
    await page.getByRole("textbox", { name: /password/i }).fill(user.password);

    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();
  });

  // TODO: add test to ensure user can access protected routes
});
