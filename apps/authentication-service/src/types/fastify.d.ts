import type { DocumentType } from "@typegoose/typegoose";
import type { CreateEmailOptions } from "resend";
import type { Session } from "../model/session.model.ts";
import type { UserJsonWebTokenPayload } from "../model/user.model.ts";

declare module "fastify" {
  // biome-ignore lint/style/useConsistentTypeDefinitions: needed for type augmentation
  interface FastifyInstance {
    sendMail(
      mailOptions: CreateEmailOptions,
    ): Promise<
      { success: true; data: unknown } | { success: false; error: unknown }
    >;
  }
  // biome-ignore lint/style/useConsistentTypeDefinitions: needed for type augmentation
  interface FastifyRequest {
    user?: UserJsonWebTokenPayload;
    session?: DocumentType<Session>;
  }
}
