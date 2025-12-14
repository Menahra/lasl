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
import { getApiVersionPathPrefix } from "@/src/util/api.path.util.ts";
import { mockUserInputData } from "../__mocks__/user.mock.ts";

describe("user routes", () => {
  let app: FastifyInstance;
  const apiPathPrefix = getApiVersionPathPrefix(1);

  const mockDbUser = {
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
    const postUsersEndpointPath = `${apiPathPrefix}/users`;

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
    ])(
      `there there should be a swagger documentation for post ${postUsersEndpointPath} with $statusCode status code`,
      ({ statusCode, responseType }) => {
        checkSwaggerDoc({
          fastifyInstance: app,
          endpointMethod: "post",
          endpointPath: postUsersEndpointPath,
          endpointStatusCode: statusCode,
          endpointContentType: "application/json",
          endpointResponseType: responseType,
        });
      },
    );
  });

  describe("verify code route", () => {
    const verifyCodePath = `${apiPathPrefix}/users/verify/${new mongoose.Types.ObjectId().toHexString()}/${mockDbUser.verificationCode}`;
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
        endpointPath: `${apiPathPrefix}/users/verify/{id}/{verificationCode}`,
        endpointStatusCode: statusCode,
        endpointContentType: "application/json",
        endpointResponseType: {
          message: { type: "string" as const, minLength: 1 },
        },
      });
    });
  });

  describe("POST /users/forgotpassword", () => {
    const forgotPasswordPath = `${apiPathPrefix}/users/forgotpassword`;
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
  });

  describe("POST /users/resetpassword/:id/:passwordResetCode", () => {
    const mockResetCode = "Test928";
    const resetPasswordPath = `${apiPathPrefix}/users/resetpassword/${new mongoose.Types.ObjectId().toHexString()}/${mockResetCode}`;

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
        endpointPath: `${apiPathPrefix}/users/resetpassword/{id}/{passwordResetCode}`,
        endpointStatusCode: statusCode,
        endpointContentType: "application/json",
        endpointResponseType: {
          message: { type: "string", minLength: 1 },
        },
      });
    });
  });
});
