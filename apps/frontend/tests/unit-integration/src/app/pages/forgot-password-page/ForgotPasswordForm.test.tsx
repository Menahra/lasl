import "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ForgotPasswordForm } from "@/src/app/pages/forgot-password-page/ForgotPasswordForm.tsx";
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

describe("ForgotPasswordForm", () => {
  afterEach(() => {
    setI18nLoading(false);
    vi.clearAllMocks();
  });

  const renderForm = () =>
    renderWithProviders(ForgotPasswordForm, {
      i18n: true,
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
});
