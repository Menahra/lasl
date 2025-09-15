import { z } from "zod";

export const createUserInputSchema = z.object({
  body: z
    .object({
      firstName: z.string().nonempty({ error: "First name is required" }),
      lastName: z.string().nonempty({ error: "Last name is required" }),
      password: z
        .string()
        .nonempty({ error: "Password is required" })
        .min(8, { error: "Password must be at least 8 characters long" })
        .regex(/[A-Z]/, {
          message: "Password must contain at least one uppercase letter",
        })
        .regex(/[a-z]/, {
          message: "Password must contain at least one lowercase letter",
        })
        .regex(/\d/, { message: "Password must contain at least one number" }),
      passwordConfirmation: z.string().nonempty({
        error: "Password confirmation is required",
      }),
      email: z.email("Please enter a valid email address"),
    })
    .refine((user) => user.password === user.passwordConfirmation, {
      error: "Passwords do not match",
      path: ["passwordConfirmation"],
    }),
});

export const createUserInputJsonSchema = z.toJSONSchema(
  createUserInputSchema.shape.body,
  { target: "draft-7" },
);

export type CreateUserInput = z.infer<typeof createUserInputSchema>;
