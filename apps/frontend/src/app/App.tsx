import { Suspense } from "react";
import "@/src/styles/index.css";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { messages } from "@/src/locales/en/messages.ts";
import { routeTree } from "@/src/routeTree.gen.ts";
import { AuthenticationProvider } from "@/src/shared/hooks/useAuthenticationContext.tsx";

i18n.load("en", messages);
i18n.activate("en");
const router = createRouter({ routeTree });

const tanstackQueryClient = new QueryClient();

export const App = () => {
  return (
    <Suspense fallback="is loading">
      <QueryClientProvider client={tanstackQueryClient}>
        <I18nProvider i18n={i18n}>
          <AuthenticationProvider>
            <RouterProvider router={router} />
          </AuthenticationProvider>
        </I18nProvider>
      </QueryClientProvider>
    </Suspense>
  );
};
