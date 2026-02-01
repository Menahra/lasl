import "@/test/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AuthFormErrorCallout,
  type AuthFromErrorCalloutProps,
} from "@/src/shared/components/auth-form-error-callout/AuthFormErrorCallout.tsx";
import { setI18nLoading } from "@/test/__mocks__/i18nContextMock.ts";
import { renderWithProviders } from "@/test/__wrappers__/renderWithProviders.tsx";

vi.mock("@/src/shared/components/text-link/TextLink.tsx", () => ({
  // biome-ignore lint/style/useNamingConvention: acceptable here
  TextLink: ({ children }: { children: React.ReactNode }) => (
    <a href="test">{children}</a>
  ),
}));

describe("FormErrorCallout", () => {
  const user = userEvent.setup();
  const onCloseMock = vi.fn();

  const renderAuthFormErrorCallout = (props: AuthFromErrorCalloutProps) =>
    renderWithProviders(() => <AuthFormErrorCallout {...props} />, {
      i18n: true,
    });

  afterEach(() => {
    setI18nLoading(false);
  });

  it("returns null when error is 'none'", async () => {
    const { container } = await renderAuthFormErrorCallout({
      error: "none",
      onClose: onCloseMock,
    });
    expect(container.firstChild).toBeNull();
  });

  it("renders the rate-limit message with pluralization", async () => {
    await renderAuthFormErrorCallout({
      error: "rate-limited",
      retryAfter: 1,
      onClose: onCloseMock,
    });
    expect(screen.getByText(/Please wait 1 second/i)).toBeDefined();

    await renderAuthFormErrorCallout({
      error: "rate-limited",
      retryAfter: 45,
      onClose: onCloseMock,
    });
    expect(screen.getByText(/Please wait 45 seconds/i)).toBeDefined();
  });

  it("renders the duplicate email message with a sign-in link", async () => {
    await renderAuthFormErrorCallout({
      error: "duplicate",
      onClose: onCloseMock,
    });
    expect(screen.getByText(/Email already registered/i)).toBeDefined();
    expect(screen.getByRole("link", { name: /Sign in/i })).toBeDefined();
  });

  it("calls onClose when the callout is dismissed", async () => {
    await renderAuthFormErrorCallout({
      error: "unknown",
      onClose: onCloseMock,
    });
    const closeButton = screen.getByRole("button");
    await user.click(closeButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
