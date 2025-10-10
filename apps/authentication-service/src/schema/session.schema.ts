import z from "zod";
import { PASSWORD_MIN_LENGTH, userEmailSchema } from "./common.user.schema.ts";

export const vagueSessionErrorMessage = "Invalid email or password";

export const createSessionSchema = z.object({
  body: z.object({
    email: userEmailSchema.nonempty({ error: "Email is required" }),
    password: z
      .string()
      .nonempty({ error: "Password is required" })
      .min(PASSWORD_MIN_LENGTH, vagueSessionErrorMessage),
  }),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

export const createSessionJsonSchema = z.toJSONSchema(
  createSessionSchema.shape.body,
  { target: "draft-7" },
);
