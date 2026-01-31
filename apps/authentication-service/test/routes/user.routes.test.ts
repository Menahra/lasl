import { authApiRoutes } from "@lasl/app-contracts/api/auth";
import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "@lasl/test-utils-fastify/setup-utils";
import { checkSwaggerDoc } from "@lasl/test-utils-fastify/swagger-doc-utils";
import type { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { buildApp } from "@/src/app.ts";
import * as userService from "@/src/service/user.service.ts";
import { mockUserInputData } from "../__mocks__/user.mock.ts";

describe("user routes", () => {
  let app: FastifyInstance;

  const mockDbUser = {
    _id: new mongoose.Types.ObjectId().toString(),
    firstName: mockUserInputData.firstName,
    email: mockUserInputData.email,
    verificationCode: "Test1234",
  };

  beforeAll(async () => {
    app = await setupFastifyTestEnvironment({ buildApp, useMongo: true });
  });

  afterAll(async () => {
    await teardownFastifyTestEnvironment();
  });

  describe("create user route", () => {
    const postUsersEndpointPath = authApiRoutes.user.create();

    it("should create a user and return 200", async () => {
      // @ts-expect-error correct that ts complains here
      vi.spyOn(userService, "createUser").mockResolvedValueOnce(mockDbUser);

      const response = await app.inject({
        method: "POST",
        url: postUsersEndpointPath,
        payload: mockUserInputData,
      });

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.json()).toEqual({
        message: "User successfully created",
      });
    });

    it.each([
      {
        statusCode: StatusCodes.OK,
        responseType: { message: { type: "string" as const, minLength: 1 } },
      },
      {
        statusCode: StatusCodes.BAD_REQUEST,
        responseType: {
          message: { type: "string" as const, minLength: 1 },
          error: {
            additionalProperties: false,
            properties: {
              _errors: {
                items: {
                  type: "string" as const,
                },
                type: "array" as const,
              },
            },
            required: ["_errors"],
            type: "object" as const,
          },
        },
      },
      {
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
        responseType: {
          message: { type: "string" as const, minLength: 1 },
          errors: {
            additionalProperties: false,
            required: ["path"],
            type: "object" as const,
            properties: {
              path: {
                type: "object" as const,
                additionalProperties: false,
                properties: {},
              },
            },
          },
        },
      },
      {
        statusCode: StatusCodes.TOO_MANY_REQUESTS,
        responseType: {
          message: { type: "string" as const },
          error: { enum: ["Too Many Requests"], type: "string" as const },
          statusCode: {
            enum: [StatusCodes.TOO_MANY_REQUESTS],
            type: "number" as const,
          },
        },
      },
    ])(`there there should be a swagger documentation for post ${postUsersEndpointPath} with $statusCode status code`, ({
      statusCode,
      responseType,
    }) => {
      checkSwaggerDoc({
        fastifyInstance: app,
        endpointMethod: "post",
        endpointPath: postUsersEndpointPath,
        endpointStatusCode: statusCode,
        endpointContentType: "application/json",
        endpointResponseType: responseType,
      });
    });
  });

  describe("verify code route", () => {
    const verifyCodePath = authApiRoutes.user.verify(
      new mongoose.Types.ObjectId().toHexString(),
      mockDbUser.verificationCode,
    );
    it("should verify user and return 200", async () => {
      // @ts-expect-error correct that ts complains here
      vi.spyOn(userService, "findUserById").mockResolvedValueOnce({
        ...mockDbUser,
        save: vi.fn(),
      });

      const response = await app.inject({
        method: "GET",
        url: verifyCodePath,
      });

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.json()).toEqual({
        message: "User successfully verified",
      });
    });

    it.each([
      StatusCodes.OK,
      StatusCodes.BAD_REQUEST,
      StatusCodes.NOT_FOUND,
      StatusCodes.CONFLICT,
      StatusCodes.INTERNAL_SERVER_ERROR,
    ])("should include %s in Swagger docs", (statusCode) => {
      checkSwaggerDoc({
        fastifyInstance: app,
        endpointMethod: "get",
        endpointPath: authApiRoutes.user.verify("{id}", "{verificationCode}"),
        endpointStatusCode: statusCode,
        endpointContentType: "application/json",
        endpointResponseType: {
          message: { type: "string" as const, minLength: 1 },
        },
      });
    });

    it("should include Swagger doc for rate limiting", () => {
      checkSwaggerDoc({
        fastifyInstance: app,
        endpointMethod: "get",
        endpointPath: authApiRoutes.user.verify("{id}", "{verificationCode}"),
        endpointStatusCode: StatusCodes.TOO_MANY_REQUESTS,
        endpointContentType: "application/json",
        endpointResponseType: {
          message: { type: "string" },
          error: {
            enum: ["Too Many Requests"],
            type: "string",
          },
          statusCode: {
            enum: [StatusCodes.TOO_MANY_REQUESTS],
            type: "number",
          },
        },
      });
    });
  });

  describe("POST resend verification mail", () => {
    const resendVerificationMailPath =
      authApiRoutes.user.resendVerificationMail();
    it("should trigger resend verification mail flow and return 200", async () => {
      // @ts-expect-error correct that ts complains here
      vi.spyOn(userService, "findUserByEmail").mockResolvedValueOnce({
        ...mockDbUser,
        save: vi.fn(),
      });

      const response = await app.inject({
        method: "POST",
        url: resendVerificationMailPath,
        payload: { email: "test123@test.de" },
      });

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.json()).toEqual({
        message:
          "If an unverified user exists for this email a new verification mail has been sent",
      });
    });

    it("should include 200 in Swagger documentation", () => {
      checkSwaggerDoc({
        fastifyInstance: app,
        endpointMethod: "post",
        endpointPath: resendVerificationMailPath,
        endpointStatusCode: StatusCodes.OK,
        endpointContentType: "application/json",
        endpointResponseType: {
          message: { type: "string", minLength: 1 },
        },
      });
    });

    it("should include Swagger doc for rate limiting", () => {
      checkSwaggerDoc({
        fastifyInstance: app,
        endpointMethod: "post",
        endpointPath: resendVerificationMailPath,
        endpointStatusCode: StatusCodes.TOO_MANY_REQUESTS,
        endpointContentType: "application/json",
        endpointResponseType: {
          message: { type: "string" },
          error: {
            enum: ["Too Many Requests"],
            type: "string",
          },
          statusCode: {
            enum: [StatusCodes.TOO_MANY_REQUESTS],
            type: "number",
          },
        },
      });
    });
  });

  describe("POST /users/forgotpassword", () => {
    const forgotPasswordPath = authApiRoutes.user.forgotPassword();
    it("should trigger forgot password flow and return 200", async () => {
      // @ts-expect-error correct that ts complains here
      vi.spyOn(userService, "findUserByEmail").mockResolvedValueOnce({
        ...mockDbUser,
        save: vi.fn(),
      });

      const response = await app.inject({
        method: "POST",
        url: forgotPasswordPath,
        payload: { email: "test123@test.de" },
      });

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.json()).toEqual({
        message:
          "If a user with that email is registered, you will receive a password reset email",
      });
    });

    it("should include 200 in Swagger documentation", () => {
      checkSwaggerDoc({
        fastifyInstance: app,
        endpointMethod: "post",
        endpointPath: forgotPasswordPath,
        endpointStatusCode: StatusCodes.OK,
        endpointContentType: "application/json",
        endpointResponseType: {
          message: { type: "string", minLength: 1 },
        },
      });
    });

    it("should include Swagger doc for rate limiting", () => {
      checkSwaggerDoc({
        fastifyInstance: app,
        endpointMethod: "post",
        endpointPath: forgotPasswordPath,
        endpointStatusCode: StatusCodes.TOO_MANY_REQUESTS,
        endpointContentType: "application/json",
        endpointResponseType: {
          message: { type: "string" },
          error: {
            enum: ["Too Many Requests"],
            type: "string",
          },
          statusCode: {
            enum: [StatusCodes.TOO_MANY_REQUESTS],
            type: "number",
          },
        },
      });
    });
  });

  describe("POST /users/resetpassword/:id/:passwordResetCode", () => {
    const mockResetCode = "Test928";
    const resetPasswordPath = authApiRoutes.user.resetPassword(
      new mongoose.Types.ObjectId().toHexString(),
      mockResetCode,
    );

    it("should reset user password and return 200", async () => {
      // @ts-expect-error correct that ts complains here
      vi.spyOn(userService, "findUserById").mockResolvedValueOnce({
        ...mockDbUser,
        save: vi.fn(),
        passwordResetCode: mockResetCode,
      });

      const response = await app.inject({
        method: "POST",
        url: resetPasswordPath,
        payload: {
          password: "NewPass1",
          passwordConfirmation: "NewPass1",
        },
      });

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.json()).toEqual({
        message: "Password successfully changed",
      });
    });

    it.each([
      StatusCodes.OK,
      StatusCodes.BAD_REQUEST,
      StatusCodes.NOT_FOUND,
      StatusCodes.INTERNAL_SERVER_ERROR,
    ])("should include %s in Swagger documentation", (statusCode) => {
      checkSwaggerDoc({
        fastifyInstance: app,
        endpointMethod: "post",
        endpointPath: authApiRoutes.user.resetPassword(
          "{id}",
          "{passwordResetCode}",
        ),
        endpointStatusCode: statusCode,
        endpointContentType: "application/json",
        endpointResponseType: {
          message: { type: "string", minLength: 1 },
        },
      });
    });

    it("should include Swagger doc for rate limiting", () => {
      checkSwaggerDoc({
        fastifyInstance: app,
        endpointMethod: "post",
        endpointPath: authApiRoutes.user.resetPassword(
          "{id}",
          "{passwordResetCode}",
        ),
        endpointStatusCode: StatusCodes.TOO_MANY_REQUESTS,
        endpointContentType: "application/json",
        endpointResponseType: {
          message: { type: "string" },
          error: {
            enum: ["Too Many Requests"],
            type: "string",
          },
          statusCode: {
            enum: [StatusCodes.TOO_MANY_REQUESTS],
            type: "number",
          },
        },
      });
    });
  });
});
