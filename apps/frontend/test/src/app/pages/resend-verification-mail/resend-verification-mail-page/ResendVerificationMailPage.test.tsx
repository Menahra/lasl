import "@/test/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ResendVerificationMailPage } from "@/src/app/pages/resend-verification-mail/resend-verification-mail-page/ResendVerificationMailPage.tsx";
import { setI18nLoading } from "@/test/__mocks__/i18nContextMock.ts";
import { renderWithProviders } from "@/test/__wrappers__/renderWithProviders.tsx";

const mutateAsyncMock = vi.fn();
let isPending = false;

vi.mock("@/src/shared/hooks/api/useAuthentication.ts", () => ({
  usePostResendVerificationMail: () => ({
    mutateAsync: mutateAsyncMock,
    get isPending() {
      return isPending;
    },
  }),
}));

const navigateMock = vi.fn();
vi.mock("@tanstack/react-router", async (importOriginalTanstackRouter) => {
  const actual =
    await importOriginalTanstackRouter<
      typeof import("@tanstack/react-router")
    >();

  return {
    ...actual,
    useRouter: () => ({
      navigate: navigateMock,
    }),
  };
});

describe("ResendVerificationMailPage", () => {
  afterEach(() => {
    setI18nLoading(false);
    isPending = false;
    vi.clearAllMocks();
  });

  const renderPage = () =>
    renderWithProviders(ResendVerificationMailPage, {
      i18n: true,
      router: {
        pathPattern: "/forgot",
      },
    });

  it("renders title and subtitle", async () => {
    await renderPage();

    expect(
      screen.getAllByText(/resend verification email/i).length,
    ).toBeGreaterThan(1);

    expect(
      screen.getByText(/send you a new verification link/i),
    ).toBeInTheDocument();
  });

  it("renders back to sign in button", async () => {
    await renderPage();

    expect(
      screen.getByRole("button", { name: /back to sign in/i }),
    ).toBeInTheDocument();
  });

  it("hides content when loading", async () => {
    setI18nLoading(true);
    await renderPage();

    expect(
      screen.queryByRole("button", { name: /back to sign in/i }),
    ).not.toBeInTheDocument();
  });
});
