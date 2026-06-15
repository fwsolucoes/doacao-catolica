import { z } from "zod";

const externalContactItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  cpf: z.string().nullable().optional(),
  birth_date: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  contactInfo: z
    .object({
      email: z.string().nullable().optional(),
      phone: z.string().nullable().optional(),
    })
    .optional()
    .nullable(),
});

const listContactsSchema = z.object({
  items: z.array(externalContactItemSchema),
  current_page: z.number(),
  total: z.number(),
  last_page: z.number(),
});

type ExternalContactItem = z.infer<typeof externalContactItemSchema>;

export { listContactsSchema, type ExternalContactItem };
