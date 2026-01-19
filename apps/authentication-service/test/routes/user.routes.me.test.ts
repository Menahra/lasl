import {
  AUTHENTICATION_TYPE,
  authApiRoutes,
} from "@lasl/app-contracts/api/auth";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@lasl/app-contracts/locales";
import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "@lasl/test-utils-fastify/setup-utils";
import { checkSwaggerDoc } from "@lasl/test-utils-fastify/swagger-doc-utils";
import type { FastifyBaseLogger, FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { buildApp } from "@/src/app.ts";
import { UserModel } from "@/src/model/user.model.ts";
import { mockUserData } from "@/test/__mocks__/user.mock.ts";

const mockUserId = new mongoose.Types.ObjectId().toString();

vi.mock("@/src/util/jwt.util.ts", () => ({
  signJsonWebToken: vi.fn(),
  verifyJsonWebToken: () => ({ sub: mockUserId }),
}));

describe("user routes me", () => {
  let app: FastifyInstance;
  const currentUserEndpoint = authApiRoutes.user.me();

  const mockUser = {
    ...mockUserData,
    id: mockUserId,
    settings: {
      darkMode: false,
      uiLanguage: DEFAULT_LOCALE,
      contentLanguage: DEFAULT_LOCALE,
    },
  };

  const mockLogger: FastifyBaseLogger = {
    level: "debug",
    silent: vi.fn(),
    fatal: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    trace: vi.fn(),
    child: vi.fn(() => mockLogger),
  };

  beforeAll(async () => {
    app = await setupFastifyTestEnvironment({ buildApp, useMongo: true });
  });

  afterAll(async () => {
    await teardownFastifyTestEnvironment();
  });

  afterEach(async () => {
    await UserModel.deleteMany();
  });

  it.each([
    ["get", StatusCodes.OK],
    ["get", StatusCodes.UNAUTHORIZED],
    ["patch", StatusCodes.OK],
    ["patch", StatusCodes.BAD_REQUEST],
    ["patch", StatusCodes.UNAUTHORIZED],
  ] as const)("should include %s in Swagger documentation", (endpointMethod, statusCode) => {
    checkSwaggerDoc({
      fastifyInstance: app,
      endpointMethod,
      endpointPath: currentUserEndpoint,
      endpointStatusCode: statusCode,
      endpointContentType: "application/json",
      endpointResponseType:
        statusCode === StatusCodes.OK
          ? {
              id: { type: "string", minLength: 1 },
              email: {
                type: "string",
                format: "email",
                pattern:
                  "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
              },
              firstName: { type: "string", minLength: 1 },
              lastName: { type: "string", minLength: 1 },
              settings: {
                type: "object",
                properties: {
                  darkMode: { type: "boolean" },
                  uiLanguage: {
                    type: "string",
                    enum: [...SUPPORTED_LOCALES],
                  },
                  contentLanguage: {
                    type: "string",
                    enum: [...SUPPORTED_LOCALES],
                  },
                },
                additionalProperties: false,
                required: ["darkMode", "uiLanguage", "contentLanguage"],
              },
            }
          : {
              message: { type: "string", minLength: 1 },
            },
    });
  });

  it("should return the current authenticated user", async () => {
    await UserModel.create({
      ...mockUser,
      _id: mockUserId,
    });
    const token = "test234";

    const response = await app.inject({
      method: "GET",
      url: currentUserEndpoint,
      headers: {
        authorization: `${AUTHENTICATION_TYPE} ${token}`,
      },
    });

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.headers["content-type"]).toMatch(/application\/json/);

    const { password: _password, ...mockUserWithoutPassword } = mockUser;

    const body = response.json();
    expect(body).toEqual(mockUserWithoutPassword);
  });

  it("should update the current authenticated user", async () => {
    await UserModel.create({
      ...mockUser,
      _id: mockUserId,
    });

    const token = "test234";

    const update = {
      firstName: "Gunther",
      lastName: "Rüdiger",
      settings: {
        darkMode: true,
        uiLanguage: "de-DE",
        contentLanguage: "fr-FR",
      },
    };

    const response = await app.inject({
      method: "PATCH",
      url: currentUserEndpoint,
      headers: {
        authorization: `${AUTHENTICATION_TYPE} ${token}`,
      },
      body: update,
    });

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.headers["content-type"]).toMatch(/application\/json/);

    const { password: _password, ...mockUserWithoutPassword } = mockUser;
    const updatedUser = {
      ...mockUserWithoutPassword,
      ...update,
      id: mockUserId,
      settings: {
        ...mockUser.settings,
        ...update.settings,
      },
    };

    const body = response.json();
    expect(body).toEqual(updatedUser);
  });
});
