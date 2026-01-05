import type { DocumentType } from "@typegoose/typegoose";
import type { EmailOptions, EmailResponse } from "@/src/util/mailer/types.ts";
import type { Session } from "../model/session.model.ts";
import type { UserJsonWebTokenPayload } from "../model/user.model.ts";

declare module "fastify" {
  // biome-ignore lint/style/useConsistentTypeDefinitions: needed for type augmentation
  interface FastifyInstance {
    sendMail: (mailOptions: EmailOptions) => Promise<EmailResponse>;
  }
  // biome-ignore lint/style/useConsistentTypeDefinitions: needed for type augmentation
  interface FastifyRequest {
    user?: UserJsonWebTokenPayload;
    session?: DocumentType<Session>;
  }
}
