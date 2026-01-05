import type { FastifyInstance } from "fastify";
import { ResendProvider } from "@/src/util/mailer/providers/resend.provider.ts";
import { SmtpProvider } from "@/src/util/mailer/providers/smtp.provider.ts";
import type { EmailProvider } from "@/src/util/mailer/types.ts";

const SMTP_HOST = "mailpit";
const SMTP_PORT = 1025;

export const createEmailProvider = (
  fastify: FastifyInstance,
): EmailProvider => {
  const { NODE_ENV } = fastify.config;

  // Use SMTP for test and development environments
  if (NODE_ENV === "test" || NODE_ENV === "development") {
    fastify.log.info(
      {
        provider: "smtp",
        host: SMTP_HOST,
        port: SMTP_PORT,
      },
      "Initializing SMTP email provider",
    );

    return new SmtpProvider({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: false,
    });
  }

  // Use Resend for production
  const { RESEND_API_KEY } = fastify.config;

  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is required for production environment");
  }

  fastify.log.info(
    { provider: "resend" },
    "Initializing Resend email provider",
  );

  return new ResendProvider(RESEND_API_KEY);
};
