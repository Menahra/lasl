import fastifyPlugin from "fastify-plugin";
import { type CreateEmailOptions, Resend } from "resend";

export const fastifyMailerPlugin = fastifyPlugin((fastifyInstance) => {
  const { RESEND_API_KEY } = fastifyInstance.config;

  const resend = new Resend(RESEND_API_KEY);

  fastifyInstance.decorate(
    "sendMail",
    async (mailOptions: CreateEmailOptions) => {
      const { data, error } = await resend.emails.send({
        ...mailOptions,
        from: "onboarding@resend.dev",
      });

      if (error) {
        fastifyInstance.log.error(
          { error },
          `failed to send email with subject ${mailOptions.subject}`,
        );
        return { success: false, error };
      }

      fastifyInstance.log.info({ data }, "Email sent successfully");
      return { success: true, data };
    },
  );
});
