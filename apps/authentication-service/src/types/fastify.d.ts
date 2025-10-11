import type { CreateEmailOptions } from "resend";
import type { UserJsonWebTokenPayload } from "../model/user.model.ts";

declare module "fastify" {
  interface FastifyInstance {
    sendMail(
      mailOptions: CreateEmailOptions,
    ): Promise<
      { success: true; data: unknown } | { success: false; error: unknown }
    >;
  }
  interface FastifyRequest {
    user: UserJsonWebTokenPayload;
  }
}
