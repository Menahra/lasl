import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { expect, test } from "@playwright/test";
import { createVerifiedUser } from "@/utils/auth/createVerifiedUser.ts";
import { extractFirstLinkFromMail } from "@/utils/mailer/extractFirstLinkFromMail.ts";
import { waitForVerificationEmail } from "@/utils/mailer/waitForVerificationMail.ts";

test.describe("Authentication Flow", () => {
  test("user can register and verify email", async ({ page, request }) => {
    const user = {
      firstName: "John",
      lastName: "Doe",
      email: `something-${Date.now()}-${Math.random()}@domain.com`,
      password: "SecurePassword123!",
    } as const;

    await page.goto(authRoutes.register);

    const since = Date.now();

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

    const message = await waitForVerificationEmail(request, user.email, since);
    const verificationLink = await extractFirstLinkFromMail(
      request,
      message.ID,
    );

    await page.goto(verificationLink);

    await expect(page.getByText(/email verified/i)).toBeVisible();
  });

  test("verification link cannot be used twice", async ({ page, request }) => {
    await createVerifiedUser(page, request);

    await page.reload();
    await expect(
      page.getByText(/verification link is invalid or has expired/i),
    ).toBeVisible();
  });

  test("verification link cannot be clicked twice", async ({
    page,
    request,
  }) => {
    const since = Date.now();
    const verifiedUser = await createVerifiedUser(page, request);

    await page.goto("/");

    const message = await waitForVerificationEmail(
      request,
      verifiedUser.email,
      since,
    );
    const verificationLink = await extractFirstLinkFromMail(
      request,
      message.ID,
    );
    await page.goto(verificationLink);
    await expect(
      page.getByText(/verification link is invalid or has expired/i),
    ).toBeVisible();
  });

  test("tampered validation link does not work", async ({ page, request }) => {
    const user = {
      firstName: "John",
      lastName: "Doe",
      email: `something-${Date.now()}-${Math.random()}@domain.com`,
      password: "SecurePassword123!",
    } as const;

    await page.goto(authRoutes.register);

    const since = Date.now();

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

    const message = await waitForVerificationEmail(request, user.email, since);
    const verificationLink = await extractFirstLinkFromMail(
      request,
      message.ID,
    );

    await page.goto(`${verificationLink}a`);
    await expect(
      page.getByText(/verification link is invalid or has expired/i),
    ).toBeVisible();
  });
});
