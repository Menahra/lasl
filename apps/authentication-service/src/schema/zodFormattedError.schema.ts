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
    $ref: `#/components/schemas/${ZodFormattedErrorSchemaId}`,
  },
};
