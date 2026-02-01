import "@/test/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ResetPasswordForm } from "@/src/app/pages/reset-password/reset-password-page/ResetPasswordForm.tsx";
import { ROUTE_RESET_PASSWORD_SENT } from "@/src/app/routes/_auth/reset-password/sent.tsx";
import { renderWithProviders } from "@/test/__wrappers__/renderWithProviders.tsx";

vi.mock(
  "@/src/app/routes/_auth/reset-password/$id/$passwordResetCode/index.tsx",
  () => ({
    // biome-ignore lint/style/useNamingConvention: given by module
    Route: {
      useParams: () => ({
        id: "user-123",
        passwordResetCode: "reset-code-abc",
      }),
    },
  }),
);

const mutateAsyncMock = vi.fn();
vi.mock("@/src/shared/hooks/api/useAuthentication.ts", () => ({
  usePostResetPassword: () => ({
    mutateAsync: mutateAsyncMock,
    isPending: false,
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

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    mutateAsyncMock.mockReset();
  });

  const renderResetPasswordForm = () =>
    renderWithProviders(ResetPasswordForm, {
      i18n: true,
      query: true,
      router: {
        pathPattern: "resetpassword",
      },
    });
  const user = userEvent.setup();

  it("renders password fields and submit button", async () => {
    await renderResetPasswordForm();

    expect(screen.getAllByLabelText(/password/i)).toHaveLength(2);
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reset password/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors when passwords do not match", async () => {
    await renderResetPasswordForm();

    await user.type(screen.getByLabelText(/^password$/i), "Password123!");
    await user.type(
      screen.getByLabelText(/confirm password/i),
      "Different123!",
    );

    await user.click(screen.getByRole("button", { name: /reset password/i }));

    expect(
      await screen.findByText(/passwords do not match/i),
    ).toBeInTheDocument();

    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("submits correct payload on valid form", async () => {
    await renderResetPasswordForm();

    await user.type(screen.getByLabelText(/^password$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirm password/i), "Password123!");

    await user.click(screen.getByRole("button", { name: /reset password/i }));

    expect(mutateAsyncMock).toHaveBeenCalledWith({
      id: "user-123",
      passwordResetCode: "reset-code-abc",
      password: "Password123!",
      passwordConfirmation: "Password123!",
    });
  });

  it("navigates to reset password sent page after successful submit", async () => {
    await renderResetPasswordForm();

    await user.type(screen.getByLabelText(/^password$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirm password/i), "Password123!");

    await user.click(screen.getByRole("button", { name: /reset password/i }));
    expect(mutateAsyncMock).toHaveBeenCalledWith({
      id: "user-123",
      passwordResetCode: "reset-code-abc",
      password: "Password123!",
      passwordConfirmation: "Password123!",
    });

    expect(navigateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ROUTE_RESET_PASSWORD_SENT,
      }),
    );
  });

  it("shows unknown error if api responds with 500", async () => {
    mutateAsyncMock.mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: StatusCodes.INTERNAL_SERVER_ERROR },
    });
    await renderResetPasswordForm();

    await user.type(screen.getByLabelText(/^password$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirm password/i), "Password123!");

    expect(
      screen.queryByText(/An unexpected error occurred/i),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /reset password/i }));
    expect(screen.getByText(/An unexpected error occurred./i)).toBeVisible();
  });

  it("shows invalid code for other errors", async () => {
    mutateAsyncMock.mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: StatusCodes.BAD_REQUEST },
    });
    await renderResetPasswordForm();

    await user.type(screen.getByLabelText(/^password$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirm password/i), "Password123!");

    expect(
      screen.queryByText(/link is invalid or has expired/i),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /reset password/i }));
    expect(screen.getByText(/link is invalid or has expired/i)).toBeVisible();
  });
});
