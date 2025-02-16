import Ajv, { type JSONSchemaType } from "ajv";

export const createSchemaCompiler = <T>(schemaToCompile: JSONSchemaType<T>) => {
	const ajvInstance = new Ajv();
	return ajvInstance.compile(schemaToCompile);
};

export const validateSchema = <T>(
	schemaToCompile: JSONSchemaType<T>,
	dataToValidate: unknown,
) => {
	const schemaCompiler = createSchemaCompiler(schemaToCompile);
	const valid = schemaCompiler(dataToValidate);

	if (!valid) {
		console.error(schemaCompiler.errors);
	}

	return valid;
};
