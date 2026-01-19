import "@/test/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { describe, expect, it, type Mock, vi } from "vitest";
import { RegisterVerifyPage } from "@/src/app/pages/register/register-verify-page/RegisterVerifyPage.tsx";
import { useVerifyUser } from "@/src/shared/hooks/api/useVerifyUser.ts";
import { renderWithProviders } from "@/test/__wrappers__/renderWithProviders.tsx";

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

vi.mock("@/src/shared/hooks/api/useVerifyUser.ts", () => ({
  useVerifyUser: vi.fn(),
}));

vi.mock(
  "@/src/app/routes/_auth/register/verify/$id/$verificationCode/index.tsx",
  () => ({
    // biome-ignore lint/style/useNamingConvention: naming from tanstack router
    Route: {
      useParams: () => ({
        id: "user-id",
        verificationCode: "code-123",
      }),
    },
  }),
);

describe("RegisterVerifyPage", () => {
  const mutateAsyncMock = vi.fn();

  const renderRegisterVerifyPage = () =>
    renderWithProviders(RegisterVerifyPage, {
      i18n: true,
      router: {
        pathPattern: "/register/verify/user-id/code-123",
      },
      query: true,
    });

  it("calls verify mutation on mount", async () => {
    (useVerifyUser as Mock).mockReturnValue({
      mutateAsync: mutateAsyncMock,
    });

    await renderRegisterVerifyPage();

    expect(mutateAsyncMock).toHaveBeenCalledWith({
      id: "user-id",
      verificationCode: "code-123",
    });
  });

  it("renders only loading state initially", async () => {
    (useVerifyUser as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
      isSuccess: false,
    });

    await renderRegisterVerifyPage();

    expect(screen.queryByText("Email Verified!")).not.toBeInTheDocument();

    expect(screen.queryByText("Verification Failed!")).not.toBeInTheDocument();
  });

  it("renders success state", async () => {
    (useVerifyUser as Mock).mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
      isSuccess: true,
    });

    await renderRegisterVerifyPage();

    expect(screen.getByText("Email Verified!")).toBeInTheDocument();

    expect(screen.getByText("Continue to App")).toBeInTheDocument();

    expect(
      screen.getByText("Redirecting you to the app in a few seconds..."),
    ).toBeInTheDocument();
  });

  it("renders error state", async () => {
    (useVerifyUser as Mock).mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
      isSuccess: false,
    });

    await renderRegisterVerifyPage();

    expect(screen.getByText("Verification Failed!")).toBeInTheDocument();

    expect(screen.getByText("Try again")).toBeInTheDocument();
  });
});
