import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export const rateLimitErrorSchema = z
  .object({
    statusCode: z.literal(StatusCodes.TOO_MANY_REQUESTS),
    error: z.literal("Too Many Requests"),
    message: z.string(),
  })
  .describe("Rate limit exceeded response");
