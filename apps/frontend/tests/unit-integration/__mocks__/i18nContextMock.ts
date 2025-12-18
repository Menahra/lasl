import { type Mock, vi } from "vitest";
import { DEFAULT_LOCALE } from "@/src/shared/constants.ts";

// biome-ignore lint/style/useExportsLast: ok in test mock
export const mockedChangeLocaleFn: Mock = vi.fn();

let isLoading = false;

export const setI18nLoading = (value: boolean) => {
  isLoading = value;
};

vi.mock("@/src/shared/hooks/useI18nContext.tsx", () => ({
  useI18nContext: () => ({
    isLoading,
    changeLocale: mockedChangeLocaleFn,
    currentLocale: DEFAULT_LOCALE,
  }),
}));
