import { createSessionSchema } from "@lasl/app-contracts/schemas/session";
import { z } from "zod";

export const createSessionJsonSchema = z.toJSONSchema(
  createSessionSchema.shape.body,
  { target: "draft-7" },
);
