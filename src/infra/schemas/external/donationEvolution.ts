import { z } from "zod";

const externalDonationEvolutionSchema = z.object({
  message: z.string(),
  data: z.object({
    days: z.array(
      z.object({
        day: z.number(),
        date: z.string(),
        one_time_amount: z.number(),
        recurring_amount: z.number(),
        total_amount: z.number(),
      }),
    ),
  }),
});

export { externalDonationEvolutionSchema };
