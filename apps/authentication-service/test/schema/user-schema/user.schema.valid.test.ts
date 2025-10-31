import { describe, expect, it } from "vitest";
import { createUserInputSchema } from "@/src/schema/user.schema.ts";
import { validUserInput } from "./validInput.ts";

// biome-ignore lint/security/noSecrets: not a secret
describe("createUserInputSchema password confirmation validation", () => {
  it("succeeds if input is valid", () => {
    const result = createUserInputSchema.safeParse(validUserInput);

    expect(result.success).toBeTruthy();
  });
});
