import { z } from "zod";
import { genericMessageResponseSchema } from "@/src/routes/common.response.schema.ts";

// create session response + headers
export const createSessionSuccessResponseSchema = z.object({
  accessToken: z.string(),
});
export type CreateSessionSuccessResponse = z.infer<
  typeof createSessionSuccessResponseSchema
>;

export const createSessionForbiddenResponseSchema =
  genericMessageResponseSchema;
export type CreateSessionForbiddenResponse = z.infer<
  typeof createSessionForbiddenResponseSchema
>;

export const createSessionConflictResponseSchema = genericMessageResponseSchema;
export type CreateSessionConflictResponse = z.infer<
  typeof createSessionConflictResponseSchema
>;

export const createSessionInternalServerErrorResponseSchema =
  genericMessageResponseSchema;
export type CreateSessionInternalServerErrorResponse = z.infer<
  typeof createSessionInternalServerErrorResponseSchema
>;

// refresh session response
export const refreshSessionSuccessResponseSchema =
  createSessionSuccessResponseSchema;
export type RefreshSessionSuccessResponse = z.infer<
  typeof refreshSessionSuccessResponseSchema
>;

export const refreshSessionUnauthorizedResponseSchema =
  genericMessageResponseSchema;
export type RefreshSessionUnauthorizedResponse = z.infer<
  typeof refreshSessionUnauthorizedResponseSchema
>;

// logout response
export const logoutSuccessResponseSchema = genericMessageResponseSchema;
export type LogoutSuccessResponse = z.infer<typeof logoutSuccessResponseSchema>;

export const logoutUnauthorizedResponseSchema = genericMessageResponseSchema;
export type LogoutUnauthorizedResponse = z.infer<
  typeof logoutUnauthorizedResponseSchema
>;
