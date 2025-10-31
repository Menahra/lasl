import { describe, expect, it } from "vitest";
import z from "zod";
import { PASSWORD_MIN_LENGTH } from "@/src/schema/common.user.schema.ts";
import {
  createSessionSchema,
  vagueSessionErrorMessage,
} from "@/src/schema/session.schema.ts";

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: ok here
// biome-ignore lint/security/noSecrets: not a secret
describe("createSessionSchema", () => {
  const validEmail = "user@example.com";
  const validPassword = "a".repeat(PASSWORD_MIN_LENGTH);

  it("should pass with valid input", () => {
    const result = createSessionSchema.safeParse({
      body: {
        email: validEmail,
        password: validPassword,
      },
    });

    expect(result.success).toBe(true);
  });

  it("should fail if email is missing", () => {
    const result = createSessionSchema.safeParse({
      body: {
        password: validPassword,
      },
    });

    expect(result.success).toBe(false);
    expect(
      // biome-ignore lint/style/noNonNullAssertion: ok in test
      z.treeifyError(result.error!).properties?.body?.properties?.email?.errors,
    ).toContain("Please enter a valid email address");
  });

  it("should fail if password is missing", () => {
    const result = createSessionSchema.safeParse({
      body: {
        email: validEmail,
      },
    });

    expect(result.success).toBe(false);
    expect(
      // biome-ignore lint/style/noNonNullAssertion: ok in test
      z.treeifyError(result.error!).properties?.body?.properties?.password
        ?.errors,
    ).toContain("Invalid input: expected string, received undefined");
  });

  it("should fail if email is empty string", () => {
    const result = createSessionSchema.safeParse({
      body: {
        email: "",
        password: validPassword,
      },
    });

    expect(result.success).toBe(false);
    expect(
      // biome-ignore lint/style/noNonNullAssertion: ok in test
      z.treeifyError(result.error!).properties?.body?.properties?.email?.errors,
    ).toContain("Email is required");
  });

  it("should fail if password is empty string", () => {
    const result = createSessionSchema.safeParse({
      body: {
        email: validEmail,
        password: "",
      },
    });

    expect(result.success).toBe(false);
    expect(
      // biome-ignore lint/style/noNonNullAssertion: ok in test
      z.treeifyError(result.error!).properties?.body?.properties?.password
        ?.errors,
    ).toContain("Password is required");
  });

  it("should fail if email is invalid format", () => {
    const result = createSessionSchema.safeParse({
      body: {
        email: "invalid-email",
        password: validPassword,
      },
    });

    expect(result.success).toBe(false);
    expect(
      // biome-ignore lint/style/noNonNullAssertion: ok in test
      z.treeifyError(result.error!).properties?.body?.properties?.email?.errors,
    ).toContain("Please enter a valid email address");
  });

  it("should fail if password is too short", () => {
    const result = createSessionSchema.safeParse({
      body: {
        email: validEmail,
        password: "short",
      },
    });

    expect(result.success).toBe(false);
    expect(
      // biome-ignore lint/style/noNonNullAssertion: ok in test
      z.treeifyError(result.error!).properties?.body?.properties?.password
        ?.errors,
    ).toContain(vagueSessionErrorMessage);
  });
});
