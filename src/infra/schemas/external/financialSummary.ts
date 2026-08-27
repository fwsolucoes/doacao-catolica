import { z } from "zod";

const externalFinancialSummaryCampaignSchema = z.object({
  id: z.number(),
  uuid: z.string(),
  name: z.string(),
  // known values: "active" | "inactive"
  status: z.string(),
  total_raised_amount: z.number(),
  online_amount: z.number(),
  offline_amount: z.number(),
  available_balance: z.number(),
  average_ticket: z.number(),
  total_paid_payments: z.number(),
});

const externalFinancialSummarySchema = z.object({
  success: z.boolean(),
  data: z.object({
    summary: z.object({
      total_raised_amount: z.number(),
      online_amount: z.number(),
      offline_amount: z.number(),
      available_balance: z.number(),
      average_ticket: z.number(),
      total_paid_payments: z.number(),
      total_campaigns: z.number(),
    }),
    campaigns: z.array(externalFinancialSummaryCampaignSchema),
  }),
});

type ExternalFinancialSummary = z.infer<typeof externalFinancialSummarySchema>;

export { externalFinancialSummarySchema, type ExternalFinancialSummary };
