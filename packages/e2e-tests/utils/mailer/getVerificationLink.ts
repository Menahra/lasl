import type { APIRequestContext } from "@playwright/test";
import type { MailpitMessage } from "@/utils/mailer/types.ts";

export const getVerificationLink = async (
  request: APIRequestContext,
  messageId: string,
) => {
  const res = await request.get(
    `http://localhost:8025/api/v1/message/${messageId}`,
  );
  const message = (await res.json()) as MailpitMessage;

  const html = message.HTML ?? "";
  const text = message.Text ?? "";

  const content = html || text;

  const match = content.match(/https?:\/\/[^\s"]+/);
  if (!match) {
    throw new Error("Verification link not found in email");
  }

  return match[0];
};
