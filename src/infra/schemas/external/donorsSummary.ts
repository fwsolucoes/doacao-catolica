import { z } from "zod";

const donorsSummaryResponseSchema = z.object({
  data: z.object({
    total_donors: z.number(),
    recurring_donors: z.number(),
    one_time_donors: z.number(),
    new_donors_this_month: z.number(),
    new_donors_previous_month: z.number(),
    new_donors_variation_percentage: z.number().nullable(),
    total_recurring_amount: z.number(),
    average_donation_amount: z.number(),
  }),
});

export { donorsSummaryResponseSchema };
