import mongoose from "mongoose";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "@/src/service/user.service.ts";
import { mockUserData } from "../__mocks__/user.mock.ts";
import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "../__utils__/setup.utils.ts";

describe("User service", () => {
  beforeAll(async () => {
    await setupFastifyTestEnvironment();
  });

  afterAll(async () => {
    await teardownFastifyTestEnvironment();
  });

  beforeEach(async () => {
    await mongoose.connection.db?.dropDatabase();
  });

  it("should create user with valid data", async () => {
    const result = await createUser(mockUserData);
    expect(result).toBeDefined();
    expect(result.firstName).toEqual(mockUserData.firstName);
  });

  it("should handle database errors gracefully", async () => {
    await expect(createUser({})).rejects.toThrow();
  });

  it("should find user by ID", async () => {
    const created = await createUser(mockUserData);
    const found = await findUserById(created._id.toString());

    expect(found).not.toBeNull();
    expect(found?.email).toBe(mockUserData.email);
  });

  it("should return null for non-existing user ID", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const result = await findUserById(fakeId);
    expect(result).toBeNull();
  });

  it("should find user by email", async () => {
    await createUser(mockUserData);
    const found = await findUserByEmail(mockUserData.email);

    expect(found).not.toBeNull();
    expect(found?.firstName).toBe(mockUserData.firstName);
  });

  it("should return null for non-existing email", async () => {
    const result = await findUserByEmail("doesnotexist@example.com");
    expect(result).toBeNull();
  });
});
