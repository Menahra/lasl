import { buildApp } from "@/src/app.ts";
import { getApiVersionPathPrefix } from "@/src/util/api.path.util.ts";
import {
  JWT_ACCESS_PRIVATE_KEYNAME,
  JWT_ACCESS_PUBLIC_KEYNAME,
  JWT_REFRESH_PRIVATE_KEYNAME,
  JWT_REFRESH_PUBLIC_KEYNAME,
  signJsonWebToken,
} from "@/src/util/jwt.util.ts";
import { mockUserData } from "@/test/__mocks__/user.mock.ts";
import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "@lasl/test-utils-fastify/setup-utils";
import type { FastifyBaseLogger, FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  mockPrivateKeyBase64,
  mockPublicKeyBase64,
} from "@/test/__mocks__/jwt.mock.ts";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@lasl/app-contracts/locales";
import mongoose from "mongoose";
import { UserModel } from "@/src/model/user.model.ts";
import { checkSwaggerDoc } from "@lasl/test-utils-fastify/swagger-doc-utils";

const mockedEnvironmentConfig = {
  jwtAccessPrivateKey: "",
  jwtAccessPublicKey: "",
  jwtRefreshPrivateKey: "",
  jwtRefreshPublicKey: "",
};

vi.mock("@/src/config/environment.ts", async (importOriginalEnvironment) => {
  const { ENVIRONMENT, getEnvironmentConfig } =
    await importOriginalEnvironment<
      typeof import("@/src/config/environment.ts")
    >();

  return {
    // biome-ignore lint/style/useNamingConvention: ok here
    ENVIRONMENT: {
      ...ENVIRONMENT,
      jwtAccessPrivateKey: JWT_ACCESS_PRIVATE_KEYNAME,
      jwtAccessPublicKey: JWT_ACCESS_PUBLIC_KEYNAME,
      jwtRefreshPrivateKey: JWT_REFRESH_PRIVATE_KEYNAME,
      jwtRefreshPublicKey: JWT_REFRESH_PUBLIC_KEYNAME,
    },
    getEnvironmentConfig: () => ({
      ...getEnvironmentConfig(),
      ...mockedEnvironmentConfig,
    }),
  };
});

describe("user routes me", () => {
  let app: FastifyInstance;
  const apiPathPrefix = getApiVersionPathPrefix(1);
  const currentUserEndpoint = `${apiPathPrefix}/users/me`;

  const mockUser = {
    ...mockUserData,
    id: new mongoose.Types.ObjectId().toString(),
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

  beforeEach(() => {
    mockedEnvironmentConfig.jwtAccessPrivateKey = mockPrivateKeyBase64;
    mockedEnvironmentConfig.jwtAccessPublicKey = mockPublicKeyBase64;
    mockedEnvironmentConfig.jwtRefreshPrivateKey = mockPrivateKeyBase64;
    mockedEnvironmentConfig.jwtRefreshPublicKey = mockPublicKeyBase64;
    vi.clearAllMocks();
  });

  beforeAll(async () => {
    app = await setupFastifyTestEnvironment({ buildApp, useMongo: true });
  });

  afterAll(async () => {
    await teardownFastifyTestEnvironment();
  });

  it.each([
    ["get", StatusCodes.OK],
    ["get", StatusCodes.UNAUTHORIZED],
    ["patch", StatusCodes.OK],
    ["patch", StatusCodes.BAD_REQUEST],
    ["patch", StatusCodes.UNAUTHORIZED],
  ] as const)(
    "should include %s in Swagger documentation",
    (endpointMethod, statusCode) => {
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
    },
  );

  it("should return the current authenticated user", async () => {
    const token = signJsonWebToken(
      mockUser,
      JWT_ACCESS_PRIVATE_KEYNAME,
      {},
      mockLogger,
    );

    const response = await app.inject({
      method: "GET",
      url: currentUserEndpoint,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.headers["content-type"]).toMatch(/application\/json/);

    const { password: _password, ...mockUserWithoutPassword } = mockUser;

    const body = response.json();
    expect(body).toEqual(mockUserWithoutPassword);
  });

  it("should update the current authenticated user", async () => {
    const createdUser = await UserModel.create(mockUser);
    const fakeUser = {
      ...mockUser,
      id: createdUser._id.toString(),
    };

    const token = signJsonWebToken(
      fakeUser,
      JWT_ACCESS_PRIVATE_KEYNAME,
      {},
      mockLogger,
    );

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
        authorization: `Bearer ${token}`,
      },
      body: update,
    });

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.headers["content-type"]).toMatch(/application\/json/);

    const { password: _password, ...mockUserWithoutPassword } = mockUser;
    const updatedUser = {
      ...mockUserWithoutPassword,
      ...update,
      id: createdUser._id.toString(),
      settings: {
        ...mockUser.settings,
        ...update.settings,
      },
    };

    const body = response.json();
    expect(body).toEqual(updatedUser);
  });
});
