import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { expect, test } from "@playwright/test";

test.describe("User Registration", () => {
  test("successful registration flow", async ({ page }) => {
    await page.goto(authRoutes.register);

    const email = `something-${Date.now()}@domain.com`;
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

  test("submit button is disabled while registering", async ({ page }) => {
    await page.goto(authRoutes.register);

    const email = `something-${Date.now()}@domain.com`;
    const password = "SecurePassword123!";

    await page.getByRole("textbox", { name: /first name/i }).fill("John");
    await page.getByRole("textbox", { name: /last name/i }).fill("Doe");
    await page.getByRole("textbox", { name: /email/i }).fill(email);
    await page.getByRole("textbox", { name: /^password$/i }).fill(password);
    await page
      .getByRole("textbox", { name: /confirm password/i })
      .fill(password);

    const submit = page.getByRole("button", { name: /create account/i });

    await submit.click();

    await expect(submit).toBeDisabled();
  });

  test("cannot register the same email twice", async ({ page }) => {
    const user = {
      firstName: "John",
      lastName: "Doe",
      email: `something-${Date.now()}@domain.com`,
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

    await expect(page.locator("text=Check your email")).toBeVisible();

    await expect(page).toHaveURL(authRoutes.registerSuccess);
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

    expect(page).not.toHaveURL(authRoutes.registerSuccess);
    await expect(page.getByText(/already registered/i)).toBeVisible();

    await expect(
      page.getByRole("link", { name: /sign in instead/i }),
    ).toBeVisible();
  });
});
