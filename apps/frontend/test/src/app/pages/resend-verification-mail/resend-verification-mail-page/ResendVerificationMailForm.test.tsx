import "@/test/__mocks__/i18nContextMock.ts";
import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ResendVerificationMailForm } from "@/src/app/pages/resend-verification-mail/resend-verification-mail-page/ResendVerificationMailForm.tsx";
import { ROUTE_RESEND_VERIFICATION_MAIL_SENT } from "@/src/app/routes/_auth/resend-verification-mail/sent.tsx";
import { userErrorMessages } from "@/src/shared/formErrors.ts";
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

describe("ResendVerificationMailForm", () => {
  afterEach(() => {
    setI18nLoading(false);
    isPending = false;
    vi.clearAllMocks();
  });

  const renderForm = () =>
    renderWithProviders(ResendVerificationMailForm, {
      i18n: true,
      router: {
        pathPattern: "/forgot",
      },
    });

  const user = userEvent.setup();

  it("renders email input and submit button", async () => {
    await renderForm();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /resend verification email/i }),
    ).toBeInTheDocument();
  });

  it("hides content when loading", async () => {
    setI18nLoading(true);
    await renderForm();

    expect(
      screen.queryByRole("button", { name: /resend verification email/i }),
    ).not.toBeInTheDocument();
  });

  it("submits email and calls forgot password mutation", async () => {
    mutateAsyncMock.mockResolvedValueOnce(undefined);

    await renderForm();

    await user.type(screen.getByLabelText(/email/i), "student@example.com");

    await user.click(
      screen.getByRole("button", { name: /resend verification email/i }),
    );

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith("student@example.com");
    });
  });

  it("shows validation error for invalid email", async () => {
    await renderForm();

    await user.type(screen.getByLabelText(/email/i), "not-an-email");

    await user.click(
      screen.getByRole("button", { name: /resend verification email/i }),
    );

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
      name: /resend verification email/i,
    });
    await user.click(button);
    expect(button).toBeDisabled();
  });

  it("navigates to forgot password sent page with email after successful submit", async () => {
    mutateAsyncMock.mockResolvedValueOnce(undefined);

    await renderForm();

    await user.type(screen.getByLabelText(/email/i), "student@example.com");

    await user.click(
      screen.getByRole("button", { name: /resend verification email/i }),
    );
    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith("student@example.com");
    });

    expect(navigateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ROUTE_RESEND_VERIFICATION_MAIL_SENT,
        state: { email: "student@example.com" },
      }),
    );
  });
});
