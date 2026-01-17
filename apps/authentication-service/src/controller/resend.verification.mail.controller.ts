import { authRoutes } from "@lasl/app-contracts/routes/auth";
import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import type { ResendVerificationMailInput } from "@/src/schema/user.schema.ts";
import { findUserByEmail } from "@/src/service/user.service.ts";
import { loadHtmlTemplate } from "@/src/util/html.template.loader.util.ts";

export const resendVerificationMailHandler = async (
  // biome-ignore lint/style/useNamingConvention: property name comes from fastify
  req: FastifyRequest<{ Body: ResendVerificationMailInput["body"] }>,
  reply: FastifyReply,
) => {
  const {
    body: { email },
    server: {
      config: { FRONTEND_BASE_URL },
    },
  } = req;

  try {
    const user = await findUserByEmail(email);

    if (user && !user.verified) {
      const verifyUrl = `${FRONTEND_BASE_URL}${authRoutes.registerVerify(user._id.toString(), user.verificationCode)}`;

      const emailHtml = await loadHtmlTemplate("verification-email", {
        userName: user.firstName,
        verifyUrl,
        currentYear: new Date().getFullYear().toString(),
      });

      req.server.sendMail({
        to: user.email,
        subject: "Verify your account",
        html: emailHtml,
        text: `Hi ${user.firstName}, please use the following link to verify your account ${verifyUrl}`,
        from: "onboarding@resend.dev",
      });
    }
  } catch (error: unknown) {
    req.log.error(error, "Error occured during resend of verification mail");
  }

  return reply.status(StatusCodes.OK).send({
    message:
      "If an unverified user exists for this email a new verification mail has been sent",
  });
};
