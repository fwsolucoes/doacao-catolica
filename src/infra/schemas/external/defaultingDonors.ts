import { z } from "zod";

const externalDefaultingDonorSchema = z.object({
  customer_id: z.number(),
  name: z.string(),
  email: z.string(),
  // known format: "+5532998128318"
  phone: z.string().nullable(),
  unpaid_donations_count: z.number(),
  pending_amount: z.number(),
  created_at: z.string(),
  total_paid_amount: z.number(),
  total_paid_donations_count: z.number(),
});

const externalDefaultingDonorsSummarySchema = z.object({
  total_defaulting_donors: z.number(),
  total_pending_amount: z.number(),
  average_amount_per_donor: z.number(),
  average_monthly_amount: z.number(),
});

const externalDefaultingDonorsSchema = z.object({
  success: z.boolean(),
  data: z.object({
    summary: externalDefaultingDonorsSummarySchema,
    donors: z.array(externalDefaultingDonorSchema),
  }),
});

type ExternalDefaultingDonor = z.infer<typeof externalDefaultingDonorSchema>;


export { externalDefaultingDonorsSchema, type ExternalDefaultingDonor };
