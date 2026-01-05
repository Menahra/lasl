import type { CreateEmailOptions } from "resend";

export type EmailOptions = Pick<
  CreateEmailOptions,
  "to" | "replyTo" | "cc" | "bcc"
> & {
  subject: string;
  from: string;
  html: string;
  text: string;
};

export type EmailResponse =
  | {
      success: true;
      data: {
        id: string;
        from: string;
        to?: EmailOptions["to"];
        createdAt?: string;
      };
    }
  | {
      success: false;
      error: {
        message: string;
        name?: string;
      };
    };

export type EmailProvider = {
  sendEmail(options: EmailOptions): Promise<EmailResponse>;
  verifyConnection?: () => Promise<boolean>;
};
