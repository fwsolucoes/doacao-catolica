import { z } from "zod";

const externalAnnualEvolutionSchema = z.object({
  message: z.string(),
  data: z.object({
    year: z.number(),
    monthly_goal: z.number().nullable(),
    period_goal: z.number().nullable(),
    total_amount: z.number(),
    months: z.array(
      z.object({
        month: z.number(),
        month_key: z.string(),
        label: z.string(),
        donations_count: z.number(),
        total_amount: z.number(),
        goal_amount: z.number().nullable(),
        goal_progress_percentage: z.number().nullable(),
      }),
    ),
  }),
});

export { externalAnnualEvolutionSchema };
