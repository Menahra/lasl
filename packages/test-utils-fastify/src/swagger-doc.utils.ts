import type { FastifyInstance } from "fastify";
import type { StatusCodes } from "http-status-codes";
import type { JSONSchema7 } from "json-schema";
import { expect } from "vitest";

export const checkSwaggerDoc = ({
  fastifyInstance,
  endpointPath,
  endpointMethod,
  endpointStatusCode,
  endpointContentType,
  endpointResponseType,
}: {
  fastifyInstance: FastifyInstance;
  endpointPath: string;
  endpointMethod: "get" | "patch" | "put" | "delete" | "post";
  endpointStatusCode: StatusCodes;
  endpointContentType: string;
  endpointResponseType: Record<string, JSONSchema7>;
}) => {
  // @ts-expect-error swagger should be injected into fastify instance
  const swaggerDocs = fastifyInstance.swagger();
  const response =
    swaggerDocs.paths?.[endpointPath]?.[endpointMethod]?.responses?.[
      endpointStatusCode
    ];

  if (!response || (typeof response === "object" && "$ref" in response)) {
    throw new Error(
      `Swagger response for ${endpointMethod.toUpperCase()} ${endpointPath} ${endpointStatusCode} missing or invalid`,
    );
  }

  const endpointProperties =
    response?.content?.[endpointContentType].schema.properties;

  // biome-ignore lint/suspicious/noMisplacedAssertion: this should be used in tests
  expect(endpointProperties).toEqual(endpointResponseType);
};
