import { describe, expect, it } from "vitest";
import { createUserInputSchema } from "@/src/schema/user.schema.ts";
import { validUserInput } from "./validInput.ts";

describe("createUserInputSchema password confirmation validation", () => {
  it("fails when password and password confirmation do not match", () => {
    const result = createUserInputSchema.safeParse({
      body: {
        ...validUserInput.body,
        passwordConfirmation: validUserInput.body.password.toUpperCase(),
      },
    });

    expect(result.success).toBeFalsy();
    expect(result.error?.issues).toHaveLength(1);
    expect(result.error?.issues[0].message).toEqual("Passwords do not match");
  });
});
