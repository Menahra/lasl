import { createFileRoute } from "@tanstack/react-router";
import { RegisterVerifiedPage } from "@/src/app/pages/register/register-verified-page/RegisterVerifiedPage.tsx";

export const ROUTE_REGISTER_VERIFIED = "/register/verified";

export const Route = createFileRoute(ROUTE_REGISTER_VERIFIED)({
  component: RegisterVerifiedPage,
});
