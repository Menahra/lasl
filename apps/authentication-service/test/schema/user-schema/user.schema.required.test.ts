import { USER_ERRORS } from "@lasl/app-contracts/errors/user";
import { describe, expect, it } from "vitest";
import {
  createUserInputSchema,
  updateUserInputSchema,
} from "@/src/schema/user.schema.ts";
import { validUserInput } from "./validInput.ts";

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
    expect(result.error?.issues[0].message).toEqual(
      USER_ERRORS.firstNameRequired,
    );
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
    expect(result.error?.issues[0].message).toEqual(
      USER_ERRORS.lastNameRequired,
    );
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
    expect(result.error?.issues).toHaveLength(6);
    expect(result.error?.issues[0].message).toEqual(
      USER_ERRORS.passwordRequired,
    );
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
      USER_ERRORS.passwordConfirmationRequired,
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
    expect(result.error?.issues[0].message).toEqual(USER_ERRORS.emailInvalid);
  });
});

describe("validation of updateUserInputSchema", () => {
  it("everything is optional", () => {
    const result = updateUserInputSchema.safeParse({ body: {} });
    expect(result.success).toBeTruthy();
  });

  it("can contain firstName and settings object", () => {
    const result = updateUserInputSchema.safeParse({
      body: { firstName: "Tester", settings: { uiLanguage: "de-DE" } },
    });
    expect(result.success).toBeTruthy();
  });

  it("additional properties in settings object not allowed", () => {
    const result = updateUserInputSchema.safeParse({
      body: { settings: { someProperty: "cool" } },
    });
    expect(result.success).toBeFalsy();
    expect(result.error?.issues).toHaveLength(1);
    expect(result.error?.issues[0].message).toEqual(
      'Unrecognized key: "someProperty"',
    );
  });
});
