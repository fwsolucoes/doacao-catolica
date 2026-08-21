import { z } from "zod";

type ExternalFundraiser = z.infer<typeof externalFundraiserSchema>;

const externalFundraiserSchema = z.object({
  id: z.uuid(),
  project_id: z.uuid(),
  invite_status: z.string(),
  inviter_id: z.number(),
  invited_user_id: z.number().nullable(),
  invited_user_email: z.string(),
  invited_user_name: z.string(),
  invited_user_phone: z.string().nullable(),
  created_at: z.string(),
});

const externalFundraisersSchema = z.object({
  items: z.array(externalFundraiserSchema),
  total: z.number(),
  current_page: z.number(),
  per_page: z.number(),
  last_page: z.number(),
});

const externalFundraiserDetailsSchema = z.object({
  success: z.boolean(),
  data: z.object({
    affiliate_reference: z.string(),
    total_indications: z.number(),
    period: z.object({
      start_date: z.string().nullable(),
      end_date: z.string().nullable(),
      total_indications: z.number().nullable(),
      total_raised_amount: z.number().nullable().optional(),
    }),
    last_30_days: z.object({
      start_date: z.string(),
      end_date: z.string(),
      total_indications: z.number(),
      total_raised_amount: z.number(),
    }),
    total_recurring_amount: z.number(),
    donors: z.array(z.unknown()),
  }),
});

export { externalFundraisersSchema, externalFundraiserDetailsSchema, type ExternalFundraiser };
