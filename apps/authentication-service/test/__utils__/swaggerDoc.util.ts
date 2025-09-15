import type { StatusCodes } from "http-status-codes";
import { expect } from "vitest";
import type { buildApp } from "@/src/app.ts";
import type { JSONSchema7 } from "json-schema";

export const checkSwaggerDoc = ({
  fastifyInstance,
  endpointPath,
  endpointMethod,
  endpointStatusCode,
  endpointContentType,
  endpointResponseType,
}: {
  fastifyInstance: Awaited<ReturnType<typeof buildApp>>;
  endpointPath: string;
  endpointMethod: "get" | "patch" | "put" | "delete" | "post";
  endpointStatusCode: StatusCodes;
  endpointContentType: string;
  endpointResponseType: Record<
    string,
    JSONSchema7
  >;
}) => {
  const swaggerDocs = fastifyInstance.swagger();
  const response =
    swaggerDocs.paths?.[endpointPath]?.[endpointMethod]?.responses?.[
      endpointStatusCode
    ];
  if (
    !response ||
    (typeof response === "object" && response !== null && "$ref" in response)
  ) {
    throw new Error(
      `Response for ${endpointMethod.toUpperCase()} ${endpointPath} ${endpointStatusCode} is a $ref or missing`,
    );
  }
  const endpointProperties =
    // @ts-expect-error we make sure above that it is not a ReferenceObject
    response?.content?.[endpointContentType].schema.properties;
  // biome-ignore lint/suspicious/noMisplacedAssertion: okay in this reusable util
  expect(endpointProperties).toEqual(endpointResponseType);
};
