import "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ForgotPasswordForm } from "@/src/app/pages/forgot-password/forgot-password-page/ForgotPasswordForm.tsx";
import { ROUTE_FORGOT_PASSWORD_SENT } from "@/src/app/routes/forgot-password/sent.tsx";
import { ROUTE_LOGIN } from "@/src/app/routes/login.tsx";
import { userErrorMessages } from "@/src/shared/formErrors.ts";
import { setI18nLoading } from "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { renderWithProviders } from "@/tests/unit-integration/__wrappers__/renderWithProviders.tsx";

const mutateAsyncMock = vi.fn();
let isPending = false;

vi.mock("@/src/shared/hooks/api/useAuthentication.ts", () => ({
  usePostForgotPassword: () => ({
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

describe("ForgotPasswordForm", () => {
  afterEach(() => {
    setI18nLoading(false);
    isPending = false;
    vi.clearAllMocks();
  });

  const renderForm = () =>
    renderWithProviders(ForgotPasswordForm, {
      i18n: true,
      router: {
        pathPattern: "/forgot",
      },
    });

  const user = userEvent.setup();

  it("renders title and subtitle", async () => {
    await renderForm();

    expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();

    expect(
      screen.getByText(/send you reset instructions/i),
    ).toBeInTheDocument();
  });

  it("renders email input and submit button", async () => {
    await renderForm();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /send reset link/i }),
    ).toBeInTheDocument();
  });

  it("renders back to sign in button", async () => {
    await renderForm();

    expect(
      screen.getByRole("button", { name: /back to sign in/i }),
    ).toBeInTheDocument();
  });

  it("hides content when loading", async () => {
    setI18nLoading(true);
    await renderForm();

    expect(
      screen.queryByRole("button", { name: /send reset link/i }),
    ).not.toBeInTheDocument();
  });

  it("submits email and calls forgot password mutation", async () => {
    mutateAsyncMock.mockResolvedValueOnce(undefined);

    await renderForm();

    await user.type(screen.getByLabelText(/email/i), "student@example.com");

    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith("student@example.com");
    });
  });

  it("shows validation error for invalid email", async () => {
    await renderForm();

    await user.type(screen.getByLabelText(/email/i), "not-an-email");

    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(
      await screen.findByText(
        userErrorMessages["errors.user.email.invalid"].message ?? "",
      ),
    ).toBeInTheDocument();

    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("disables submit button while submitting", async () => {
    isPending = true;
    mutateAsyncMock.mockImplementation(() => new Promise(() => undefined));

    await renderForm();

    const button = screen.getByRole("button", {
      name: /send reset link/i,
    });
    await user.click(button);
    expect(button).toBeDisabled();
  });

  it("renders a link back to the sign in page", async () => {
    await renderForm();

    const backLink = screen.getByRole("link", {
      name: /back to sign in/i,
    });

    expect(backLink).toHaveAttribute("href", ROUTE_LOGIN);
  });

  it("navigates to forgot password sent page with email after successful submit", async () => {
    mutateAsyncMock.mockResolvedValueOnce(undefined);

    await renderForm();

    await user.type(screen.getByLabelText(/email/i), "student@example.com");

    await user.click(screen.getByRole("button", { name: /send reset link/i }));
    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith("student@example.com");
    });

    expect(navigateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ROUTE_FORGOT_PASSWORD_SENT,
        state: { email: "student@example.com" },
      }),
    );
  });
});
