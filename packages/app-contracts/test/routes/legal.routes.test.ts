import { describe, expect, it } from "vitest";
import { legalRoutes } from "@/src/routes/legal.routes.ts";

describe("legalRoutes", () => {
  it("imprint route", () => {
    expect(legalRoutes.imprint).toBe("/imprint");
  });

  it("privacy route", () => {
    expect(legalRoutes.privacy).toBe("/privacy");
  });

  it("terms route", () => {
    expect(legalRoutes.terms).toBe("/terms");
  });
});
