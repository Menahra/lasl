import { buildApp } from "@/src/app.ts";
import { updateUserHandler } from "@/src/controller/update.user.controller.ts";
import { UserModel } from "@/src/model/user.model.ts";
import { mockUserDataWithSettings } from "@/test/__mocks__/user.mock.ts";
import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "@lasl/test-utils-fastify/setup-utils";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: ok in test
describe("update user controller", () => {
  beforeAll(async () => {
    await setupFastifyTestEnvironment({ buildApp, useMongo: true });
  });

  afterAll(async () => {
    await teardownFastifyTestEnvironment();
  });

  it("should respond with 404 if there is no current authenticated user", async () => {
    const req = {};
    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    // @ts-expect-error ok in test
    await updateUserHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(reply.send).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should respond with 404 if user cannot be found in database", async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const req = {
      user: { ...mockUserDataWithSettings, id },
      log: { error: vi.fn() },
    };
    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    // @ts-expect-error ok in test
    await updateUserHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(reply.send).toHaveBeenCalledWith({
      message: `Failed to update user with id ${id}`,
    });
  });

  it("should respond with 400 if user is found but cannot be updated", async () => {
    const error = new Error("some error");
    // biome-ignore lint/security/noSecrets: method name
    vi.spyOn(UserModel, "findByIdAndUpdate").mockRejectedValueOnce(error);
    const userUpdate = { firstName: "Gunther" };
    const id = "someId";
    const req = {
      user: { ...mockUserDataWithSettings, id },
      body: userUpdate,
      log: { error: vi.fn() },
    };
    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    // @ts-expect-error ok in test
    await updateUserHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Failed to update user",
    });
    expect(req.log.error).toHaveBeenCalledWith(
      error,
      `An error occurred during update for user: ${id}`,
    );
  });

  it("should respond with 200 if user was updated", async () => {
    const user = await UserModel.create(mockUserDataWithSettings);
    const userUpdate = { firstName: "Gunther" };
    const req = {
      user: { ...mockUserDataWithSettings, id: user._id.toString() },
      body: userUpdate,
      log: { error: vi.fn() },
    };
    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    // @ts-expect-error ok in test
    await updateUserHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.OK);

    await UserModel.deleteOne();
  });
});
