import { REFRESH_TOKEN_COOKIE_NAME } from "@lasl/app-contracts/api/auth";
import { USER_ERRORS } from "@lasl/app-contracts/errors/user";
import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "@lasl/test-utils-fastify/setup-utils";
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
import { deleteUserHandler } from "@/src/controller/delete.user.controller.ts";
import { SessionModel } from "@/src/model/session.model.ts";
import { UserModel } from "@/src/model/user.model.ts";
import { mockUserDataWithSettings } from "@/test/__mocks__/user.mock.ts";

describe("delete user controller", () => {
  beforeAll(async () => {
    await setupFastifyTestEnvironment({ buildApp, useMongo: true });
  });

  afterAll(async () => {
    await teardownFastifyTestEnvironment();
  });

  afterEach(async () => {
    await UserModel.deleteMany();
    await SessionModel.deleteMany();
  });

  it("should respond with 401 if there is no current authenticated user", async () => {
    const req = {
      body: {
        password: "securePassword123",
      },
    };
    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    // @ts-expect-error ok in test
    await deleteUserHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(reply.send).toHaveBeenCalledWith({
      message: "User not authenticated",
    });
  });

  it("should respond with 404 if user cannot be found in database", async () => {
    const secondId = new mongoose.Types.ObjectId().toString();
    const req = {
      userId: secondId,
      sessionId: new mongoose.Types.ObjectId().toString(),
      body: {
        password: "securePassword123",
      },
      log: { error: vi.fn() },
    };
    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    // @ts-expect-error ok in test
    await deleteUserHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(reply.send).toHaveBeenCalledWith({
      message: "User not found",
    });
  });

  it("should respond with 403 if password is wrong", async () => {
    const user = await UserModel.create(mockUserDataWithSettings);
    const session = await SessionModel.create({ user: user._id });
    const req = {
      userId: user._id.toString(),
      sessionId: session._id.toString(),
      body: {
        password: "wrongPassword",
      },
      log: { error: vi.fn() },
    };
    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    // @ts-expect-error ok in test
    await deleteUserHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
    expect(reply.send).toHaveBeenCalledWith({
      message: USER_ERRORS.passwordIncorrect,
    });
  });

  it("should respond with 200, delete user, invalidate session, and clear cookie on success", async () => {
    const user = await UserModel.create(mockUserDataWithSettings);
    const session = await SessionModel.create({ user: user._id });

    const req = {
      userId: user._id.toString(),
      sessionId: session._id.toString(),
      body: {
        password: "securePassword123",
      },
      log: { error: vi.fn() },
    };
    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
      clearCookie: vi.fn().mockReturnThis(),
    };

    // @ts-expect-error ok in test
    await deleteUserHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Account deleted successfully",
    });

    const deletedUser = await UserModel.findById(user._id);
    expect(deletedUser).toBeNull();

    const invalidatedSession = await SessionModel.findById(session._id);
    expect(invalidatedSession?.valid).toBe(false);

    expect(reply.clearCookie).toHaveBeenCalledWith(
      REFRESH_TOKEN_COOKIE_NAME,
      expect.any(Object),
    );
  });
});
