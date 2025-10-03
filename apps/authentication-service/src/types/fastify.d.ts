import type { CreateEmailOptions } from "resend";

declare module "fastify" {
  interface FastifyInstance {
    sendMail(
      mailOptions: CreateEmailOptions,
    ): Promise<
      { success: true; data: unknown } | { success: false; error: unknown }
    >;
  }
}
