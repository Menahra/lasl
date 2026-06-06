import { updatePasswordSchema } from "@lasl/app-contracts/schemas/user";
import { z } from "zod";

const ZOD_JSON_SCHEMA_TARGET = "draft-7";

export const updatePasswordInputSchema = z.object({
  body: updatePasswordSchema,
});

export const updatePasswordInputJsonSchema = z.toJSONSchema(
  updatePasswordInputSchema.shape.body,
  { target: ZOD_JSON_SCHEMA_TARGET },
);

export type UpdatePasswordInputSchemaType = z.infer<
  typeof updatePasswordInputSchema
>;
