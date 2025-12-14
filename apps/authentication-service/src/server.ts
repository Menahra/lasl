import process from "node:process";
import { ENVIRONMENT } from "@/src/constants/environment.constants.ts";
import { buildApp } from "./app.ts";

const startAuthenticationServer = async () => {
  const app = await buildApp();

  const { [ENVIRONMENT.port]: port } = app.config;

  try {
    await app.listen({ host: "0.0.0.0", port });
  } catch (err) {
    app.log.error(
      err,
      "An error occured during start of the authentication-service",
    );
    process.exit(1);
  }
};

startAuthenticationServer();

export type {
  CreateSessionConflictResponse,
  CreateSessionForbiddenResponse,
  CreateSessionInternalServerErrorResponse,
  CreateSessionSuccessResponse,
  LogoutSuccessResponse,
  LogoutUnauthorizedResponse,
  RefreshSessionSuccessResponse,
  RefreshSessionUnauthorizedResponse,
} from "@/src/routes/auth.routes.schema.ts";
export type { HealthcheckSuccessResponse } from "@/src/routes/health.routes.schema.ts";
export type {
  CreateUserBadRequestResponse,
  CreateUserConflictResponse,
  CreateUserInternalServerErrorResponse,
  CreateUserSuccessResponse,
  CreateUserUnprocessableEntityResponse,
  ForgotPasswordSuccessResponse,
  GetCurrentAuthenticatedUserForbiddenResponse,
  GetCurrentAuthenticatedUserSuccessResponse,
  ResetPasswordBadRequestResponse,
  ResetPasswordInternalServerErrorResponse,
  ResetPasswordNotFoundResponse,
  ResetPasswordSuccessResponse,
  VerifyUserBadRequestResponse,
  VerifyUserConflictResponse,
  VerifyUserInternalServerErrorResponse,
  VerifyUserNotFoundResponse,
  VerifyUserSuccessResponse,
} from "@/src/routes/user.routes.schema.ts";
