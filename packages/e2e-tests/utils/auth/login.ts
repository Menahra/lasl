import { authRoutes } from "@lasl/app-contracts/routes/auth";
import type { APIRequestContext, Page } from "@playwright/test";
import { createVerifiedUser } from "@/utils/auth/createVerifiedUser.ts";

export const login = async (page: Page, request: APIRequestContext) => {
  const verifiedUser = await createVerifiedUser(page, request);

  await page.goto(authRoutes.login);

  await page.getByRole("textbox", { name: /email/i }).fill(verifiedUser.email);
  await page
    .getByRole("textbox", { name: /password/i })
    .fill(verifiedUser.password);

  await page.getByRole("button", { name: /sign in/i }).click();

  await page.getByRole("heading", { name: /العربية الفصحى/i }).waitFor();

  return verifiedUser;
};
