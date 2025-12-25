import {
  USER_PASSWORD_MIN_LENGTH,
  userEmailSchema,
} from "@lasl/app-contracts/schemas/user";
import z from "zod";

export const vagueSessionErrorMessage = "Invalid email or password";

export const createSessionSchema = z.object({
  body: z.object({
    email: userEmailSchema.nonempty({ error: "Email is required" }),
    password: z
      .string()
      .nonempty({ error: "Password is required" })
      .min(USER_PASSWORD_MIN_LENGTH, vagueSessionErrorMessage),
  }),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

export const createSessionJsonSchema = z.toJSONSchema(
  createSessionSchema.shape.body,
  { target: "draft-7" },
);
