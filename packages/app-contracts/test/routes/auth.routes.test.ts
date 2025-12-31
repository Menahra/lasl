import { describe, expect, it } from "vitest";
import { authRoutes } from "@/src/routes/auth.routes.ts";

describe("authRoutes", () => {
  it("home route", () => {
    expect(authRoutes.home).toBe("/");
  });

  it("register routes", () => {
    expect(authRoutes.register).toBe("/register");
    expect(authRoutes.registerSuccess).toBe("/register/success");
    expect(authRoutes.registerVerified).toBe("/register/verified");
  });

  it("login route", () => {
    expect(authRoutes.login).toBe("/login");
  });

  it("forgot password routes", () => {
    expect(authRoutes.forgotPassword).toBe("/forgot-password");
    expect(authRoutes.forgotPasswordSent).toBe("/forgot-password/sent");
  });

  it("reset password dynamic route", () => {
    expect(authRoutes.resetPassword("123", "ABC")).toBe(
      "/reset-password/123/ABC",
    );
  });

  it("reset password sent route", () => {
    expect(authRoutes.resetPasswordSent).toBe("/reset-password/sent");
  });
});
