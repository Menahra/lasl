// biome-ignore lint/security/noSecrets: just a name no secret
export const ZodFormattedErrorSchemaId = "ZodFormattedError";
export const ZodFormattedErrorSchema = {
  type: "object",
  required: ["_errors"],
  properties: {
    _errors: {
      type: "array",
      items: { type: "string" },
    },
  },
  additionalProperties: {
    // Recursive reference to the schema itself
    $ref: ZodFormattedErrorSchemaId,
  },
};
