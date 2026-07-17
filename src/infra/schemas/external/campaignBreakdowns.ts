import { z } from "zod";

const externalCampaignBreakdownsSchema = z.object({
  message: z.string(),
  data: z.object({
    payment_methods: z.array(
      z.object({
        payment_method: z.string(),
        donations_count: z.number(),
        total_amount: z.number(),
        percentage: z.number(),
      }),
    ),
    donation_ranges: z.array(
      z.object({
        label: z.string(),
        min_amount: z.number(),
        max_amount: z.number().nullable(),
        donations_count: z.number(),
      }),
    ),
    donor_profile: z.array(
      z.object({
        range: z.string(),
        donors_count: z.number(),
      }),
    ),
    conversion_funnel: z.object({
      page_visits: z.number(),
      registrations: z.number(),
      registrations_subscriptions: z.number(),
      registrations_transfers: z.number(),
      completed_donations: z.number(),
      completed_subscriptions: z.number(),
      completed_transfers: z.number(),
      conversion_percentage: z.number(),
    }),
  }),
});

export { externalCampaignBreakdownsSchema };
