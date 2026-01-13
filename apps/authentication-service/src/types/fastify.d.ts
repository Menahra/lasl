import type { DocumentType } from "@typegoose/typegoose";
import type { Session } from "@/src/model/session.model.ts";
import type { EmailOptions, EmailResponse } from "@/src/util/mailer/types.ts";

declare module "fastify" {
  // biome-ignore lint/style/useConsistentTypeDefinitions: needed for type augmentation
  interface FastifyInstance {
    sendMail: (mailOptions: EmailOptions) => Promise<EmailResponse>;
  }
  // biome-ignore lint/style/useConsistentTypeDefinitions: needed for type augmentation
  interface FastifyRequest {
    userId?: string;
    sessionId?: string;
    session?: DocumentType<Session>;
  }
}
