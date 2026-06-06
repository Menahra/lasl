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
import { updatePasswordHandler } from "@/src/controller/update.password.controller.ts";
import { UserModel } from "@/src/model/user.model.ts";
import { mockUserDataWithSettings } from "@/test/__mocks__/user.mock.ts";

describe("update password controller", () => {
  beforeAll(async () => {
    await setupFastifyTestEnvironment({ buildApp, useMongo: true });
  });

  afterAll(async () => {
    await teardownFastifyTestEnvironment();
  });

  afterEach(async () => {
    await UserModel.deleteMany();
  });

  it("should respond with 401 if there is no current authenticated user", async () => {
    const req = {
      body: {
        currentPassword: "securePassword123",
        password: "NewSecurePassword123",
        passwordConfirmation: "NewSecurePassword123",
      },
    };
    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    // @ts-expect-error ok in test
    await updatePasswordHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(reply.send).toHaveBeenCalledWith({
      message: "User not authenticated",
    });
  });

  it("should respond with 404 if user cannot be found in database", async () => {
    const secondId = new mongoose.Types.ObjectId().toString();
    const req = {
      userId: secondId,
      body: {
        currentPassword: "securePassword123",
        password: "NewSecurePassword123",
        passwordConfirmation: "NewSecurePassword123",
      },
      log: { error: vi.fn() },
    };
    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    // @ts-expect-error ok in test
    await updatePasswordHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(reply.send).toHaveBeenCalledWith({
      message: "User not found",
    });
  });

  it("should respond with 403 if current password is wrong", async () => {
    const user = await UserModel.create(mockUserDataWithSettings);
    const req = {
      userId: user._id.toString(),
      body: {
        currentPassword: "wrongPassword",
        password: "NewSecurePassword123",
        passwordConfirmation: "NewSecurePassword123",
      },
      log: { error: vi.fn() },
    };
    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    // @ts-expect-error ok in test
    await updatePasswordHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
    expect(reply.send).toHaveBeenCalledWith({
      message: USER_ERRORS.passwordIncorrect,
    });
  });

  it("should respond with 200 if password was successfully updated", async () => {
    const user = await UserModel.create(mockUserDataWithSettings);
    const req = {
      userId: user._id.toString(),
      body: {
        currentPassword: "securePassword123",
        password: "NewSecurePassword123",
        passwordConfirmation: "NewSecurePassword123",
      },
      log: { error: vi.fn() },
    };
    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    // @ts-expect-error ok in test
    await updatePasswordHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Password changed successfully",
    });

    const updatedUser = await UserModel.findById(user._id);
    const isValid = await updatedUser!.validatePassword("NewSecurePassword123");
    expect(isValid).toBe(true);
  });
});
