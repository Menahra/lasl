import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { createFileRoute } from "@tanstack/react-router";
import { ResendVerificationMailPage } from "@/src/app/pages/resend-verification-mail-page/ResendVerificationMailPage.tsx";

export const ROUTE_RESEND_VERIFICATION_MAIL = authRoutes.resendVerificationMail;

export const Route = createFileRoute(ROUTE_RESEND_VERIFICATION_MAIL)({
  component: ResendVerificationMailPage,
});
