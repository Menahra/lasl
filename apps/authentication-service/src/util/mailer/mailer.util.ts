import fastifyPlugin from "fastify-plugin";
import { createEmailProvider } from "@/src/util/mailer/providers/provider.factory.ts";
import type { EmailOptions, EmailResponse } from "@/src/util/mailer/types.ts";

export const fastifyMailerPlugin = fastifyPlugin(
  async (fastifyInstance) => {
    const emailProvider = createEmailProvider(fastifyInstance);

    // Verify SMTP connection in test/dev
    if (
      fastifyInstance.config.NODE_ENV === "test" ||
      fastifyInstance.config.NODE_ENV === "development"
    ) {
      const smtpProvider = emailProvider;
      if (smtpProvider.verifyConnection) {
        const isConnected = await smtpProvider.verifyConnection();
        if (isConnected) {
          fastifyInstance.log.info("SMTP connection verified successfully");
        } else {
          fastifyInstance.log.warn(
            "SMTP connection verification failed - emails may not be sent",
          );
        }
      }
    }

    fastifyInstance.decorate(
      "sendMail",
      async (mailOptions: EmailOptions): Promise<EmailResponse> => {
        try {
          const result = await emailProvider.sendEmail(mailOptions);

          if (result.success) {
            fastifyInstance.log.info(
              { data: result.data },
              "Email sent successfully",
            );
          } else {
            fastifyInstance.log.error(
              { error: result.error },
              `Failed to send email with subject: ${mailOptions.subject}`,
            );
          }

          return result;
        } catch (error) {
          fastifyInstance.log.error(
            { error },
            `Unexpected error sending email with subject: ${mailOptions.subject}`,
          );

          return {
            success: false,
            error: {
              message: error instanceof Error ? error.message : "Unknown error",
              name: error instanceof Error ? error.name : "Error",
            },
          };
        }
      },
    );
  },
  {
    name: "fastify-mailer-plugin",
  },
);
