import { createSessionSchema } from "@lasl/app-contracts/schemas/session";
import { z } from "zod";

export const createSessionInputSchema = z.object({
  body: createSessionSchema,
});

export type CreateSessionInputSchemaType = z.infer<
  typeof createSessionInputSchema
>;

export const createSessionJsonSchema = z.toJSONSchema(
  createSessionInputSchema.shape.body,
  { target: "draft-7" },
);
