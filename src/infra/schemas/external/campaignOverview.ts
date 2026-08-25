import { z } from "zod";

const externalCampaignOverviewSchema = z.object({
  message: z.string(),
  data: z.object({
    total_raised: z.number(),
    month_raised: z.number(),
    previous_month_raised: z.number(),
    growth_percentage: z.number().nullable(),
    monthly_goal: z.number().nullable(),
    total_goal: z.number().nullable(),
    total_goal_progress_percentage: z.number().nullable(),
    monthly_goal_progress_percentage: z.number().nullable(),
    total_goal_remaining: z.number().nullable(),
    monthly_goal_remaining: z.number().nullable(),
    supporters: z.number(),
    new_supporters_last_7_days: z.number(),
    average_ticket_month: z.number(),
    average_ticket_previous_month: z.number(),
    average_ticket_variation_percentage: z.number().nullable(),
    one_time_customers: z.number(),
    recurring_customers: z.number(),
  }).nullable(),
});

export { externalCampaignOverviewSchema };
