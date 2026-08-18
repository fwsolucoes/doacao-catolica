import { z } from "zod";

const externalDashboardRecentDonationsSchema = z.object({
  message: z.string(),
  data: z.object({
    recent_donations: z.array(
      z.object({
        payment_uuid: z.string(),
        customer_name: z.string(),
        customer_reference: z.string(),
        customer_initials: z.string(),
        campaign_name: z.string(),
        account_reference: z.string(),
        payment_method: z.string(),
        status: z.string(),
        origin: z.string(),
        amount: z.number(),
        paid_at: z.string(),
        elapsed: z.string(),
      }),
    ),
  }),
});

export { externalDashboardRecentDonationsSchema };
