import { deleteUserSchema } from "@lasl/app-contracts/schemas/user";
import { z } from "zod";

const ZOD_JSON_SCHEMA_TARGET = "draft-7";

export const deleteUserInputSchema = z.object({
  body: deleteUserSchema,
});

export const deleteUserInputJsonSchema = z.toJSONSchema(
  deleteUserInputSchema.shape.body,
  { target: ZOD_JSON_SCHEMA_TARGET },
);

export type DeleteUserInputSchemaType = z.infer<typeof deleteUserInputSchema>;
