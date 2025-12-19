import { createFileRoute } from "@tanstack/react-router";
import { ImprintPage } from "@/src/app/pages/imprint-page/ImprintPage.tsx";

export const ROUTE_IMPRINT = "/imprint";

export const Route = createFileRoute(ROUTE_IMPRINT)({
  component: ImprintPage,
});
