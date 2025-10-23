import fastifySwagger, {
  type FastifyDynamicSwaggerOptions,
} from "@fastify/swagger";
import fastifySwaggerUi, {
  type FastifySwaggerUiOptions,
} from "@fastify/swagger-ui";
import type { FastifyBaseLogger, FastifyInstance } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import type { OpenAPIV3 } from "openapi-types";
import { ENVIRONMENT } from "@/src/config/environment.config.ts";

type MicroServiceConfiguration = {
  name: string;
  prefix: string;
  swaggerUrl: string;
};

const getMicroServiceConfigurations = (
  fastifyInstance: FastifyInstance,
): MicroServiceConfiguration[] => [
  {
    name: "Authentication Service",
    prefix: "/auth",
    swaggerUrl: `${fastifyInstance.config[ENVIRONMENT.authenticationServiceUrl]}/documentation/json`,
  },
];

const fetchMicroServiceSpecification = async (
  service: MicroServiceConfiguration,
  logger: FastifyBaseLogger,
): Promise<{
  paths: OpenAPIV3.PathsObject;
  components: OpenAPIV3.ComponentsObject;
  tags: OpenAPIV3.TagObject[];
}> => {
  try {
    const response = await fetch(service.swaggerUrl, {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const spec = (await response.json()) as OpenAPIV3.Document;

    // Pfade mit Service-Prefix anpassen
    const adjustedPaths: OpenAPIV3.PathsObject = {};
    for (const [path, pathItem] of Object.entries(spec.paths || {})) {
      const newPath = `${service.prefix}${path}`;
      adjustedPaths[newPath] = pathItem;
    }

    // Tags mit Service-Name prefixen
    const adjustedTags = (spec.tags || []).map((tag) => ({
      ...tag,
      name: `${service.name}:${tag.name}`,
      description: tag.description
        ? `[${service.name}] ${tag.description}`
        : "",
    }));

    // Components mit Namespace versehen
    const adjustedComponents: OpenAPIV3.ComponentsObject = {};

    if (spec.components?.schemas) {
      adjustedComponents.schemas = {};
      for (const [key, value] of Object.entries(spec.components.schemas)) {
        adjustedComponents.schemas[`${service.name}_${key}`] = value;
      }
    }

    if (spec.components?.securitySchemes) {
      adjustedComponents.securitySchemes = spec.components.securitySchemes;
    }

    if (spec.components?.responses) {
      adjustedComponents.responses = {};
      for (const [key, value] of Object.entries(spec.components.responses)) {
        adjustedComponents.responses[`${service.name}_${key}`] = value;
      }
    }

    if (spec.components?.parameters) {
      adjustedComponents.parameters = {};
      for (const [key, value] of Object.entries(spec.components.parameters)) {
        adjustedComponents.parameters[`${service.name}_${key}`] = value;
      }
    }

    if (spec.components?.requestBodies) {
      adjustedComponents.requestBodies = {};
      for (const [key, value] of Object.entries(
        spec.components.requestBodies,
      )) {
        adjustedComponents.requestBodies[`${service.name}_${key}`] = value;
      }
    }

    logger.info({
      paths: adjustedPaths,
      components: adjustedComponents,
      tags: adjustedTags,
    });

    return {
      paths: adjustedPaths,
      components: adjustedComponents,
      tags: adjustedTags,
    };
  } catch (error) {
    logger.warn(
      `Fehler beim Laden der Swagger-Spec mit URL ${service.swaggerUrl} von ${service.name}: ${error}`,
    );
    return { paths: {}, components: {}, tags: [] };
  }
};

let cachedMergedSpec: OpenAPIV3.Document | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 60000;

const mergeMicroServiceSpecifications = async (
  port: number,
  fastifyInstance: FastifyInstance,
  useCache = true,
): Promise<OpenAPIV3.Document> => {
  // Cache prüfen
  const now = Date.now();
  if (useCache && cachedMergedSpec && now - lastCacheTime < CACHE_TTL) {
    fastifyInstance.log.debug("Verwende gecachte Swagger-Spec");
    return cachedMergedSpec;
  }

  let mergedSpecification: OpenAPIV3.Document = {
    openapi: "3.0.0",
    info: {
      title: "API Gateway Documentation",
      description:
        "Zusammengeführte API-Dokumentation aller Microservices. Diese Dokumentation aggregiert die Endpunkte aller verfügbaren Services.",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "API Gateway",
      },
    ],
    paths: {},
    components: {
      schemas: {},
      securitySchemes: {},
      responses: {},
      parameters: {},
      requestBodies: {},
    },
    tags: [
      {
        name: "gateway",
        description: "API Gateway Endpunkte",
      },
    ],
  };

  const microServices = getMicroServiceConfigurations(fastifyInstance);

  fastifyInstance.log.info(
    `Lade Swagger-Specs von ${microServices.length} Microservice(s)...`,
  );

  const fetchPromises = microServices.map((service) =>
    fetchMicroServiceSpecification(service, fastifyInstance.log),
  );

  const serviceSpecifications = await Promise.all(fetchPromises);

  for (const [index, serviceSpecification] of serviceSpecifications.entries()) {
    mergedSpecification = {
      ...mergedSpecification,
      paths: {
        ...mergedSpecification.paths,
        ...serviceSpecification.paths,
      },
      components: {
        ...mergedSpecification.components,
        schemas: {
          ...mergedSpecification.components?.schemas,
          ...serviceSpecification.components.schemas,
        },
        securitySchemes: {
          ...mergedSpecification.components?.securitySchemes,
          ...serviceSpecification.components.securitySchemes,
        },
        responses: {
          ...mergedSpecification.components?.responses,
          ...serviceSpecification.components.responses,
        },
        parameters: {
          ...mergedSpecification.components?.parameters,
          ...serviceSpecification.components.parameters,
        },
        requestBodies: {
          ...mergedSpecification.components?.requestBodies,
          ...serviceSpecification.components.requestBodies,
        },
      },
      tags: [...(mergedSpecification.tags ?? []), ...serviceSpecification.tags],
    };

    fastifyInstance.log.info(
      `✓ Spec von ${microServices[index].name} erfolgreich geladen`,
    );
  }

  // Cache aktualisieren
  cachedMergedSpec = mergedSpecification;
  lastCacheTime = now;

  fastifyInstance.log.info(mergedSpecification, "this is merged spec");

  return mergedSpecification;
};

export const fastifySwaggerPlugin = fastifyPlugin(async (fastifyInstance) => {
  const { [ENVIRONMENT.applicationHostPort]: port } = fastifyInstance.config;

  // Initiale Spec laden
  const initialSpec = await mergeMicroServiceSpecifications(
    port,
    fastifyInstance,
    false,
  );

  const swaggerConfig: FastifyDynamicSwaggerOptions = {
    mode: "dynamic",
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "API Gateway Documentation",
        description:
          "Zusammengeführte API-Dokumentation aller Microservices. Diese Dokumentation aggregiert die Endpunkte aller verfügbaren Services.",
        version: "1.0.0",
      },
      servers: [{ url: "http://localhost:3000", description: "API Gateway" }],
      paths: {
        "/auth/api/v1/healthcheck": {
          get: {
            summary: "Healthcheck Endpoint",
            tags: ["Health"],
            description:
              "Checks if the authentication service is running and healthy.",
            responses: {
              "200": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        status: { type: "string" },
                        message: { type: "string" },
                        uptime: { type: "number" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/auth/api/v1/users": {
          post: {
            summary: "Create New Users",
            tags: ["User"],
            description:
              "This endpoint is used to create new users via the post method.",
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      firstName: { type: "string", minLength: 1 },
                      lastName: { type: "string", minLength: 1 },
                      email: {
                        type: "string",
                        format: "email",
                        pattern:
                          "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
                      },
                      password: {
                        type: "string",
                        minLength: 8,
                        allOf: [
                          { type: "string", pattern: "[A-Z]" },
                          { type: "string", pattern: "[a-z]" },
                          { type: "string", pattern: "\\d" },
                        ],
                      },
                      passwordConfirmation: { type: "string", minLength: 1 },
                    },
                    required: [
                      "firstName",
                      "lastName",
                      "email",
                      "password",
                      "passwordConfirmation",
                    ],
                    additionalProperties: false,
                  },
                },
              },
              required: true,
            },
            responses: {
              "200": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } },
                    },
                  },
                },
              },
              "400": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: { type: "string" },
                        error: { $ref: "#/components/schemas/def-0" },
                      },
                    },
                  },
                },
              },
              "409": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } },
                    },
                  },
                },
              },
              "422": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: { type: "string" },
                        errors: {
                          type: "object",
                          properties: { path: { type: "object" } },
                        },
                      },
                    },
                  },
                },
              },
              "500": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } },
                    },
                  },
                },
              },
            },
          },
        },
        "/auth/api/v1/users/verify/{id}/{verificationCode}": {
          get: {
            summary: "Verify a specific user",
            tags: ["User"],
            description:
              "After a user was created a verification code is sent to the given mail. This then needs to passed via this endpoint to fully verify the user.",
            parameters: [
              {
                schema: { type: "string" },
                in: "path",
                name: "id",
                required: true,
              },
              {
                schema: { type: "string" },
                in: "path",
                name: "verificationCode",
                required: true,
              },
            ],
            responses: {
              "200": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } },
                    },
                  },
                },
              },
              "400": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } },
                    },
                  },
                },
              },
              "404": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } },
                    },
                  },
                },
              },
              "409": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } },
                    },
                  },
                },
              },
              "500": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } },
                    },
                  },
                },
              },
            },
          },
        },
        "/auth/api/v1/users/forgotpassword": {
          post: {
            summary: "User forgot the password",
            tags: ["User"],
            description:
              "Users can request a new password if they forgot the current one",
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      email: {
                        type: "string",
                        format: "email",
                        pattern:
                          "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
                      },
                    },
                    required: ["email"],
                    additionalProperties: false,
                  },
                },
              },
              required: true,
            },
            responses: {
              "200": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } },
                    },
                  },
                },
              },
            },
          },
        },
        "/auth/api/v1/users/resetpassword/{id}/{passwordResetCode}": {
          post: {
            summary: "Reset the current password",
            tags: ["User"],
            description:
              "User resets the password with the reset code he got via mail and a new password",
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      password: {
                        type: "string",
                        minLength: 8,
                        allOf: [
                          { type: "string", pattern: "[A-Z]" },
                          { type: "string", pattern: "[a-z]" },
                          { type: "string", pattern: "\\d" },
                        ],
                      },
                      passwordConfirmation: { type: "string", minLength: 1 },
                    },
                    required: ["password", "passwordConfirmation"],
                    additionalProperties: false,
                  },
                },
              },
              required: true,
            },
            parameters: [
              {
                schema: { type: "string" },
                in: "path",
                name: "id",
                required: true,
              },
              {
                schema: { type: "string" },
                in: "path",
                name: "passwordResetCode",
                required: true,
              },
            ],
            responses: {
              "200": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } },
                    },
                  },
                },
              },
              "400": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } },
                    },
                  },
                },
              },
              "404": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } },
                    },
                  },
                },
              },
              "500": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } },
                    },
                  },
                },
              },
            },
          },
        },
        "/auth/api/v1/users/me": {
          get: {
            summary: "Get the current authenticated user",
            tags: ["User"],
            description:
              "Send the authorization header in format 'Bearer {accessToken}' and receive the user information",
            parameters: [
              {
                schema: { type: "string" },
                in: "header",
                name: "authorization",
                required: true,
              },
            ],
            responses: {
              "200": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        email: { type: "string" },
                        firstName: { type: "string" },
                        lastName: { type: "string" },
                      },
                    },
                  },
                },
              },
              "401": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } },
                    },
                  },
                },
              },
            },
          },
        },
        "/auth/api/v1/sessions": {
          post: {
            summary: "Create a new session",
            tags: ["Session"],
            description:
              "Use this endpoint to create a new session for a user. It will return the accessToken and refreshToken",
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      email: {
                        type: "string",
                        minLength: 1,
                        format: "email",
                        pattern:
                          "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
                      },
                      password: { type: "string", minLength: 8 },
                    },
                    required: ["email", "password"],
                    additionalProperties: false,
                  },
                },
              },
              required: true,
            },
            responses: {
              "200": {
                description: "Default Response",
                headers: {
                  "Set-Cookie": {
                    schema: {
                      type: "string",
                      example:
                        "refreshToken=abc123; HttpOnly; Path=/auth/refresh; Max-Age=604800",
                    },
                    description:
                      "HTTP-only cookie named `refreshToken` used for session renewal.",
                  },
                },
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { accessToken: { type: "string" } },
                    },
                  },
                },
              },
              "403": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } },
                    },
                  },
                },
              },
              "409": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } },
                    },
                  },
                },
              },
              "500": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } },
                    },
                  },
                },
              },
            },
          },
        },
        "/auth/api/v1/sessions/refresh": {
          post: {
            summary: "Refresh the session",
            tags: ["Session"],
            description:
              "Use this endpoint to refresh the current active session and get a new access token",
            responses: {
              "200": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { accessToken: { type: "string" } },
                    },
                  },
                },
              },
              "401": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } },
                    },
                  },
                },
              },
            },
          },
        },
        "/auth/api/v1/sessions/logout": {
          post: {
            summary: "Logout the current session",
            tags: ["Session"],
            description:
              "Invalidates the session and clears the refresh token cookie",
            responses: {
              "200": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } },
                    },
                  },
                },
              },
              "401": {
                description: "Default Response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { message: { type: "string" } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      components: {
        schemas: {
          "Authentication Service_def-0": {
            type: "object",
            required: ["_errors"],
            properties: {
              _errors: { type: "array", items: { type: "string" } },
            },
            additionalProperties: { $ref: "#/components/schemas/def-0" },
            title: "ZodFormattedError",
          },
        },
        securitySchemes: {},
        responses: {},
        parameters: {},
        requestBodies: {},
      },
      tags: [{ name: "gateway", description: "API Gateway Endpunkte" }],
    },
  };

  await fastifyInstance.register(fastifySwagger, swaggerConfig);

  const swaggerUiConfig: FastifySwaggerUiOptions = {
    routePrefix: "/documentation",
  };

  await fastifyInstance.register(fastifySwaggerUi, swaggerUiConfig);

  // Endpoint zum manuellen Neuladen der Dokumentation
  fastifyInstance.get("/documentation/reload", async (_request, reply) => {
    try {
      fastifyInstance.log.info("Lade Swagger-Dokumentation neu...");
      const newSpec = await mergeMicroServiceSpecifications(
        port,
        fastifyInstance,
        false,
      );

      // Swagger-Spec aktualisieren
      // @ts-ignore - swagger() ist zur Laufzeit verfügbar
      fastifyInstance.swagger({ openapi: newSpec });

      return {
        success: true,
        message: "Dokumentation erfolgreich neu geladen",
        services: getMicroServiceConfigurations(fastifyInstance).map(
          (microService) => microService.name,
        ),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      fastifyInstance.log.error(
        "Fehler beim Neuladen der Dokumentation:",
        error,
      );
      return reply.code(500).send({
        success: false,
        message: "Fehler beim Neuladen der Dokumentation",
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    }
  });

  fastifyInstance.log.info(
    `Swagger-Dokumentation verfügbar unter http://localhost:${port}/documentation`,
  );
});
