import { SUPPORTED_LOCALES } from "@lasl/app-contracts/locales";
import { z } from "zod";
import { genericMessageResponseSchema } from "@/src/routes/common.response.schema.ts";
import { createUserInputSchema } from "@/src/schema/user.schema.ts";

// Create User Responses
export const createUserSuccessResponseSchema = genericMessageResponseSchema;
export type CreateUserSuccessResponse = z.infer<
  typeof createUserSuccessResponseSchema
>;

export const createUserBadRequestResponseSchema =
  genericMessageResponseSchema.extend({
    error: z.object({
      _errors: z.array(z.string()),
    }),
  });
export type CreateUserBadRequestResponse = z.infer<
  typeof createUserBadRequestResponseSchema
>;

export const createUserUnprocessableEntityResponseSchema =
  genericMessageResponseSchema.extend({
    errors: z.object({
      path: z.object(),
    }),
  });
export type CreateUserUnprocessableEntityResponse = z.infer<
  typeof createUserUnprocessableEntityResponseSchema
>;

export const createUserConflictResponseSchema = genericMessageResponseSchema;
export type CreateUserConflictResponse = z.infer<
  typeof createUserConflictResponseSchema
>;

export const createUserInternalServerErrorResponseSchema =
  genericMessageResponseSchema;
export type CreateUserInternalServerErrorResponse = z.infer<
  typeof createUserInternalServerErrorResponseSchema
>;

// Verify User Responses
export const verifyUserSuccessResponseSchema = genericMessageResponseSchema;
export type VerifyUserSuccessResponse = z.infer<
  typeof verifyUserSuccessResponseSchema
>;

export const verifyUserBadRequestResponseSchema = genericMessageResponseSchema;
export type VerifyUserBadRequestResponse = z.infer<
  typeof verifyUserBadRequestResponseSchema
>;

export const verifyUserNotFoundResponseSchema = genericMessageResponseSchema;
export type VerifyUserNotFoundResponse = z.infer<
  typeof verifyUserNotFoundResponseSchema
>;

export const verifyUserConflictResponseSchema = genericMessageResponseSchema;
export type VerifyUserConflictResponse = z.infer<
  typeof verifyUserConflictResponseSchema
>;

export const verifyUserInternalServerErrorResponseSchema =
  genericMessageResponseSchema;
export type VerifyUserInternalServerErrorResponse = z.infer<
  typeof verifyUserInternalServerErrorResponseSchema
>;

// Forgot Password Response
export const forgotPasswordSuccessResponseSchema = genericMessageResponseSchema;
export type ForgotPasswordSuccessResponse = z.infer<
  typeof forgotPasswordSuccessResponseSchema
>;

// Reset Password Response
export const resetPasswordSuccessResponseSchema = genericMessageResponseSchema;
export type ResetPasswordSuccessResponse = z.infer<
  typeof resetPasswordSuccessResponseSchema
>;

export const resetPasswordBadRequestResponseSchema =
  genericMessageResponseSchema;
export type ResetPasswordBadRequestResponse = z.infer<
  typeof resetPasswordBadRequestResponseSchema
>;

export const resetPasswordNotFoundResponseSchema = genericMessageResponseSchema;
export type ResetPasswordNotFoundResponse = z.infer<
  typeof resetPasswordNotFoundResponseSchema
>;

export const resetPasswordInternalServerErrorResponseSchema =
  genericMessageResponseSchema;
export type ResetPasswordInternalServerErrorResponse = z.infer<
  typeof resetPasswordInternalServerErrorResponseSchema
>;

// Get Current Authenticated User Response
export const getCurrentAuthenticatedUserSuccessResponseSchema =
  createUserInputSchema.shape.body
    .pick({
      email: true,
      firstName: true,
      lastName: true,
    })
    .extend({
      id: z.string().nonempty(),
      settings: z.object({
        darkMode: z.boolean(),
        uiLanguage: z.enum(SUPPORTED_LOCALES),
        contentLanguage: z.enum(SUPPORTED_LOCALES),
      }),
    });
export type GetCurrentAuthenticatedUserSuccessResponse = z.infer<
  typeof getCurrentAuthenticatedUserSuccessResponseSchema
>;

export const getCurrentAuthenticatedUserForbiddenResponseSchema =
  genericMessageResponseSchema;
export type GetCurrentAuthenticatedUserForbiddenResponse = z.infer<
  typeof getCurrentAuthenticatedUserForbiddenResponseSchema
>;

// Update User Response
export const updateCurrentAuthenticatedUserSuccessResponseSchema =
  getCurrentAuthenticatedUserSuccessResponseSchema;
export type UpdateCurrentAuthenticatedUserSuccessResponseSchema = z.infer<
  typeof updateCurrentAuthenticatedUserSuccessResponseSchema
>;

export const updateCurrentAuthenticatedUserBadRequestResponseSchema =
  genericMessageResponseSchema;
export type UpdateCurrentAuthenticatedUserBadRequestResponse = z.infer<
  typeof updateCurrentAuthenticatedUserBadRequestResponseSchema
>;

export const updateCurrentAuthenticatedUserForbiddenResponseSchema =
  genericMessageResponseSchema;
export type UpdateCurrentAuthenticatedUserForbiddenResponse = z.infer<
  typeof updateCurrentAuthenticatedUserForbiddenResponseSchema
>;
