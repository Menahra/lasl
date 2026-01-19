import { z } from "zod";
import { USER_ERRORS } from "@/src/schemas/user.errors.ts";

type UserPasswordWithConformationSchema = z.infer<
  typeof userPasswordWithConfirmationSchema
>;

export const userEmailSchema = z.email({
  error: USER_ERRORS.emailInvalid,
});

export const USER_PASSWORD_MIN_LENGTH = 8;
export const userPasswordSchema = z
  .string()
  .nonempty({ error: USER_ERRORS.passwordRequired })
  .min(USER_PASSWORD_MIN_LENGTH, {
    error: USER_ERRORS.passwordMinLength,
  })
  .regex(/[A-Z]/, {
    error: USER_ERRORS.passwordUppercase,
  })
  .regex(/[a-z]/, {
    error: USER_ERRORS.passwordLowercase,
  })
  .regex(/\d/, { error: USER_ERRORS.passwordNumber });
export const userPasswordConfirmationSchema = z.string().nonempty({
  error: USER_ERRORS.passwordConfirmationRequired,
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
      message: USER_ERRORS.passwordMismatch,
    });
  }
};

export const userPasswordWithConfirmationAndRefinementSchema =
  userPasswordWithConfirmationSchema.superRefine(passwordMatchRefinement);

export const createUserSchemaBase = z
  .object({
    firstName: z.string().nonempty({ error: USER_ERRORS.firstNameRequired }),
    lastName: z.string().nonempty({ error: USER_ERRORS.lastNameRequired }),
    email: userEmailSchema,
  })
  .extend(userPasswordWithConfirmationSchema.shape);

export const createUserSchema = createUserSchemaBase.superRefine(
  passwordMatchRefinement,
);

export const resetPasswordParamsSchema = z.object({
  id: z.string(),
  passwordResetCode: z.string(),
});
