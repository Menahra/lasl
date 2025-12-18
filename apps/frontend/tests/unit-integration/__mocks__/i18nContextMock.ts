import { vi } from "vitest";

vi.mock("@/src/shared/hooks/useI18nContext.tsx", () => ({
  useI18nContext: () => ({ isLoading: false }),
}));
