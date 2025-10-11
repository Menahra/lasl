import { StatusCodes } from "http-status-codes";
import { describe, expect, it, type Mock, vi } from "vitest";
import { deserializeUser } from "@/src/middleware/authentication.hook.ts";
import { verifyJsonWebToken } from "@/src/util/jwt.util.ts";

vi.mock("@/src/util/jwt.util");

describe("deserializeUser middleware", () => {
  it("should return 401 if no authorization header", () => {
    const req = { headers: {} };
    const send = vi.fn().mockReturnThis();
    const status = vi.fn(() => ({ send }));
    const reply = { status };

    // @ts-expect-error ok in test context
    deserializeUser(req, reply);

    expect(status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(send).toHaveBeenCalledWith({
      message: "Missing or malformed token",
    });
  });

  it("should return 401 if authorization header is malformed", () => {
    const req = { headers: { authorization: "BadToken xyz" } };
    const send = vi.fn().mockReturnThis();
    const status = vi.fn(() => ({ send }));
    const reply = { status };

    // @ts-expect-error ok in test context
    deserializeUser(req, reply);

    expect(status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(send).toHaveBeenCalledWith({
      message: "Missing or malformed token",
    });
  });

  it("should assign req.user when token is valid", () => {
    const fakePayload = { id: "user1", email: "test@example.com" };
    (verifyJsonWebToken as Mock).mockReturnValue(fakePayload);

    const req = {
      headers: { authorization: "Bearer validtoken" },
      log: { warn: vi.fn() },
    };
    const reply = { status: vi.fn() };

    // @ts-expect-error ok in test context
    deserializeUser(req, reply);

    // @ts-expect-error ok in test context
    expect(req.user).toEqual(fakePayload);
    expect(reply.status).not.toHaveBeenCalled(); // No error
  });

  it("should return 401 if token is invalid", () => {
    (verifyJsonWebToken as Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const req = {
      headers: { authorization: "Bearer invalidtoken" },
      log: { warn: vi.fn() },
    };

    const send = vi.fn().mockReturnThis();
    const status = vi.fn(() => ({ send }));
    const reply = { status };

    // @ts-expect-error ok in test context
    deserializeUser(req, reply);

    expect(status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(send).toHaveBeenCalledWith({ message: "Invalid access token" });
    expect(req.log.warn).toHaveBeenCalled();
  });
});
