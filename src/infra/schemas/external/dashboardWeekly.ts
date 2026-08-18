import { z } from "zod";

const externalDashboardWeeklySchema = z.object({
  message: z.string(),
  data: z.object({
    start_date: z.string(),
    end_date: z.string(),
    total_amount: z.number(),
    donations_count: z.number(),
    previous_week_amount: z.number(),
    growth_percentage: z.number().nullable(),
    days: z.array(
      z.object({
        date: z.string(),
        day_of_week: z.number(),
        label: z.string(),
        donations_count: z.number(),
        total_amount: z.number(),
      }),
    ),
  }),
});

export { externalDashboardWeeklySchema };
