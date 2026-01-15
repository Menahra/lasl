import type { APIRequestContext } from "@playwright/test";
import type {
  MailpitMessageSummary,
  MailpitMessagesResponse,
} from "@/utils/mailer/types.ts";

export const waitForEmail = async (
  request: APIRequestContext,
  options: {
    to: string;
    subjectIncludes?: string;
    bodyIncludes?: string;
    since?: number;
  },
  timeoutMs = 10_000,
): Promise<MailpitMessageSummary> => {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    // biome-ignore lint/performance/noAwaitInLoops: ok here in test scenario
    const res = await request.get("http://localhost:8025/api/v1/messages");

    const data = (await res.json()) as MailpitMessagesResponse;

    const message = data.messages.find((msg) => {
      if (!msg.To.some((to) => to.Address === options.to)) {
        return false;
      }

      if (
        options.subjectIncludes &&
        !msg.Subject.includes(options.subjectIncludes)
      ) {
        return false;
      }

      if (options.since && new Date(msg.Created).getTime() < options.since) {
        return false;
      }

      return true;
    });

    if (message) {
      return message;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Email not received for ${options.to}`);
};
