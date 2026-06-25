import { z } from "zod";

const externalDonorContactInfoSchema = z.object({
  phone: z.string().nullable(),
  whatsapp: z.string().nullable(),
  email: z.string().nullable(),
});

const externalDonorContactSchema = z.object({
  name: z.string(),
  cpf: z.string().nullable(),
  birth_date: z.string().nullable(),
  contact_info: externalDonorContactInfoSchema,
});

const externalDonorItemSchema = z.object({
  id: z.string(),
  contact_id: z.string(),
  is_recurrent: z.boolean(),
  created_at: z.string(),
  contact: externalDonorContactSchema,
});

const externalDonorsListSchema = z.object({
  data: z.array(externalDonorItemSchema),
  meta: z.object({
    currentPage: z.number(),
    itemsPerPage: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
  }),
});

type ExternalDonorItem = z.infer<typeof externalDonorItemSchema>;

export { externalDonorsListSchema, type ExternalDonorItem };
