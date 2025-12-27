import { createFileRoute } from "@tanstack/react-router";
import { EmailVerifiedPage } from "@/src/app/pages/email-verified-page/EmailVerifiedPage.tsx";

export const ROUTE_EMAIL_VERIFIED = "/email-verified";

export const Route = createFileRoute(ROUTE_EMAIL_VERIFIED)({
  component: EmailVerifiedPage,
});
