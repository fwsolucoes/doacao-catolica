import { z } from "zod";

const createSubscriptionResponseSchema = z.object({
  data: z.object({ uuid: z.string() }),
});

export { createSubscriptionResponseSchema };
