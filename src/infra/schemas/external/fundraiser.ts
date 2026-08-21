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

export { externalFundraisersSchema, type ExternalFundraiser };
