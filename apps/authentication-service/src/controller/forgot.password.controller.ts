import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { nanoid } from "nanoid";
import type { ForgotPasswordInput } from "../schema/user.schema.ts";
import { findUserByEmail } from "../service/user.service.ts";
import { getApiVersionPathPrefix } from "../util/api.path.util.ts";
import { loadHtmlTemplate } from "../util/html.template.loader.util.ts";

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: acceptable here
export const forgotPasswordHandler = async (
  // biome-ignore lint/style/useNamingConvention: property name comes from fastify
  req: FastifyRequest<{ Body: ForgotPasswordInput["body"] }>,
  reply: FastifyReply,
) => {
  const { email } = req.body;

  try {
    const host = req.headers.host;
    const protocol = req.protocol;
    const origin = `${protocol}://${host}`;

    const user = await findUserByEmail(email);

    if (user) {
      if (user.verified) {
        const passwordResetCode = nanoid();
        user.passwordResetCode = passwordResetCode;
        await user.save();

        const resetPasswordUrl = `${origin}${getApiVersionPathPrefix(1)}/users/resetpassword/${user._id}/${user.passwordResetCode}`;

        const passwordResetEmailHtml = await loadHtmlTemplate(
          "password-reset-email",
          {
            userName: user.firstName,
            resetPasswordUrl,
            currentYear: new Date().getFullYear().toString(),
          },
        );

        req.server.sendMail({
          to: user.email,
          subject: "Forgot your password? We’ve got you covered",
          html: passwordResetEmailHtml,
          text: `Hi ${user.firstName}, please use the following link to reset your password ${resetPasswordUrl}`,
          from: "onboarding@resend.dev",
        });
      } else {
        req.log.info(
          { email },
          "Password reset requested for not yet verified user",
        );

        const verifyUrl = `${origin}${getApiVersionPathPrefix(1)}/users/verify/${user._id}/${user.verificationCode}`;

        const passwordResetWithoutVerifiedHtml = await loadHtmlTemplate(
          "password-reset-unverified-email",
          {
            userName: user.firstName,
            verifyUrl,
            currentYear: new Date().getFullYear().toString(),
          },
        );

        req.server.sendMail({
          to: user.email,
          subject: "Verify your account",
          html: passwordResetWithoutVerifiedHtml,
          text: `Hi ${user.firstName}, before using our services please verify your account via the following link ${verifyUrl}`,
          from: "onboarding@resend.dev",
        });

        req.log.debug(`Password reset email sent to ${user.email}`);
      }
    } else {
      req.log.info({ email }, "Password reset requested for unknown email");
    }
  } catch (error) {
    req.log.error(error, "An error occured during password reset");
  }

  return reply.status(StatusCodes.OK).send({
    message:
      "If a user with that email is registered, you will receive a password reset email",
  });
};
