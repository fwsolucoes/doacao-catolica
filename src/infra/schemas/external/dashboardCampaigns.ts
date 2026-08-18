import { z } from "zod";

const externalDashboardCampaignsSchema = z.object({
  message: z.string(),
  data: z.object({
    total: z.number(),
    campaigns: z.array(
      z.object({
        account_reference: z.string(),
        name: z.string(),
        donors_count: z.number(),
        month_raised: z.number(),
        total_raised: z.number(),
        monthly_goal: z.number().nullable(),
        total_goal: z.number().nullable(),
        progress_percentage: z.number().nullable(),
      }),
    ),
  }),
});

export { externalDashboardCampaignsSchema };
