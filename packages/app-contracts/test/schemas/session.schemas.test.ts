import { USER_PASSWORD_MIN_LENGTH } from "@lasl/app-contracts/schemas/user";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  createSessionSchema,
  vagueSessionErrorMessage,
} from "@/src/schemas/session.schemas.ts";

describe("createSessionSchema", () => {
  const validEmail = "user@example.com";
  const validPassword = "a".repeat(USER_PASSWORD_MIN_LENGTH);

  it("should pass with valid input", () => {
    const result = createSessionSchema.safeParse({
      email: validEmail,
      password: validPassword,
    });

    expect(result.success).toBe(true);
  });

  it("should fail if email is missing", () => {
    const result = createSessionSchema.safeParse({
      password: validPassword,
    });

    expect(result.success).toBe(false);
    expect(
      // biome-ignore lint/style/noNonNullAssertion: ok in test
      z.treeifyError(result.error!).properties?.email?.errors,
    ).toContain("errors.user.email.invalid");
  });

  it("should fail if password is missing", () => {
    const result = createSessionSchema.safeParse({
      email: validEmail,
    });

    expect(result.success).toBe(false);
    expect(
      // biome-ignore lint/style/noNonNullAssertion: ok in test
      z.treeifyError(result.error!).properties?.password?.errors,
    ).toContain("Invalid input: expected string, received undefined");
  });

  it("should fail if email is empty string", () => {
    const result = createSessionSchema.safeParse({
      email: "",
      password: validPassword,
    });

    expect(result.success).toBe(false);
    expect(
      // biome-ignore lint/style/noNonNullAssertion: ok in test
      z.treeifyError(result.error!).properties?.email?.errors,
    ).toContain("errors.user.email.invalid");
  });

  it("should fail if password is empty string", () => {
    const result = createSessionSchema.safeParse({
      email: validEmail,
      password: "",
    });

    expect(result.success).toBe(false);
    expect(
      // biome-ignore lint/style/noNonNullAssertion: ok in test
      z.treeifyError(result.error!).properties?.password?.errors,
    ).toContain("errors.user.password.required");
  });

  it("should fail if email is invalid format", () => {
    const result = createSessionSchema.safeParse({
      email: "invalid-email",
      password: validPassword,
    });

    expect(result.success).toBe(false);
    expect(
      // biome-ignore lint/style/noNonNullAssertion: ok in test
      z.treeifyError(result.error!).properties?.email?.errors,
    ).toContain("errors.user.email.invalid");
  });

  it("should fail if password is too short", () => {
    const result = createSessionSchema.safeParse({
      email: validEmail,
      password: "short",
    });

    expect(result.success).toBe(false);
    expect(
      // biome-ignore lint/style/noNonNullAssertion: ok in test
      z.treeifyError(result.error!).properties?.password?.errors,
    ).toContain(vagueSessionErrorMessage);
  });
});
