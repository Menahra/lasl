import { SUPPORTED_LOCALES } from "@lasl/app-contracts/locales";
import {
  createUserSchema,
  passwordMatchRefinement,
  userEmailSchema,
  userPasswordWithConfirmationSchema,
} from "@lasl/app-contracts/schemas/user";
import { z } from "zod";

const ZOD_JSON_SCHEMA_TARGET = "draft-7";

export const createUserInputSchema = z.object({
  body: createUserSchema,
});
export const updateUserInputSchema = z.object({
  body: createUserInputSchema.shape.body
    .pick({ firstName: true, lastName: true })
    .partial()
    .extend({
      settings: z
        .strictObject({
          darkMode: z.boolean().optional(),
          uiLanguage: z.enum(SUPPORTED_LOCALES).optional(),
          contentLanguage: z.enum(SUPPORTED_LOCALES).optional(),
        })
        .optional(),
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
export const resetPasswordInputSchema = z.object({
  params: z.object({
    id: z.string(),
    passwordResetCode: z.string(),
  }),
  body: userPasswordWithConfirmationSchema.superRefine(passwordMatchRefinement),
});

export const createUserInputJsonSchema = z.toJSONSchema(
  createUserInputSchema.shape.body,
  { target: ZOD_JSON_SCHEMA_TARGET },
);

export const updateUserInputJsonSchema = z.toJSONSchema(
  updateUserInputSchema.shape.body,
  { target: ZOD_JSON_SCHEMA_TARGET },
);

export const verifyUserInputJsonSchema = z.toJSONSchema(
  verifyUserInputSchema.shape.params,
  { target: ZOD_JSON_SCHEMA_TARGET },
);
export const forgotPasswordInputJsonSchema = z.toJSONSchema(
  forgotPasswordInputSchema.shape.body,
  { target: ZOD_JSON_SCHEMA_TARGET },
);
export const resetPasswordParamsInputJsonSchema = z.toJSONSchema(
  resetPasswordInputSchema.shape.params,
  { target: ZOD_JSON_SCHEMA_TARGET },
);
export const resetPasswordBodyInputJsonSchema = z.toJSONSchema(
  resetPasswordInputSchema.shape.body,
  { target: ZOD_JSON_SCHEMA_TARGET },
);

export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
export type VerifyUserInput = z.infer<typeof verifyUserInputSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordInputSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;
