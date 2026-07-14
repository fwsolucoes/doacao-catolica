import { z } from "zod";

const generatePaymentBookletResponseSchema = z.object({
  url: z.string().url(),
});

export { generatePaymentBookletResponseSchema };
