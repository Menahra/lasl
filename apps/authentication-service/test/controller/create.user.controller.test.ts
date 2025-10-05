import type { FastifyReply } from "fastify";
import { StatusCodes } from "http-status-codes";
import mongoose, { Error as MongooseError } from "mongoose";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  inject,
  it,
  vi,
} from "vitest";
import { createUserHandler } from "@/src/controller/create.user.controller.ts";
import { createUser } from "@/src/service/user.service.ts";
import { mockUserData, mockUserInputData } from "../__mocks__/user.mock.ts";
import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "../__utils__/setup.utils.ts";

vi.mock("@/src/service/user.service", () => ({
  createUser: vi.fn(),
}));

describe("User service", () => {
  const mongoDbUri = inject("MONGO_DB_URI");

  const mockReply = (): FastifyReply => {
    const reply = {
      status: vi.fn(),
      send: vi.fn(),
    };
    reply.status = vi.fn().mockReturnValue(reply);
    reply.send = vi.fn().mockReturnValue(reply);
    return reply as unknown as FastifyReply;
  };

  const req = {
    body: mockUserData,
    server: {
      sendMail: vi.fn(),
    },
    headers: {},
  };

  beforeAll(async () => {
    await setupFastifyTestEnvironment();

    await mongoose.connect(mongoDbUri);
  });

  afterAll(async () => {
    await teardownFastifyTestEnvironment();

    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await mongoose.connection.db?.dropDatabase();
    vi.clearAllMocks();
  });

  it("should create a user and return 200", async () => {
    (createUser as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      firstName: mockUserInputData.firstName,
      email: mockUserInputData.email,
      verificationCode: "Test245",
    });

    const reply = mockReply();

    // @ts-expect-error ok in test
    await createUserHandler(req, reply);

    expect(createUser).toHaveBeenCalledWith(mockUserData);
    expect(reply.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(reply.send).toHaveBeenCalledWith({
      message: "User successfully created",
    });
  });

  it("should return 422 for validation error", async () => {
    const error = new MongooseError.ValidationError();
    error.message = "Validation failed";

    (createUser as ReturnType<typeof vi.fn>).mockRejectedValueOnce(error);
    const reply = mockReply();

    // @ts-expect-error ok in test
    await createUserHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(reply.send).toHaveBeenCalledWith({
      message: `Could not create user due to validation failure: ${error.message}`,
      errors: error.errors,
    });
  });

  it("should return 409 if user already exists", async () => {
    const duplicateError = new Error("Duplicate key") as Error & {
      code: number;
    };
    duplicateError.code = 11000;

    (createUser as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      duplicateError,
    );

    const reply = mockReply();

    // @ts-expect-error ok in test
    await createUserHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.CONFLICT);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Account already exists",
    });
  });

  it("should return 500 for unknown error", async () => {
    const unknownError = new Error("Something went wrong");

    (createUser as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      unknownError,
    );

    const reply = mockReply();

    // @ts-expect-error ok in test
    await createUserHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
    expect(reply.send).toHaveBeenCalledWith({
      message: `Unexpected error occurred: ${unknownError}`,
    });
  });
});
