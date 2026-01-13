import type { APIRequestContext } from "@playwright/test";
import type {
  MailpitMessageSummary,
  MailpitMessagesResponse,
} from "@/utils/mailer/types.ts";

export const waitForEmail = async (
  request: APIRequestContext,
  email: string,
  timeoutMs = 10_000,
): Promise<MailpitMessageSummary> => {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    // biome-ignore lint/performance/noAwaitInLoops: ok here in test scenario
    const res = await request.get("http://localhost:8025/api/v1/messages");

    const data = (await res.json()) as MailpitMessagesResponse;

    const message = data.messages.find((msg) =>
      msg.To.some((to) => to.Address === email),
    );

    if (message) {
      return message;
    }

    await new Promise((r) => setTimeout(r, 500));
  }

  throw new Error(`Email not received for ${email}`);
};
