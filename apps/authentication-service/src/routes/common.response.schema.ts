import { z } from "zod";

export const genericMessageResponseSchema = z.object({
  message: z.string().nonempty(),
});
