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
import { getUserHandler } from "@/src/controller/get.user.controller.ts";
import { UserModel } from "@/src/model/user.model.ts";
import { serializeUser } from "@/src/serializer/user.serializer.ts";
import { mockUserDataWithSettings } from "@/test/__mocks__/user.mock.ts";

describe("getUserHandler", () => {
  beforeAll(async () => {
    await setupFastifyTestEnvironment({ buildApp, useMongo: true });
  });

  afterAll(async () => {
    await teardownFastifyTestEnvironment();
  });

  afterEach(async () => {
    await UserModel.deleteMany();
  });

  it("should respond with 200 and the user object from req", async () => {
    const user = await UserModel.create(mockUserDataWithSettings);
    const req = { userId: user._id.toString() };
    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    // @ts-expect-error ok in test
    await getUserHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(reply.send).toHaveBeenCalledWith(serializeUser(user));
  });

  it("should respond with 404 if there is no current authenticated user", async () => {
    const req = {};
    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    // @ts-expect-error ok in test
    await getUserHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Could not get current user",
    });
  });

  it("should respond with 404 if user cannot be found in database", async () => {
    const secondId = new mongoose.Types.ObjectId().toString();
    const req = {
      userId: secondId,
      log: { error: vi.fn() },
    };
    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    // @ts-expect-error ok in test
    await getUserHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Could not get current user",
    });
  });
});
