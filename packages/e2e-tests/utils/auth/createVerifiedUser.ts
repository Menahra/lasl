import { authRoutes } from "@lasl/app-contracts/routes/auth";
import type { APIRequestContext, Page } from "@playwright/test";
import { extractFirstLinkFromMail } from "@/utils/mailer/extractFirstLinkFromMail.ts";
import { waitForVerificationEmail } from "@/utils/mailer/waitForVerificationMail.ts";

export type TestUserType = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export const createVerifiedUser = async (
  page: Page,
  request: APIRequestContext,
) => {
  const user: TestUserType = {
    email: `e2e-${Date.now()}-${Math.random()}@domain.com`,
    password: "SecurePassword123!",
    firstName: "John",
    lastName: "Doe",
  };

  const since = Date.now();

  await page.goto(authRoutes.register);
  await page.getByRole("textbox", { name: /first name/i }).fill(user.firstName);
  await page.getByRole("textbox", { name: /last name/i }).fill(user.lastName);
  await page.getByRole("textbox", { name: /email/i }).fill(user.email);
  await page.getByRole("textbox", { name: /^password$/i }).fill(user.password);
  await page
    .getByRole("textbox", { name: /confirm password/i })
    .fill(user.password);

  await page.getByRole("button", { name: /create account/i }).click();

  const message = await waitForVerificationEmail(request, user.email, since);
  const link = await extractFirstLinkFromMail(request, message.ID);

  await page.goto(link);

  await page.getByText(/email verified/i).waitFor();

  return user;
};
