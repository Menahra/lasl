import "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { StatusCodes } from "http-status-codes";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from "vitest";
import { RegisterForm } from "@/src/app/pages/register-page/RegisterForm.tsx";
import { ROUTE_PRIVACY_POLICY } from "@/src/app/routes/privacy.tsx";
import { ROUTE_TERMS_OF_SERVICE } from "@/src/app/routes/terms.tsx";
import { useCreateUser } from "@/src/shared/hooks/api/useCreateUser.ts";
import { setI18nLoading } from "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { renderWithProviders } from "@/tests/unit-integration/__wrappers__/renderWithProviders.tsx";

const navigateMock = vi.fn();
vi.mock("@tanstack/react-router", async (importOriginalTanstackRouter) => {
  return {
    ...(await importOriginalTanstackRouter<
      typeof import("@tanstack/react-router")
    >()),
    useRouter: () => ({
      navigate: navigateMock,
    }),
  };
});

vi.mock("@/src/shared/hooks/api/useCreateUser.ts", () => ({
  useCreateUser: vi.fn(),
}));

describe("RegisterForm", () => {
  const mutateAsyncMock = vi.fn();

  beforeEach(() => {
    (useCreateUser as Mock).mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
    });
  });

  afterEach(() => {
    setI18nLoading(false);
    vi.clearAllMocks();
  });

  const renderRegisterForm = () =>
    renderWithProviders(RegisterForm, {
      query: true,
      i18n: true,
      router: {
        pathPattern: "/signup",
      },
    });

  const user = userEvent.setup();

  it("renders all input fields", async () => {
    await renderRegisterForm();

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("renders submit button", async () => {
    await renderRegisterForm();

    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
  });

  it("renders legal agreement links", async () => {
    await renderRegisterForm();

    const termsLink = screen.getByRole("link", {
      name: /terms of service/i,
    });

    const privacyLink = screen.getByRole("link", {
      name: /privacy policy/i,
    });

    expect(termsLink).toHaveAttribute("href", ROUTE_TERMS_OF_SERVICE);
    expect(privacyLink).toHaveAttribute("href", ROUTE_PRIVACY_POLICY);
  });

  it("hides content when loading", async () => {
    setI18nLoading(true);
    await renderRegisterForm();

    expect(
      screen.queryByRole("button", { name: /create account/i }),
    ).not.toBeInTheDocument();
  });

  it("submits form successfully and navigates to success page", async () => {
    mutateAsyncMock.mockResolvedValueOnce({ id: "123" });

    await renderWithProviders(RegisterForm, {
      query: true,
      i18n: true,
      router: { pathPattern: "/signup" },
    });

    await user.type(screen.getByLabelText(/first name/i), "Alice");
    await user.type(screen.getByLabelText(/last name/i), "Smith");
    await user.type(screen.getByLabelText(/email/i), "alice@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirm password/i), "Password123!");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(mutateAsyncMock).toHaveBeenCalledWith({
      firstName: "Alice",
      lastName: "Smith",
      email: "alice@example.com",
      password: "Password123!",
      passwordConfirmation: "Password123!",
    });

    expect(navigateMock).toHaveBeenCalledWith({ to: "/register-success" });
  });

  it("shows duplicate error if API responds with 409", async () => {
    const navigateMock = vi.fn();

    mutateAsyncMock.mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: StatusCodes.CONFLICT },
    });

    await renderWithProviders(RegisterForm, {
      query: true,
      i18n: true,
      router: { pathPattern: "/signup" },
    });

    await user.type(screen.getByLabelText(/first name/i), "Alice");
    await user.type(screen.getByLabelText(/last name/i), "Smith");
    await user.type(screen.getByLabelText(/email/i), "alice@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirm password/i), "Password123!");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(screen.getByText(/already registered/i)).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("shows unknown error for other API errors", async () => {
    mutateAsyncMock.mockRejectedValueOnce(new Error("Server Error"));
    await renderWithProviders(RegisterForm, {
      query: true,
      i18n: true,
      router: { pathPattern: "/signup" },
    });

    await user.type(screen.getByLabelText(/first name/i), "Alice");
    await user.type(screen.getByLabelText(/last name/i), "Smith");
    await user.type(screen.getByLabelText(/email/i), "alice@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirm password/i), "Password123!");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(screen.getByText(/unexpected error occurred/i)).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    await renderWithProviders(RegisterForm, {
      query: true,
      i18n: true,
      router: { pathPattern: "/signup" },
    });

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(screen.getAllByText(/is required/i)).toHaveLength(4);
    expect(screen.getByText(/valid email/i)).toBeVisible();
  });
});
