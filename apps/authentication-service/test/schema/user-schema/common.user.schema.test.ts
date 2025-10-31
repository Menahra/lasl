import { describe, expect, it } from "vitest";
import {
  userEmailSchema,
  userPasswordSchema,
  userPasswordWithConfirmationAndRefinementSchema,
} from "@/src/schema/common.user.schema.ts";

describe("common user schema > email", () => {
  it.each([
    ["valid email", "test@example.com", true],
    ["missing @", "testexample.com", false],
    ["missing domain", "test@", false],
    ["empty string", "", false],
    ["valid email with subdomain", "user@mail.example.com", true],
  ])("should validate %s", (_, email, isValid) => {
    if (isValid) {
      expect(() => userEmailSchema.parse(email)).not.toThrow();
    } else {
      expect(() => userEmailSchema.parse(email)).toThrow();
    }
  });
});

describe("common user schema > password", () => {
  it.each([
    ["valid password", "StrongPass1", true],
    ["too short", "S1a", false],
    ["no uppercase", "strongpass1", false],
    ["no lowercase", "STRONGPASS1", false],
    ["no number", "StrongPass", false],
    ["empty string", "", false],
  ])("should validate %s", (_, password, isValid) => {
    if (isValid) {
      expect(() => userPasswordSchema.parse(password)).not.toThrow();
    } else {
      expect(() => userPasswordSchema.parse(password)).toThrow();
    }
  });
});

describe("common user schema > password with confirmation", () => {
  it.each([
    ["matching valid passwords", "ValidPass1", "ValidPass1", true],
    // biome-ignore lint/security/noSecrets: not a secret
    ["mismatched passwords", "ValidPass1", "InvalidPass1", false],
    ["missing confirmation", "ValidPass1", "", false],
    ["both empty", "", "", false],
  ])("should validate %s", (_, password, confirmation, isValid) => {
    const input = { password, passwordConfirmation: confirmation };

    if (isValid) {
      expect(() =>
        userPasswordWithConfirmationAndRefinementSchema.parse(input),
      ).not.toThrow();
    } else {
      expect(() =>
        userPasswordWithConfirmationAndRefinementSchema.parse(input),
      ).toThrow();
    }
  });
});
