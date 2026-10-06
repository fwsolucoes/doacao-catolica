import { z } from "zod";

const externalMonthlyDonorsMonthSchema = z.object({
  key: z.string(),
  label: z.string(),
  start_date: z.string(),
  end_date: z.string(),
});

const externalMonthlyDonorsCampaignSchema = z.object({
  id: z.number(),
  uuid: z.string(),
  name: z.string(),
  reference: z.string().nullable(),
  reference_2: z.string().nullable(),
});

const externalMonthlyDonorSchema = z.object({
  customer_id: z.number(),
  customer_uuid: z.string(),
  name: z.string(),
  cpf_cnpj: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  campaign: externalMonthlyDonorsCampaignSchema,
  months: z.record(z.string(), z.number()),
  total_amount: z.number(),
});

const externalMonthlyDonorsPaginationSchema = z.object({
  current_page: z.number(),
  per_page: z.number(),
  last_page: z.number(),
  total: z.number(),
  from: z.number().nullable(),
  to: z.number().nullable(),
});

const externalMonthlyDonorsSchema = z.object({
  success: z.boolean(),
  data: z.object({
    months: z.array(externalMonthlyDonorsMonthSchema),
    pagination: externalMonthlyDonorsPaginationSchema,
    donors: z.array(externalMonthlyDonorSchema),
  }),
});

type ExternalMonthlyDonor = z.infer<typeof externalMonthlyDonorSchema>;

export { externalMonthlyDonorsSchema, type ExternalMonthlyDonor };
