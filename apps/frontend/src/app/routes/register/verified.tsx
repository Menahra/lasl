import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { createFileRoute } from "@tanstack/react-router";
import { RegisterVerifiedPage } from "@/src/app/pages/register/register-verified-page/RegisterVerifiedPage.tsx";

export const ROUTE_REGISTER_VERIFIED = authRoutes.registerVerified;

export const Route = createFileRoute(ROUTE_REGISTER_VERIFIED)({
  component: RegisterVerifiedPage,
});
