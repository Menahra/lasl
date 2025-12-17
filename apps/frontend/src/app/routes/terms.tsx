import { createFileRoute } from "@tanstack/react-router";
import { TermsOfServicePage } from "@/src/app/pages/terms-of-service-page/TermsOfServicePage.tsx";

export const ROUTE_TERMS_OF_SERVICE = "/terms";

export const Route = createFileRoute(ROUTE_TERMS_OF_SERVICE)({
  component: TermsOfServicePage,
});

// Sprachauswahl bauen
// in Login und Register einfügen
// Terms page, Privacy Policy Page, Landing Page
