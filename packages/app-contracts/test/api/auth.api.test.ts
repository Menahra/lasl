import { describe, expect, it } from "vitest";
import { authApiRoutes } from "@/src/api/auth.api.ts";

describe("authApiRoutes", () => {
  describe("user routes", () => {
    it("creates users (default v1)", () => {
      expect(authApiRoutes.user.create()).toBe("/api/v1/users");
    });

    it("verifies user with params", () => {
      expect(authApiRoutes.user.verify("123", "ABC")).toBe(
        "/api/v1/users/verify/123/ABC",
      );
    });

    it("gets current user", () => {
      expect(authApiRoutes.user.me()).toBe("/api/v1/users/me");
    });

    it("supports explicit version", () => {
      expect(authApiRoutes.user.create("v1")).toBe("/api/v1/users");
    });
  });

  describe("session routes", () => {
    it("creates a session", () => {
      expect(authApiRoutes.session.create()).toBe("/api/v1/sessions");
    });

    it("refreshes a session", () => {
      expect(authApiRoutes.session.refresh()).toBe("/api/v1/sessions/refresh");
    });

    it("logs out", () => {
      expect(authApiRoutes.session.logout()).toBe("/api/v1/sessions/logout");
    });
  });

  describe("miscellaneous routes", () => {
    it("exposes healthcheck", () => {
      expect(authApiRoutes.miscellaneous.health()).toBe("/api/v1/healthcheck");
    });
  });
});
