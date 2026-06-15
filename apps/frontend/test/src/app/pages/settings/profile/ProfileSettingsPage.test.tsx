import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ProfileSettingsPage } from "@/src/app/pages/settings/profile/ProfileSettingsPage.tsx";
import { server } from "@/test/__msw__/setupMsw.ts";
import { AUTH_API_URL, API_BASE_URL } from "@/src/api/apiClient.ts";
import { renderWithProviders } from "@/test/__wrappers__/renderWithProviders.tsx";
import { useAuthenticationContext } from "@/src/shared/hooks/useAuthenticationContext.tsx";

const mockedNavigate = vi.fn();

vi.mock("@/src/shared/hooks/useI18nContext.tsx", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/src/shared/hooks/useI18nContext.tsx")>();
  return {
    ...actual,
    useI18nContext: () => ({ isLoading: false }),
  };
});

vi.mock("@/src/shared/hooks/useAuthenticationContext.tsx", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/src/shared/hooks/useAuthenticationContext.tsx")>();
  return {
    ...actual,
    useAuthenticationContext: vi.fn(),
  };
});

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
    useRouter: () => ({
      navigate: mockedNavigate,
    }),
  };
});

describe("ProfileSettingsPage", () => {
  beforeEach(() => {
    vi.mocked(useAuthenticationContext).mockReturnValue({
      user: {
        id: "1",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        settings: {
          darkMode: false,
          uiLanguage: "en-US",
          contentLanguage: "en-US"
        }
      },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  it("renders profile details correctly", async () => {
    await renderWithProviders(ProfileSettingsPage, {
      query: true,
      i18n: true,
    });

    expect(await screen.findByDisplayValue("John")).toBeInTheDocument();
    expect(await screen.findByDisplayValue("Doe")).toBeInTheDocument();
    expect(await screen.findByDisplayValue("test@example.com")).toBeDisabled();
  });

  it("validates empty first name", async () => {
    await renderWithProviders(ProfileSettingsPage, {
      query: true,
      i18n: true,
    });

    const firstNameInput = await screen.findByDisplayValue("John");
    const saveButton = await screen.findByRole("button", { name: "Save Changes" });

    await userEvent.clear(firstNameInput);
    await userEvent.click(saveButton);

    expect(await screen.findByText("errors.user.firstName.required")).toBeInTheDocument();
  });

  it("validates password mismatch", async () => {
    await renderWithProviders(ProfileSettingsPage, {
      query: true,
      i18n: true,
    });

    const currentPasswordInput = await screen.findByLabelText("Current Password");
    const newPasswordInput = await screen.findByLabelText("New Password");
    const confirmPasswordInput = await screen.findByLabelText("Confirm New Password");
    const updateButton = await screen.findByRole("button", { name: "Update Password" });

    await userEvent.type(currentPasswordInput, "OldPass123");
    await userEvent.type(newPasswordInput, "NewPass123");
    await userEvent.type(confirmPasswordInput, "MismatchPass123");
    await userEvent.click(updateButton);

    expect(await screen.findByText("errors.user.password.mismatch")).toBeInTheDocument();
  });

  it("handles account deletion flow", async () => {
    server.use(
      http.delete(`${API_BASE_URL}${AUTH_API_URL}/users/me`, () => HttpResponse.json({}, { status: 200 })),
      http.post(`${API_BASE_URL}${AUTH_API_URL}/sessions/logout`, () => HttpResponse.json({}, { status: 200 })),
    );

    const { authApi } = await import("@/src/api/authApi.ts");
    const logoutSpy = vi.spyOn(authApi, "logout").mockResolvedValue({} as any);

    await renderWithProviders(ProfileSettingsPage, {
      query: true,
      i18n: true,
      router: {
        pathPattern: "/settings/profile",
      }
    });

    const user = userEvent.setup();

    const deleteAccountButton = await screen.findByRole("button", { name: "Delete Account" });
    await user.click(deleteAccountButton);

    const confirmButton = await screen.findByRole("button", { name: "Confirm Deletion" });

    const deletePasswordInput = await waitFor(() => {
      const input = document.querySelector("#deletePassword") as HTMLInputElement;
      if (!input) throw new Error("Input not found");
      return input;
    });

    await user.type(deletePasswordInput, "CorrectPass123");

    await user.click(confirmButton);

    await waitFor(() => {
      expect(logoutSpy).toHaveBeenCalled();
      expect(mockedNavigate).toHaveBeenCalledWith(
        expect.objectContaining({ to: "/login" })
      );
    });
  });
});