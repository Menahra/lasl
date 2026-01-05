import { type CreateEmailOptions, Resend } from "resend";
import type {
  EmailOptions,
  EmailProvider,
  EmailResponse,
} from "@/src/util/mailer/types.ts";

export class ResendProvider implements EmailProvider {
  private readonly resend: Resend;

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey);
  }

  async sendEmail(options: EmailOptions): Promise<EmailResponse> {
    const resendOptions: CreateEmailOptions = {
      ...options,
      replyTo: options.replyTo ?? [],
      cc: options.cc ?? [],
      bcc: options.bcc ?? [],
    };

    const { data, error } = await this.resend.emails.send(resendOptions);

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          name: error.name,
        },
      };
    }

    return {
      success: true,
      data: {
        id: data?.id || "",
        from: options.from,
        to: options.to,
      },
    };
  }
}
