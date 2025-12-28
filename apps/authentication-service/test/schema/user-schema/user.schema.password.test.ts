import { USER_ERRORS } from "@lasl/app-contracts/errors/user";
import { describe, expect, it } from "vitest";
import { createUserInputSchema } from "@/src/schema/user.schema.ts";
import { validUserInput } from "./validInput.ts";

describe("createUserInputSchema password validation", () => {
  it("fails when password does not contain an uppercase letter", () => {
    const passwordWithoutUppercaseLetter = "password123";
    const result = createUserInputSchema.safeParse({
      body: {
        ...validUserInput.body,
        password: passwordWithoutUppercaseLetter,
        passwordConfirmation: passwordWithoutUppercaseLetter,
      },
    });

    expect(result.success).toBeFalsy();
    expect(result.error?.issues).toHaveLength(1);
    expect(result.error?.issues[0].message).toEqual(
      USER_ERRORS.passwordUppercase,
    );
  });

  it("fails when password does not contain a lowercase letter", () => {
    const passwordWithoutUppercaseLetter = "PASSWORD123";
    const result = createUserInputSchema.safeParse({
      body: {
        ...validUserInput.body,
        password: passwordWithoutUppercaseLetter,
        passwordConfirmation: passwordWithoutUppercaseLetter,
      },
    });

    expect(result.success).toBeFalsy();
    expect(result.error?.issues).toHaveLength(1);
    expect(result.error?.issues[0].message).toEqual(
      USER_ERRORS.passwordLowercase,
    );
  });

  it("fails when password does not contain a number", () => {
    const passwordWithoutUppercaseLetter = "PasswordPASS";
    const result = createUserInputSchema.safeParse({
      body: {
        ...validUserInput.body,
        password: passwordWithoutUppercaseLetter,
        passwordConfirmation: passwordWithoutUppercaseLetter,
      },
    });

    expect(result.success).toBeFalsy();
    expect(result.error?.issues).toHaveLength(1);
    expect(result.error?.issues[0].message).toEqual(USER_ERRORS.passwordNumber);
  });

  const tooShortPasswordTestData = [
    {
      password: "P",
      errorCount: 3,
      messages: [
        USER_ERRORS.passwordMinLength,
        USER_ERRORS.passwordLowercase,
        USER_ERRORS.passwordNumber,
      ],
    },
    {
      password: "Pa",
      errorCount: 2,
      messages: [USER_ERRORS.passwordMinLength, USER_ERRORS.passwordNumber],
    },
    {
      password: "Pa1",
      errorCount: 1,
      messages: [USER_ERRORS.passwordMinLength],
    },
    {
      password: "Pa12",
      errorCount: 1,
      messages: [USER_ERRORS.passwordMinLength],
    },
    {
      password: "Pa123",
      errorCount: 1,
      messages: [USER_ERRORS.passwordMinLength],
    },
    {
      password: "Pa1234",
      errorCount: 1,
      messages: [USER_ERRORS.passwordMinLength],
    },

    {
      password: "Pa12345",
      errorCount: 1,
      messages: [USER_ERRORS.passwordMinLength],
    },
  ];
  it.each(tooShortPasswordTestData)(
    "fails when password does contain less than eight characters",
    ({ password, errorCount, messages }) => {
      const result = createUserInputSchema.safeParse({
        body: {
          ...validUserInput.body,
          password,
          passwordConfirmation: password,
        },
      });

      expect(result.success).toBeFalsy();
      expect(result.error?.issues).toHaveLength(errorCount);
      for (const [index, message] of messages.entries()) {
        expect(result.error?.issues[index].message).toEqual(message);
      }
    },
  );
});
