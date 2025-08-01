import { Ajv } from "ajv";
import {
  mainSchema,
  sectionContainerSchema,
  styleSchema,
  textSchema,
} from "./schema-definition/index.js";

export const createSchemaCompiler = (
  schemaIdentifier = "http://example.com/main.schema.json",
) => {
  const ajvInstance = new Ajv({
    schemas: [mainSchema, sectionContainerSchema, styleSchema, textSchema],
  });

  return ajvInstance.getSchema(schemaIdentifier);
};

export const validateSchema = (
  dataToValidate: unknown,
  schemaIdentifier = "http://example.com/main.schema.json",
) => {
  const schemaCompiler = createSchemaCompiler(schemaIdentifier);

  if (!schemaCompiler) {
    console.error(
      `Could not get a schema compiler, did you provide a wrong schema identifier (${schemaIdentifier})?`,
    );
    return;
  }

  const valid = schemaCompiler(dataToValidate);
  if (!valid) {
    console.error(schemaCompiler.errors);
  }

  return valid;
};
