import { z } from "zod";

type UserPasswordWithConformationSchema = z.infer<
  typeof userPasswordWithConfirmationSchema
>;

export const userEmailSchema = z.email({
  error: "Please enter a valid email address",
});

export const PASSWORD_MIN_LENGTH = 8;
export const userPasswordSchema = z
  .string()
  .nonempty({ error: "Password is required" })
  .min(PASSWORD_MIN_LENGTH, {
    error: "Password must be at least 8 characters long",
  })
  .regex(/[A-Z]/, {
    error: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    error: "Password must contain at least one lowercase letter",
  })
  .regex(/\d/, { error: "Password must contain at least one number" });
export const userPasswordConfirmationSchema = z.string().nonempty({
  error: "Password confirmation is required",
});
export const userPasswordWithConfirmationSchema = z.object({
  password: userPasswordSchema,
  passwordConfirmation: userPasswordConfirmationSchema,
});

export const passwordMatchRefinement = <
  T extends UserPasswordWithConformationSchema,
>(
  data: T,
  ctx: z.RefinementCtx,
) => {
  if (data.password !== data.passwordConfirmation) {
    ctx.addIssue({
      // biome-ignore lint/security/noSecrets: property name
      path: ["passwordConfirmation"],
      code: "custom",
      message: "Passwords do not match",
    });
  }
};

export const userPasswordWithConfirmationAndRefinementSchema =
  userPasswordWithConfirmationSchema.superRefine(passwordMatchRefinement);

export const createUserSchema = z
  .object({
    firstName: z.string().nonempty({ error: "First name is required" }),
    lastName: z.string().nonempty({ error: "Last name is required" }),
    email: userEmailSchema,
  })
  .extend(userPasswordWithConfirmationSchema.shape)
  .superRefine(passwordMatchRefinement);
