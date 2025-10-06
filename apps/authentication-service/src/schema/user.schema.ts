import { z } from "zod";
import {
  passwordMatchRefinement,
  userEmailSchema,
  userPasswordWithConfirmationSchema,
} from "./common.user.schema.ts";

export const createUserInputSchema = z.object({
  body: z
    .object({
      firstName: z.string().nonempty({ error: "First name is required" }),
      lastName: z.string().nonempty({ error: "Last name is required" }),
      email: userEmailSchema,
    })
    .extend(userPasswordWithConfirmationSchema.shape)
    .superRefine(passwordMatchRefinement),
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
export const resetPasswordInputSchema = z.object({
  params: z.object({
    id: z.string(),
    passwordResetCode: z.string(),
  }),
  body: userPasswordWithConfirmationSchema.superRefine(passwordMatchRefinement),
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
export const resetPasswordParamsInputJsonSchema = z.toJSONSchema(
  resetPasswordInputSchema.shape.params,
  { target: "draft-7" },
);
export const resetPasswordBodyInputJsonSchema = z.toJSONSchema(
  resetPasswordInputSchema.shape.body,
  { target: "draft-7" },
);

export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type VerifyUserInput = z.infer<typeof verifyUserInputSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordInputSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;
