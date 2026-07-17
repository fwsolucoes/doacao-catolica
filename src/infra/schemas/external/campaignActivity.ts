import { z } from "zod";

const externalCampaignActivitySchema = z.object({
  message: z.string(),
  data: z.object({
    recent_donations: z.array(
      z.object({
        payment_uuid: z.string(),
        customer_name: z.string(),
        customer_reference: z.string(),
        payment_method: z.string(),
        // known values: "confirmed" | "pending" | "failed" | "cancelled"
        status: z.string(),
        // known values: "subscription" | "one_time"
        origin: z.string(),
        amount: z.number(),
        paid_at: z.string(),
      }),
    ),
    top_donors: z.array(
      z.object({
        customer_uuid: z.string(),
        customer_reference: z.string(),
        customer_name: z.string(),
        donations_count: z.number(),
        total_amount: z.number(),
      }),
    ),
  }),
});

export { externalCampaignActivitySchema };
