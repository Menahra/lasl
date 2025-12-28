import { type RenderResult, render, screen } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";
import { TestQueryProvider } from "@/tests/unit-integration/__wrappers__//TestQueryProvider.tsx";
import { TestI18nProvider } from "@/tests/unit-integration/__wrappers__/TestI18nProvider.tsx";
import {
  ROOT_LAYOUT_TESTID,
  TestRouterProvider,
} from "@/tests/unit-integration/__wrappers__/TestRouterProvider.tsx";

export type RenderWithProviderOptions = {
  query?: boolean;
  i18n?: boolean;
  router?: {
    pathPattern: string;
    initialEntry?: string;
  };
  // this option can be used to avoid the findBy* query (i.e. if fake timers needed)
  synchronous?: boolean;
};

export const renderWithProviders = async (
  Component: ComponentType,
  options: RenderWithProviderOptions = {},
): Promise<RenderResult> => {
  const { query, i18n, router, synchronous } = options;

  let tree: ReactNode = <Component />;

  if (router) {
    tree = <TestRouterProvider {...router}>{tree}</TestRouterProvider>;
  }

  if (query) {
    tree = <TestQueryProvider>{tree}</TestQueryProvider>;
  }

  if (i18n) {
    tree = <TestI18nProvider>{tree}</TestI18nProvider>;
  }

  const renderResult = render(tree);

  if (!synchronous && router) {
    await screen.findByTestId(ROOT_LAYOUT_TESTID);
  }

  return renderResult;
};
