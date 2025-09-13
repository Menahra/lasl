import mongoose from "mongoose";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createUser } from "@/src/service/user.service.ts";
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
});
