import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { createFileRoute } from "@tanstack/react-router";
import { ResendVerificationMailPage } from "@/src/app/pages/resend-verification-mail/resend-verification-mail-page/ResendVerificationMailPage.tsx";
import { ROUTE_AUTH_PREFIX } from "@/src/app/routes/_auth.tsx";

export const ROUTE_RESEND_VERIFICATION_MAIL = authRoutes.resendVerificationMail;

export const Route = createFileRoute(
  `${ROUTE_AUTH_PREFIX}${ROUTE_RESEND_VERIFICATION_MAIL}`,
)({
  component: ResendVerificationMailPage,
});
