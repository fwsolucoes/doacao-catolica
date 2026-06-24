import { z } from "zod";

type ExternalCampaign = z.infer<typeof externalCampaignSchema>;

const externalCampaignSchema = z.object({
  account_id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  status: z.boolean(),
  published: z.boolean(),
  image: z.string().nullable(),
  image_mobile: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
  slug: z.string(),
  api_donation_public_id: z.string().nullable(),
  address: z.string().nullable(),
  cnpj: z.string().nullable(),
  email: z.string().nullable(),
  institution_name: z.string().nullable(),
  phone: z.string().nullable(),
  no_end_date: z.boolean(),
  type: z.number(),
  type_donation: z.string(),
  id: z.string(),
  subaccount_id: z.string(),
  color_palette: z.string().nullable(),
  featured_image: z.string().nullable(),
  featured_image_array: z.any().nullable(),
  featured_video: z.any(),
  template: z.any(),
  last_revenue: z.any(),
  monthy_goal: z.any(),
  revenue_exists: z.boolean(),
  already_has_revenue: z.boolean().optional(),
  current_revenue: z.string().optional(),
  monthly_goal: z.string().optional(),
  total_goal: z.string().nullable(),
});

const listCampaignsSchema = z.object({
  data: z.array(externalCampaignSchema),
  meta: z.object({
    currentPage: z.number(),
    itemsPerPage: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
    sortBy: z.array(z.string()),
  }),
});

export { externalCampaignSchema, listCampaignsSchema, type ExternalCampaign };
