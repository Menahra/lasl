import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { createFileRoute } from "@tanstack/react-router";
import { ResendVerificationMailSentPage } from "@/src/app/pages/resend-verification-mail/resend-verification-mail-sent-page/ResendVerificationMailSentPage.tsx";

export const ROUTE_RESEND_VERIFICATION_MAIL_SENT =
  authRoutes.resendVerificationMailSent;

export const Route = createFileRoute(ROUTE_RESEND_VERIFICATION_MAIL_SENT)({
  component: ResendVerificationMailSentPage,
});
