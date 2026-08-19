import { z } from "zod";

const externalPixAuthorizationSummarySchema = z.object({
  message: z.string().optional(),
  data: z.object({
    total_authorizations: z.number(),
    active: z.number(),
    awaiting_authorization: z.number(),
    refused: z.number(),
    expired: z.number(),
    cancelled: z.number(),
    active_monthly_amount: z.number(),
    conversion_rate: z.number(),
    received_current_month_count: z.number(),
    received_current_month_amount: z.number(),
  }),
});

type ExternalPixAuthorizationSummary = z.infer<
  typeof externalPixAuthorizationSummarySchema
>;

export {
  externalPixAuthorizationSummarySchema,
  type ExternalPixAuthorizationSummary,
};
