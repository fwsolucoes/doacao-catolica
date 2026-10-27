import { z } from "zod";

const createOneTimePaymentResponseSchema = z.object({
  data: z.object({ uuid: z.string(), payment_uuid: z.string() }),
});

export { createOneTimePaymentResponseSchema };
