import { z } from "zod";

const externalDonationsSummarySchema = z.object({
  message: z.string().optional(),
  data: z.object({
    period: z.object({
      start_date: z.string(),
      end_date: z.string(),
      previous_month_start_date: z.string(),
      previous_month_end_date: z.string(),
    }),
    average_ticket: z.object({
      period: z.number(),
      previous_month: z.number(),
      variation_percentage: z.number().nullable(),
    }),
    one_time_donations: z.object({
      count: z.number(),
      amount: z.number(),
    }),
    recurring_donations: z.object({
      count: z.number(),
      amount: z.number(),
    }),
    total_donations: z.object({
      count: z.number(),
      amount: z.number(),
    }),
    subscriptions: z.object({
      active_count: z.number(),
      active_amount: z.number(),
      created_in_period_count: z.number(),
      created_in_period_amount: z.number(),
      created_in_period_active_count: z.number(),
      created_in_period_active_amount: z.number(),
    }),
  }),
});

type ExternalDonationsSummary = z.infer<typeof externalDonationsSummarySchema>;

export { externalDonationsSummarySchema, type ExternalDonationsSummary };
