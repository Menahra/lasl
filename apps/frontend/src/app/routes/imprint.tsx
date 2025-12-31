import { legalRoutes } from "@lasl/app-contracts/routes/legal";
import { createFileRoute } from "@tanstack/react-router";
import { ImprintPage } from "@/src/app/pages/imprint-page/ImprintPage.tsx";

export const ROUTE_IMPRINT = legalRoutes.imprint;

export const Route = createFileRoute(ROUTE_IMPRINT)({
  component: ImprintPage,
});
