import { z } from "zod";

export const healthcheckSuccessResponseSchema = z.object({
  status: z.string(),
  uptime: z.number(),
  message: z.string(),
});
export type HealthcheckSuccessResponse = z.infer<
  typeof healthcheckSuccessResponseSchema
>;
