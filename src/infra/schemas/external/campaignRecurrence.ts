import { z } from "zod";

const externalCampaignRecurrenceSchema = z.object({
  message: z.string(),
  data: z.object({
    months: z.array(
      z.object({
        month: z.string(),
        label: z.string(),
        active_subscriptions: z.number(),
        recurring_donations: z.number(),
        recurring_amount: z.number(),
      }),
    ),
  }),
});

export { externalCampaignRecurrenceSchema };
