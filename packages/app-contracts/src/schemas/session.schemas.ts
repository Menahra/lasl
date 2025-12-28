import { z } from "zod";
import { USER_ERRORS } from "@/src/schemas/user.errors.ts";
import {
  USER_PASSWORD_MIN_LENGTH,
  userEmailSchema,
} from "@/src/schemas/user.schemas.ts";

export const vagueSessionErrorMessage = "Invalid email or password";

export const createSessionSchema = z.object({
  body: z.object({
    email: userEmailSchema.nonempty({ error: USER_ERRORS.emailInvalid }),
    password: z
      .string()
      .nonempty({ error: USER_ERRORS.passwordRequired })
      .min(USER_PASSWORD_MIN_LENGTH, vagueSessionErrorMessage),
  }),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
