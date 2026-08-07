import { z } from "zod";

const donatorContactSchema = z.object({
  contact: z.object({
    id: z.string(),
  }),
});

export { donatorContactSchema };
