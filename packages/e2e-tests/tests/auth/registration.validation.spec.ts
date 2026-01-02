import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { expect, test } from "@playwright/test";

test.describe("User registration - validation", () => {
  test("shows validation error when email is missing", async ({ page }) => {
    await page.goto(authRoutes.register);

    await page.getByRole("textbox", { name: /first name/i }).fill("John");
    await page.getByRole("textbox", { name: /last name/i }).fill("Doe");
    await page
      .getByRole("textbox", { name: /^password$/i })
      .fill("Password123!");
    await page
      .getByRole("textbox", { name: /confirm password/i })
      .fill("Password123!");

    await expect(page.getByText(/enter a valid email/i)).not.toBeVisible();
    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page.getByText(/enter a valid email/i)).toBeVisible();
  });

  test("shows error for invalid email format", async ({ page }) => {
    await page.goto(authRoutes.register);

    await page.getByRole("textbox", { name: /email/i }).fill("not-an-email");
    await expect(page.getByText(/enter a valid email/i)).not.toBeVisible();
    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page.getByText(/enter a valid email/i)).toBeVisible();
  });

  test("shows error when passwords do not match", async ({ page }) => {
    await page.goto(authRoutes.register);

    await page
      .getByRole("textbox", { name: /^password$/i })
      .fill("Password123!");
    await page
      .getByRole("textbox", { name: /confirm password/i })
      .fill("DifferentPassword!");

    await expect(page.getByText(/passwords do not match/i)).not.toBeVisible();
    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  test("shows error for weak password", async ({ page }) => {
    await page.goto(authRoutes.register);

    await page.getByRole("textbox", { name: /^password$/i }).fill("123");
    await expect(page.getByText(/at least 8 characters/i)).not.toBeVisible();
    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page.getByText(/at least 8 characters/i)).toBeVisible();
  });
});
