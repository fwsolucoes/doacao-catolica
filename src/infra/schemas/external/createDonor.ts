import { z } from "zod";

const createDonorResponseSchema = z.object({
  donator: z.object({ id: z.string() }),
});

export { createDonorResponseSchema };
