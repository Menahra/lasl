import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { Suspense } from "react";
import { routeTree } from "@/src/routeTree.gen.ts";
import { AuthenticationProvider } from "@/src/shared/hooks/useAuthenticationContext.tsx";
import { I18nProvider } from "@/src/shared/hooks/useI18nContext.tsx";
import "@/src/styles/index.css";

const router = createRouter({ routeTree });

const tanstackQueryClient = new QueryClient();

export const App = () => {
  return (
    <Suspense fallback="is loading">
      <QueryClientProvider client={tanstackQueryClient}>
        <AuthenticationProvider>
          <I18nProvider loadingComponent={<span>HI there loading</span>}>
            <RouterProvider router={router} />
          </I18nProvider>
        </AuthenticationProvider>
      </QueryClientProvider>
    </Suspense>
  );
};
