import { StatusCodes } from "http-status-codes";
import { describe, expect, it, vi } from "vitest";
import { getUserHandler } from "@/src/controller/get.user.controller.ts";

describe("getUserHandler", () => {
  it("should respond with 200 and the user object from req", () => {
    const user = { id: "123", email: "test@example.com" };
    const req = { user };
    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    // @ts-expect-error ok in test
    getUserHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(reply.send).toHaveBeenCalledWith(user);
  });
});
