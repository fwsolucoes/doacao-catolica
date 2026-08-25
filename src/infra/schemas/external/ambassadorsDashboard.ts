import { z } from "zod";

const externalAmbassadorItemSchema = z.object({
  rank: z.number(),
  id: z.uuid(),
  project_id: z.uuid(),
  name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  status: z.string(),
  code: z.string(),
  created_at: z.string(),
  period_indications: z.number(),
  total_indications: z.number(),
  total_recurring_amount: z.number(),
  total_raised_amount: z.number(),
  total_paid_payments: z.number(),
});

const externalAmbassadorsDashboardSchema = z.object({
  success: z.boolean(),
  data: z.object({
    summary: z.object({
      total_ambassadors: z.number(),
      period_indications: z.number(),
      previous_period: z.object({
        start_date: z.string(),
        end_date: z.string(),
        period_indications: z.number(),
        variation_percent: z.number().nullable(),
      }),
      total_indications: z.number(),
      total_recurring_amount: z.number(),
      total_raised_amount: z.number(),
    }),
    charts: z.object({
      indications_by_day: z.array(
        z.object({
          date: z.string(),
          label: z.string(),
          total_indications: z.number(),
          total_amount: z.number(),
        }),
      ),
      donation_amount_ranges: z.array(
        z.object({
          key: z.string(),
          label: z.string(),
          total_payments: z.number(),
          total_amount: z.number(),
        }),
      ),
      payment_methods: z.array(
        z.object({
          type: z.string(),
          label: z.string(),
          total_payments: z.number(),
          total_amount: z.number(),
          percentage: z.number(),
        }),
      ),
    }),
    ambassadors: z.object({
      data: z.array(externalAmbassadorItemSchema),
      pagination: z.object({
        current_page: z.number(),
        per_page: z.number(),
        from: z.number(),
        to: z.number(),
        total: z.number(),
        last_page: z.number(),
      }),
    }),
  }),
});

type ExternalAmbassadorItem = z.infer<typeof externalAmbassadorItemSchema>;

export { externalAmbassadorsDashboardSchema, type ExternalAmbassadorItem };
