import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { Suspense } from "react";
import { routeTree } from "@/src/routeTree.gen.ts";
import {
  AuthenticationProvider,
  useAuthenticationContext,
} from "@/src/shared/hooks/useAuthenticationContext.tsx";
import { I18nProvider } from "@/src/shared/hooks/useI18nContext.tsx";
import "@/src/styles/index.css";

const router = createRouter({
  routeTree,
  scrollRestoration: true,
  context: { auth: undefined },
});

const tanstackQueryClient = new QueryClient();

const RouterProviderWithContext = () => {
  const authenticationContext = useAuthenticationContext();

  router.update({
    context: { auth: authenticationContext },
  });

  return <RouterProvider router={router} />;
};

export const App = () => {
  return (
    <Suspense fallback="is loading">
      <QueryClientProvider client={tanstackQueryClient}>
        <AuthenticationProvider>
          <I18nProvider>
            <RouterProviderWithContext />
          </I18nProvider>
        </AuthenticationProvider>
      </QueryClientProvider>
    </Suspense>
  );
};
