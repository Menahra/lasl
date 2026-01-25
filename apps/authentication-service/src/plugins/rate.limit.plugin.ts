import fastifyRateLimit from "@fastify/rate-limit";
import { BYPASS_RATE_LIMIT_HEADER_NAME } from "@lasl/app-contracts/api/headers";
import fastifyPlugin from "fastify-plugin";
import { StatusCodes } from "http-status-codes";
import type { OpenAPIV3 } from "openapi-types";
import { z } from "zod";
import { rateLimitErrorSchema } from "@/src/schema/rate.limit.error.schema.ts";

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: ok for plugin
export const fastifyRateLimitPlugin = fastifyPlugin(async (fastifyInstance) => {
  const {
    config: { NODE_ENV, RATELIMIT_BYPASS_KEY },
  } = fastifyInstance;

  const rateLimitHeaders: Record<string, OpenAPIV3.HeaderObject> = {
    "x-ratelimit-limit": {
      schema: { type: "integer" },
      description:
        "The maximum number of requests allowed within the time window.",
    },
    "x-ratelimit-remaining": {
      schema: { type: "integer" },
      description: "The number of requests remaining in the current window.",
    },
    "x-ratelimit-reset": {
      schema: { type: "integer" },
      description: "The time (in seconds) remaining until the limit resets.",
    },
    "retry-after": {
      schema: { type: "integer" },
      description:
        "The number of seconds to wait before making a new request (returned on 429).",
    },
  };

  await fastifyInstance.register(fastifyRateLimit, {
    global: true,

    max: 5,
    timeWindow: "1 minute",

    allowList: (req) => {
      if (NODE_ENV === "production") {
        return false;
      }

      const bypassKey = RATELIMIT_BYPASS_KEY;

      return (
        Boolean(bypassKey) &&
        req.headers[BYPASS_RATE_LIMIT_HEADER_NAME] === bypassKey
      );
    },
  });

  fastifyInstance.addHook("onRoute", (routeOptions) => {
    const hasRateLimit = routeOptions.config?.rateLimit !== false;

    if (hasRateLimit) {
      routeOptions.schema = routeOptions.schema || {};
      routeOptions.schema.response = routeOptions.schema.response || {};

      const responses = routeOptions.schema.response as Record<
        string,
        OpenAPIV3.ResponseObject
      >;

      const successKey = StatusCodes.OK.toString();
      if (responses[successKey]) {
        responses[successKey].headers = {
          ...(responses[successKey].headers ?? {}),
          ...rateLimitHeaders,
        };
      }

      const errorKey = StatusCodes.TOO_MANY_REQUESTS.toString();
      if (!responses[errorKey]) {
        const errorSchema = z.toJSONSchema(
          rateLimitErrorSchema,
        ) as OpenAPIV3.SchemaObject;

        responses[errorKey] = {
          description: "Rate limit exceeded",
          headers: rateLimitHeaders,
          content: {
            "application/json": {
              schema: errorSchema,
            },
          },
        };
      }
    }
  });
});
