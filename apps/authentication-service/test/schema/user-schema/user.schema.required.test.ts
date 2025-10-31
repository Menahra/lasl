import { describe, expect, it } from "vitest";
import { createUserInputSchema } from "@/src/schema/user.schema.ts";
import { validUserInput } from "./validInput.ts";

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: ok in test
// biome-ignore lint/security/noSecrets: not a secret
describe("validation of createUserInputSchema", () => {
  it("fails when firstName is missing", () => {
    const { firstName: _firstName, ...schemaWithoutFirstName } =
      validUserInput.body;
    const result = createUserInputSchema.safeParse({
      body: {
        firstName: "",
        ...schemaWithoutFirstName,
      },
    });

    expect(result.success).toBeFalsy();
    expect(result.error?.issues).toHaveLength(1);
    expect(result.error?.issues[0].message).toEqual("First name is required");
  });

  it("fails when lastName is missing", () => {
    const { lastName: _lastName, ...schemaWithoutLastName } =
      validUserInput.body;
    const result = createUserInputSchema.safeParse({
      body: {
        lastName: "",
        ...schemaWithoutLastName,
      },
    });

    expect(result.success).toBeFalsy();
    expect(result.error?.issues).toHaveLength(1);
    expect(result.error?.issues[0].message).toEqual("Last name is required");
  });

  it("fails when password is missing", () => {
    const { password: _password, ...schemaWithoutPassword } =
      validUserInput.body;
    const result = createUserInputSchema.safeParse({
      body: {
        password: "",
        ...schemaWithoutPassword,
      },
    });

    expect(result.success).toBeFalsy();
    // biome-ignore lint/style/noMagicNumbers: ok here
    expect(result.error?.issues).toHaveLength(6);
    expect(result.error?.issues[0].message).toEqual("Password is required");
  });

  it("fails when password confirmation is missing", () => {
    const {
      passwordConfirmation: _passwordConfirmation,
      ...schemaWithoutPasswordConfirmation
    } = validUserInput.body;
    const result = createUserInputSchema.safeParse({
      body: {
        passwordConfirmation: "",
        ...schemaWithoutPasswordConfirmation,
      },
    });

    expect(result.success).toBeFalsy();
    expect(result.error?.issues).toHaveLength(2);
    expect(result.error?.issues[0].message).toEqual(
      "Password confirmation is required",
    );
  });

  it("fails when email is missing", () => {
    const { email: _email, ...schemaWithoutEmail } = validUserInput.body;
    const result = createUserInputSchema.safeParse({
      body: {
        email: "",
        ...schemaWithoutEmail,
      },
    });

    expect(result.success).toBeFalsy();
    expect(result.error?.issues).toHaveLength(1);
    expect(result.error?.issues[0].message).toEqual(
      "Please enter a valid email address",
    );
  });
});
