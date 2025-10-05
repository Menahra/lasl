import { z } from "zod";

const userEmailSchema = z.email("Please enter a valid email address");

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
      email: userEmailSchema,
    })
    .refine((user) => user.password === user.passwordConfirmation, {
      error: "Passwords do not match",
      path: ["passwordConfirmation"],
    }),
});

export const verifyUserInputSchema = z.object({
  params: z.object({
    id: z.string(),
    verificationCode: z.string(),
  }),
});

export const forgotPasswordInputSchema = z.object({
  body: z.object({
    email: userEmailSchema,
  }),
});

export const createUserInputJsonSchema = z.toJSONSchema(
  createUserInputSchema.shape.body,
  { target: "draft-7" },
);

export const verifyUserInputJsonSchema = z.toJSONSchema(
  verifyUserInputSchema.shape.params,
  { target: "draft-7" },
);

export const forgotPasswordInputJsonSchema = z.toJSONSchema(
  forgotPasswordInputSchema.shape.body,
  { target: "draft-7" },
);

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export type VerifyUserInput = z.infer<typeof verifyUserInputSchema>;

export type ForgotPasswordInput = z.infer<typeof forgotPasswordInputSchema>;
