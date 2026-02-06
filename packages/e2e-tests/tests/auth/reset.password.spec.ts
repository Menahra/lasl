import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { expect, test } from "@playwright/test";
import {
  createVerifiedUser,
  type TestUserType,
} from "@/utils/auth/createVerifiedUser.ts";
import { extractFirstLinkFromMail } from "@/utils/mailer/extractFirstLinkFromMail.ts";
import { waitForPasswordResetEmail } from "@/utils/mailer/waitForResetEmail.ts";

test.describe("reset password flow", () => {
  let user: TestUserType;

  test.beforeEach(async ({ page, request }) => {
    user = await createVerifiedUser(page, request);
  });

  test("user can request password reset", async ({ page }) => {
    await page.goto(authRoutes.forgotPassword);

    await page.getByRole("textbox", { name: /email/i }).fill(user.email);
    await page.getByRole("button", { name: /send reset link/i }).click();

    await expect(page.getByText(/if an account exists/i)).toBeVisible();
  });

  test("old password is invalid after reset", async ({ page, request }) => {
    await page.goto(authRoutes.forgotPassword);
    const beforeResetLinkSentTime = Date.now();
    await page.getByRole("textbox", { name: /email/i }).fill(user.email);
    await page.getByRole("button", { name: /send reset link/i }).click();

    const message = await waitForPasswordResetEmail(
      request,
      user.email,
      beforeResetLinkSentTime,
    );
    const resetLink = await extractFirstLinkFromMail(request, message.ID);

    const newPassword = "NewPassword123!";
    await page.goto(resetLink);
    await page.getByRole("textbox", { name: /^password$/i }).fill(newPassword);
    await page
      .getByRole("textbox", { name: /confirm password/i })
      .fill(newPassword);
    await page.getByRole("button", { name: /reset password/i }).click();
    await expect(
      page.getByText(/password has been successfully updated/i),
    ).toBeVisible();

    await page.goto(authRoutes.login);
    await page.getByRole("textbox", { name: /email/i }).fill(user.email);
    await page.getByRole("textbox", { name: /password/i }).fill(user.password);
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test("password reset does not reveal account existence", async ({ page }) => {
    await page.goto(authRoutes.forgotPassword);

    await page
      .getByRole("textbox", { name: /email/i })
      .fill("nonexistent@domain.com");

    await page.getByRole("button", { name: /send reset link/i }).click();

    await expect(page.getByText(/if an account exists/i)).toBeVisible();
  });

  test("password reset link cannot be reused", async ({ page, request }) => {
    await page.goto(authRoutes.forgotPassword);
    const beforeResetLinkSentTime = Date.now();
    await page.getByRole("textbox", { name: /email/i }).fill(user.email);
    await page.getByRole("button", { name: /send reset link/i }).click();

    const message = await waitForPasswordResetEmail(
      request,
      user.email,
      beforeResetLinkSentTime,
    );
    const resetLink = await extractFirstLinkFromMail(request, message.ID);

    const newPassword = "NewPassword123!";
    await page.goto(resetLink);
    await page.getByRole("textbox", { name: /^password$/i }).fill(newPassword);
    await page
      .getByRole("textbox", { name: /confirm password/i })
      .fill(newPassword);
    await page.getByRole("button", { name: /reset password/i }).click();
    await expect(
      page.getByText(/password has been successfully updated/i),
    ).toBeVisible();

    await page.goto("/");

    await page.goto(resetLink);
    await page.getByRole("textbox", { name: /^password$/i }).fill(newPassword);
    await page
      .getByRole("textbox", { name: /confirm password/i })
      .fill(newPassword);
    await page.getByRole("button", { name: /reset password/i }).click();

    await expect(page.getByText(/link is invalid/i)).toBeVisible();
  });

  test("enforces password rules when choosing a new one", async ({
    page,
    request,
  }) => {
    await page.goto(authRoutes.forgotPassword);
    const beforeResetLinkSentTime = Date.now();
    await page.getByRole("textbox", { name: /email/i }).fill(user.email);
    await page.getByRole("button", { name: /send reset link/i }).click();

    const message = await waitForPasswordResetEmail(
      request,
      user.email,
      beforeResetLinkSentTime,
    );
    const resetLink = await extractFirstLinkFromMail(request, message.ID);

    const newPassword = "test1";
    await page.goto(resetLink);
    await page.getByRole("textbox", { name: /^password$/i }).fill(newPassword);
    await page
      .getByRole("textbox", { name: /confirm password/i })
      .fill(newPassword);
    await page.getByRole("button", { name: /reset password/i }).click();

    await expect(
      page.getByText(/password must be at least 8 characters/i),
    ).toBeVisible();
  });
});
