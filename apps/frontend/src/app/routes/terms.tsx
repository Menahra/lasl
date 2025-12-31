import { legalRoutes } from "@lasl/app-contracts/routes/legal";
import { createFileRoute } from "@tanstack/react-router";
import { TermsOfServicePage } from "@/src/app/pages/terms-of-service-page/TermsOfServicePage.tsx";

export const ROUTE_TERMS_OF_SERVICE = legalRoutes.terms;

export const Route = createFileRoute(ROUTE_TERMS_OF_SERVICE)({
  component: TermsOfServicePage,
});
