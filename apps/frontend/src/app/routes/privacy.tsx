import { legalRoutes } from "@lasl/app-contracts/routes/legal";
import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPolicyPage } from "@/src/app/pages/privacy-policy-page/PrivacyPolicyPage.tsx";

export const ROUTE_PRIVACY_POLICY = legalRoutes.privacy;

export const Route = createFileRoute(ROUTE_PRIVACY_POLICY)({
  component: PrivacyPolicyPage,
});
