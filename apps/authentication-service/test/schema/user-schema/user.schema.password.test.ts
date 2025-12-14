import { describe, expect, it } from "vitest";
import { createUserInputSchema } from "@/src/schema/user.schema.ts";
import { validUserInput } from "./validInput.ts";

describe("createUserInputSchema password validation", () => {
  const passwordMustContainUppercaseLetterMessage =
    "Password must contain at least one uppercase letter";
  const passwordMustContainLowercaseLetterMessage =
    "Password must contain at least one lowercase letter";
  const passwordMustContainNumberMessage =
    "Password must contain at least one number";
  const passwordMinimumLengthMessage =
    "Password must be at least 8 characters long";

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
      passwordMustContainUppercaseLetterMessage,
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
      passwordMustContainLowercaseLetterMessage,
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
    expect(result.error?.issues[0].message).toEqual(
      passwordMustContainNumberMessage,
    );
  });

  const tooShortPasswordTestData = [
    {
      password: "P",
      errorCount: 3,
      messages: [
        passwordMinimumLengthMessage,
        passwordMustContainLowercaseLetterMessage,
        passwordMustContainNumberMessage,
      ],
    },
    {
      password: "Pa",
      errorCount: 2,
      messages: [
        passwordMinimumLengthMessage,
        passwordMustContainNumberMessage,
      ],
    },
    {
      password: "Pa1",
      errorCount: 1,
      messages: [passwordMinimumLengthMessage],
    },
    {
      password: "Pa12",
      errorCount: 1,
      messages: [passwordMinimumLengthMessage],
    },
    {
      password: "Pa123",
      errorCount: 1,
      messages: [passwordMinimumLengthMessage],
    },
    {
      password: "Pa1234",
      errorCount: 1,
      messages: [passwordMinimumLengthMessage],
    },

    {
      password: "Pa12345",
      errorCount: 1,
      messages: [passwordMinimumLengthMessage],
    },
  ];
  it.each(
    tooShortPasswordTestData,
  )("fails when password does contain less than eight characters", ({
    password,
    errorCount,
    messages,
  }) => {
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
  });
});
