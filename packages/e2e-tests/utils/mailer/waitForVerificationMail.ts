import type { APIRequestContext } from "@playwright/test";
import { waitForEmail } from "@/utils/mailer/waitForEmail.ts";

export const waitForVerificationEmail = (
  request: APIRequestContext,
  email: string,
  since: number,
) =>
  waitForEmail(request, {
    to: email,
    subjectIncludes: "Verify",
    since,
  });
