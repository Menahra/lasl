import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "@lasl/test-utils-fastify/setup-utils";
import { isDocument } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { buildApp } from "@/src/app.ts";
import { SessionModel } from "@/src/model/session.model.ts";
import { UserModel } from "@/src/model/user.model.ts";
import { mockUserData } from "../__mocks__/user.mock.ts";

describe("Session Model", () => {
  beforeAll(async () => {
    await setupFastifyTestEnvironment({ buildApp, useMongo: true });
  });

  afterAll(async () => {
    await teardownFastifyTestEnvironment();
  });

  beforeEach(async () => {
    await mongoose.connection.db?.dropDatabase();
  });

  it("should create a session with a valid user reference", async () => {
    const user = await new UserModel(mockUserData).save();

    const session = await SessionModel.create({ user: user._id });

    expect(session).toBeDefined();
    expect(session.user.toString()).toBe(user._id.toString());
    expect(session.valid).toBe(true);
    expect(session.createdAt).toBeInstanceOf(Date);
    expect(session.updatedAt).toBeInstanceOf(Date);
  });

  it("should allow setting valid to false", async () => {
    const user = await new UserModel(mockUserData).save();

    const session = await SessionModel.create({
      user: user._id,
      valid: false,
    });

    expect(session.valid).toBe(false);
  });

  it("should populate the user reference", async () => {
    const user = await new UserModel(mockUserData).save();

    const session = await SessionModel.create({ user: user._id });

    const found = await SessionModel.findById(session._id).populate("user");

    expect(found).toBeTruthy();

    if (found && isDocument(found.user)) {
      expect(found.user.email).toBe(mockUserData.email);
    } else {
      throw new Error("User reference was not populated");
    }
  });

  it("should set createdAt and updatedAt timestamps", async () => {
    const user = await new UserModel(mockUserData).save();

    const session = await SessionModel.create({ user: user._id });

    expect(session.createdAt).toBeInstanceOf(Date);
    expect(session.updatedAt).toBeInstanceOf(Date);
  });

  it("should update updatedAt when valid is changed", async () => {
    const user = await new UserModel(mockUserData).save();
    const session = await SessionModel.create({ user: user._id });

    const originalUpdatedAt = session.updatedAt;

    // Wait a tick
    await new Promise((resolve) => setTimeout(resolve, 1));

    session.valid = false;
    const updatedSession = await session.save();

    expect(updatedSession.updatedAt?.getTime()).toBeGreaterThan(
      originalUpdatedAt?.getTime() ?? 0,
    );
  });

  it("should throw if user reference is missing", async () => {
    const session = new SessionModel({});
    await expect(session.save()).rejects.toThrow();
  });
});
