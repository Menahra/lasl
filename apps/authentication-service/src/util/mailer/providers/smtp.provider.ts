import type { Transporter } from "nodemailer";
import nodemailer from "nodemailer";
import type SmtpConnection from "nodemailer/lib/smtp-connection/index.js";
import type {
  EmailOptions,
  EmailProvider,
  EmailResponse,
} from "@/src/util/mailer/types.ts";

export type SmtpConfig = Pick<
  SmtpConnection.Options,
  "auth" | "host" | "port" | "secure"
>;

export class SmtpProvider implements EmailProvider {
  private readonly transporter: Transporter;

  constructor(config: SmtpConfig) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });
  }

  async sendEmail(options: EmailOptions): Promise<EmailResponse> {
    try {
      const info = await this.transporter.sendMail(options);

      return {
        success: true,
        data: {
          id: info.messageId,
          from: options.from,
          to: options.to,
          createdAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
          name: error instanceof Error ? error.name : "Error",
        },
      };
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (_error) {
      return false;
    }
  }
}
